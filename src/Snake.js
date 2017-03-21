// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableOpacity,
  ScrollView,
  WebView,
  Button,
  Switch,
  Slider,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import wordSplit from './wordSplit'
import Header from './Header'
import OptionsPicker from './Options'

import type {Data, Scripture, Tag} from './types'

const letters = 'abcdefghijk'

type Tile = {
  type: 'head'
} | {
  type: 'tail',
} | {
  type: 'word',
  index: number,
  spaces: number,
  orientation: 'vertical' | 'horizontal',
} | {
  type: 'word-rest',
  index: number,
} | {
  type: 'empty',
}

const makeBoard = (size) => {
  const board = []
  for (let y=0; y<size; y++) {
    board.push([])
    for (let x=0; x<size; x++) {
      board[y].push({type: 'empty'})
    }
  }
  return board
}

const placeWord = (board: Tile[][], index: number, size: number) => {
  let x, y
  let tries = 100
  while (tries-- > 0) {
    y = Math.floor(Math.random() * board.length)
    x = Math.floor(Math.random() * (board.length - size))
    let good = true
    for (let i=0; i<size; i++) {
      if (board[y][x + i].type !== 'empty') {
        good = false
        break
      }
    }
    if (!good) continue
    board[y][x] = {
      type: 'word',
      index,
      spaces: size,
      orientation: 'horizontal',
    }
    for (let i=1; i<size; i++) {
      board[y][x + i] = {
        type: 'word-rest',
        index,
      }
    }
    break
  }
}

type GameProps = {
  words: string[],
  wordSizes: number[],
  size: {width: number, height: number},
  options: {wordsAtOnce: number},
  boardSize: number,
  textStyle: any,
}

class Game extends React.Component {
  props: GameProps
  state: {
    board: Tile[][],
  }
  _int: *

  constructor({words, wordSizes, size: {width, height}, scripture: {text, keywords}, options: {wordsAtOnce}, boardSize}: GameProps) {
    super()

    const x = boardSize / 2 | 0
    const y = x
    const board = makeBoard(boardSize)
    const snake = [[x, y], [x - 1, y], [x - 2, y]]
    board[y][x] = {
      type: 'head',
    }
    snake.slice(1).forEach(([x, y]) => board[y][x] = {
      type: 'tail',
    })

    const dim = Math.min(width, height)
    const scale = dim / boardSize

    const margin = 10
    for (let i=0; i<wordsAtOnce; i++) {
      placeWord(board, i, Math.ceil((margin + wordSizes[i]) / scale))
    }

    this.state = {
      words,
      snake,
      board,
      gotten: 0,
    }
  }

  componentWillMount() {
    /*
    this._int = setInterval(() => {
      this.setState({board: makeBoard(this.props.boardSize)})
    }, 100)
    */
  }

  componentWillUnmount() {
    clearInterval(this._int)
  }

  render() {
    const {size: {width, height}, boardSize, words} = this.props
    const dim = Math.min(width, height)
    const scale = dim / boardSize
    return <View
    >
      {this.state.board.map((row, y) => (
        row.map((item, x) => {
          const pos = {
            left: x * scale,
            top: y * scale,
            width: scale,
            height: scale,
          }
          const k = `${x}:${y}`
          if (item.type === 'word-rest') return
          if (item.type === 'word-rest' || item.type === 'empty') {
            return <View style={[styles.tile, pos]} key={k} />
          }
          if (item.type === 'head') {
            return <View style={[styles.tile, pos]} key={k}>
              <View style={styles.head} />
            </View>
          }
          if (item.type === 'tail') {
            return <View style={[styles.tile, pos]} key={k}>
              <View style={styles.tail} />
            </View>
          }
          return <View style={[styles.tile, pos, {
            width: scale * item.spaces,
            zIndex: 100,
          }]} key={k}>
            <Text style={this.props.textStyle}>
              {words[item.index]}
            </Text>
          </View>
        })
      ))}
    </View>
  }
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fee',
    position: 'absolute',
    backgroundColor: 'white',
  },

  head: {
    flex: 1,
    alignSelf: 'stretch',
    margin: 3,
    backgroundColor: '#afa',
    borderRadius: 5,
  },

  tail: {
    flex: 1,
    alignSelf: 'stretch',
    margin: 3,
    backgroundColor: '#aaf',
  },
})

class Measurer extends React.Component {
  state: {size: ?{width: number, height: number}, words: string[], wordSizes: number[]}
  constructor(props) {
    super()
    const words = wordSplit(props.scripture.text, true)
    this.state = {size: null, words, wordSizes: []}
  }
  render() {
    if (this.state.size) {
      // $FlowFixMe cmon, size is not null
      return <Game {...this.props} {...this.state} />
    }
    return <View
      style={{flex: 1, alignSelf: 'stretch', alignItems: 'center'}}
      onLayout={evt => {
        const size ={
          width: evt.nativeEvent.layout.width,
          height: evt.nativeEvent.layout.height,
        }
        setTimeout(() => this.setState({size}), 50)
      }}
    >
      {this.state.words.map((word, i) => (
        <Text
          key={i}
          onLayout={evt => this.state.wordSizes[i] = evt.nativeEvent.layout.width}
          style={this.props.textStyle}
        >
          {word}
        </Text>
      ))}  
    </View>
  }
}

type Options = {
  wordsAtOnce: number,  
}

export default class Snake extends React.Component {
  static description = 'Snake'
  static gameType = 'memorize'
  state: {
    options: Options,
    playing: boolean,
  }

  constructor({scripture}: any) {
    super()
    this.state = {
      options: scripture.options.Snake || {
        wordsAtOnce: 1,
      },
      playing: false,
    }
  }

  onChangeOption(update: $Shape<Options>) {
    this.setState({ options: { ...this.state.options, ...update } })
  }

  onStart = () => {
    const {scripture} = this.props
    this.props.onUpdate({options: {...scripture.options, Snake: this.state.options}})
    this.setState({playing: true})
  }

  render() {
    return <View
      style={{flex: 1, marginTop: 20,}}
    >
      <Header
        onClose={() => this.props.onQuit()}
        title="Snake"
      />
      {this.state.playing
        ? <Measurer
            boardSize={10}
            textStyle={{
              fontSize: 20,
              fontWeight: '200',
            }}
            scripture={this.props.scripture}
            options={this.state.options}
          />
        : <OptionsPicker
            options={[{
              type: 'slider',
              label: 'Number of words on the board at once',
              value: this.state.options.wordsAtOnce,
              step: 1,
              minimumValue: 1,
              maximumValue: 5,
              onChange: wordsAtOnce => this.onChangeOption({wordsAtOnce}),
            }]}
            onStart={this.onStart}
          />
        }
    </View>
  }
}
