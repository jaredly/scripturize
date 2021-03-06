// @flow
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  WebView,
  Button,
  Switch,
  Slider,
} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import wordSplit from './wordSplit'
import Header from './Header'
import OptionsPicker from './Options'
import Measurer from './Measurer'

import type {Data, Scripture, Tag} from './types'

const letters = 'abcdefghijk'

type Tile =
  | {
      type: 'head',
    }
  | {
      type: 'tail',
    }
  | {
      type: 'word',
      index: number,
      spaces: number,
      orientation: 'vertical' | 'horizontal',
      head: {x: number, y: number},
    }
  | {
      type: 'word-rest',
      head: {x: number, y: number},
      index: number,
    }
  | {
      type: 'empty',
    }

const makeBoard = size => {
  const board = []
  for (let y = 0; y < size; y++) {
    board.push([])
    for (let x = 0; x < size; x++) {
      board[y].push({type: 'empty'})
    }
  }
  return board
}

// TODO avoid directly in front of the snake
const placeWord = (board: Tile[][], index: number, size: number) => {
  let x, y
  let tries = 100
  while (tries-- > 0) {
    y = Math.floor(Math.random() * board.length)
    x = Math.floor(Math.random() * (board.length - size))
    let good = true
    for (let i = 0; i < size; i++) {
      if (board[y][x + i].type !== 'empty') {
        good = false
        break
      }
    }
    if (!good) continue
    board[y][x] = {
      type: 'word',
      index,
      head: {x, y},
      spaces: size,
      orientation: 'horizontal',
    }
    for (let i = 1; i < size; i++) {
      board[y][x + i] = {
        type: 'word-rest',
        head: {x, y},
        index,
      }
    }
    return {x, y, size}
  }
  throw new Error('unabled to things')
}

type GameProps = {
  words: string[],
  wordSizes: number[],
  size: {width: number, height: number},
  options: {wordsAtOnce: number},
  boardSize: number,
  textStyle: any,
  onFinish: (wrong: number) => void,
}

const directions = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
}

const calcTickSpeed = gotten => Math.max(200, 500 - gotten * 10)

class Game extends React.Component {
  props: GameProps
  direction: 'left' | 'up' | 'down' | 'right'
  state: {
    board: Tile[][],
    snake: number[][],
    placedWords: Array<{x: number, y: number, i: number, size: number}>,
    newTail: number,
    gotten: number,
    errors: number,
    scale: number,
    wronged: boolean,
  }
  _int: *
  tickSpeed: number

  constructor({
    words,
    wordSizes,
    size: {width, height},
    scripture: {text, keywords},
    options: {wordsAtOnce},
    boardSize,
  }: GameProps) {
    super()

    const x = (boardSize / 2) | 0
    const y = x
    const board = makeBoard(boardSize)
    const snake = [[x, y]]
    board[y][x] = {type: 'head'}
    const scale = Math.min(width, height) / boardSize

    const placedWords = []
    const margin = 10
    for (let i = 0; i < wordsAtOnce; i++) {
      const {x, y, size} = placeWord(
        board,
        i,
        Math.ceil((margin + wordSizes[i]) / scale),
      )
      placedWords.push({x, y, size, i})
    }

    this.tickSpeed = 500
    this.state = {
      scale,
      words,
      placedWords,
      snake,
      board,
      errors: 0,
      gotten: 0,
      wronged: false,
      newTail: 2,
    }
    this.direction = 'right'
  }

  componentWillMount() {
    this.loop()
  }

  componentWillUnmount() {
    clearInterval(this._int)
  }

  speedStart = () => {
    this.tickSpeed = Math.min(200, this.tickSpeed)
  }

  speedStop = () => {
    this.tickSpeed = calcTickSpeed(this.state.gotten)
  }

  loop = () => {
    this._int = setTimeout(this.loop, this.tickSpeed)
    this.tick()
  }

  restart() {
    const {boardSize, wordSizes, options: {wordsAtOnce}} = this.props
    const {scale} = this.state
    const x = (boardSize / 2) | 0
    const y = x
    const board = makeBoard(boardSize)
    const placedWords = []
    const snake = [[x, y]]
    board[y][x] = {type: 'head'}
    const margin = 10
    for (let i = this.state.gotten; i < this.state.gotten + wordsAtOnce; i++) {
      const {x, y, size} = placeWord(
        board,
        i,
        Math.ceil((margin + wordSizes[i]) / scale),
      )
      placedWords.push({x, y, size, i})
    }

    this.direction = 'right'
    this.setState({
      snake,
      board,
      wronged: false,
      placedWords,
      newTail: 2,
    })
  }

  fail() {
    this.setState({
      errors: this.state.errors + 1,
    })
    this.restart()
  }

  tick() {
    const {snake, board, placedWords} = this.state
    const {direction} = this
    let {newTail} = this.state
    const [hx, hy] = snake[0]
    const [dx, dy] = directions[direction]
    let x = (hx + dx) % board.length
    let y = (hy + dy) % board.length
    if (x < 0) x = board.length - 1
    if (y < 0) y = board.length - 1
    let addWord = false
    switch (board[y][x].type) {
      case 'empty':
        break
      case 'head': // not gonna happen tho
      case 'tail':
        const last = snake[snake.length - 1]
        if (last[0] === x && last[1] === y) break
        return this.fail()
      case 'word':
      case 'word-rest':
        const tile = board[y][x]
        if (tile.index === this.state.gotten) {
          console.log(tile)
          clearWord(board, tile)
          placedWords.shift()
          addWord = true
          this.tickSpeed = calcTickSpeed(this.state.gotten + 1)
        } else {
          if (!this.state.wronged) {
            this.setState({
              wronged: true,
              errors: this.state.errors + 1,
            })
          }
          return
        }
    }
    const [lx, ly] = snake[snake.length - 1]
    board[ly][lx] = {type: 'empty'}
    board[y][x] = {type: 'head'}
    if (addWord) {
      if (
        this.state.gotten + this.props.options.wordsAtOnce <
        this.props.words.length
      ) {
        const newI = this.state.gotten + this.props.options.wordsAtOnce
        const {x, y, size} = placeWord(
          board,
          newI,
          Math.ceil((10 + this.props.wordSizes[newI]) / this.state.scale),
        )
        placedWords.push({x, y, i: newI, size})
      } else if (this.state.gotten + 1 === this.props.words.length) {
        this.props.onFinish(this.state.errors)
        return
      }
      newTail += 1
      this.setState({
        gotten: this.state.gotten + 1,
      })
    }
    let nextTail = newTail == 0 ? snake.slice(0, -1) : snake
    // reset if you get to 30 long. TODO show some tada or something
    if (nextTail.length > 30) {
      nextTail.slice(3).forEach(([x, y]) => (board[y][x] = {type: 'empty'}))
      nextTail = nextTail.slice(0, 3)
    }
    nextTail.forEach(([x, y]) => (board[y][x] = {type: 'tail'}))
    this.setState({
      board,
      snake: [[x, y]].concat(nextTail),
      newTail: Math.max(0, newTail - 1),
    })
  }

  setDirection = direction => {
    const opposite = {left: 'right', right: 'left', up: 'down', down: 'up'}[
      direction
    ]
    if (this.direction === opposite) return
    this.direction = direction
    this.setState({wronged: false})
  }

  renderBoard() {
    const {size: {width, height}, boardSize, words} = this.props
    const {snake, placedWords} = this.state
    const dim = Math.min(width, height)
    const scale = dim / boardSize

    return (
      <View
        style={{
          width: scale * boardSize,
          height: scale * boardSize,
        }}
      >
        <View key="words">
          {placedWords.map(({x, y, i, size}, att) => {
            const pos = {
              left: x * scale,
              top: y * scale,
              width: scale,
              height: scale,
            }
            return (
              <View
                style={[
                  styles.tile,
                  pos,
                  {
                    width: scale * size,
                    zIndex: 100,
                  },
                ]}
                key={att}
              >
                <Text style={this.props.textStyle}>
                  {words[i]}
                </Text>
              </View>
            )
          })}
        </View>
        <View key="snake">
          {snake.map(([x, y], i) => {
            const pos = {
              left: x * scale + 3,
              top: y * scale + 3,
              width: scale - 6,
              height: scale - 6,
            }
            return (
              <View
                style={[styles.tile, pos, styles.head]}
                key={'snake-' + i}
              />
            )
          })}
          {this.renderEyes(snake[0], scale)}
        </View>
      </View>
    )
  }

  renderEye([x, y]) {
    const width = 6
    const height = 6
    return (
      <View
        style={{
          backgroundColor: 'red',
          borderRadius: 3,
          position: 'absolute',
          top: y - 3,
          left: x - 3,
          width,
          height,
        }}
      />
    )
  }

  renderEyes([x, y], scale) {
    const cx = (x + 0.5) * scale
    const cy = (y + 0.5) * scale
    let p1, p2
    const eyed = 5
    if (this.direction === 'left') {
      p1 = [cx - scale / 2 + 9, cy - eyed]
      p2 = [cx - scale / 2 + 9, cy + eyed]
    } else if (this.direction === 'right') {
      p1 = [cx + scale / 2 - 9, cy - eyed]
      p2 = [cx + scale / 2 - 9, cy + eyed]
    } else if (this.direction === 'up') {
      p1 = [cx - eyed, cy - scale / 2 + 9]
      p2 = [cx + eyed, cy - scale / 2 + 9]
    } else {
      p1 = [cx - eyed, cy + scale / 2 - 9]
      p2 = [cx + eyed, cy + scale / 2 - 9]
    }
    return (
      <View>
        {this.renderEye(p1)}
        {this.renderEye(p2)}
      </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderBoard()}
        <View style={{flexDirection: 'row', flex: 1}}>
          <DirectionButtons
            setDirection={this.setDirection}
            speedStart={this.speedStart}
            speedStop={this.speedStop}
            size={70}
          />
          <View>
            <Text>
              {this.state.gotten} / {this.props.words.length}
            </Text>
            <Text>{this.state.errors} errors</Text>
            <Text>
              {this.props.words
                .slice(Math.max(0, this.state.gotten - 2), this.state.gotten)
                .join(' ')}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const clearWord = (board, tile) => {
  const {x, y} = tile.head
  const spaces = board[y][x].spaces
  for (let i = 0; i < spaces; i++) {
    board[y][x + i] = {type: 'empty'}
  }
}

const DirectionButtons = ({setDirection, size, speedStart, speedStop}) => (
  <View
    style={{
      position: 'relative',
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      // flex: 1,
      width: size * 3,
      // height: size * 3,
    }}
  >
    <IconButton
      name="ios-arrow-back"
      onPressIn={() => setDirection('left')}
      style={[
        styles.button,
        {
          width: size,
          height: size,
        },
      ]}
    />
    <View style={{justifyContent: 'space-between', alignSelf: 'stretch'}}>
      <IconButton
        name="ios-arrow-up"
        onPressIn={() => setDirection('up')}
        style={[
          styles.button,
          {
            width: size,
            height: size,
          },
        ]}
      />
      <IconButton
        name="ios-arrow-down"
        onPressIn={() => setDirection('down')}
        style={[
          styles.button,
          {
            width: size,
            height: size,
          },
        ]}
      />
    </View>
    <IconButton
      name="ios-arrow-forward"
      onPressIn={() => setDirection('right')}
      style={[
        styles.button,
        {
          width: size,
          height: size,
        },
      ]}
    />
  </View>
)

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 15,
  },

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
    // margin: 3,
    backgroundColor: '#afa',
    borderRadius: 5,
    borderColor: 'transparent',
  },

  tail: {
    flex: 1,
    alignSelf: 'stretch',
    margin: 3,
    backgroundColor: '#aaf',
  },
})

const IconButton = ({name, onPress, style, onPressIn, onPressOut}) => (
  <TouchableOpacity
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    style={style}
  >
    <Ionicons name={name} size={50} />
  </TouchableOpacity>
)

type Options = {
  wordsAtOnce: number,
}

export default class Snake extends React.Component {
  static description = 'Snake'
  static gameType = 'memorize'
  state: {
    options: Options,
    playing: boolean,
    words: string[],
    boardSize: number,
    finished: boolean,
  }

  constructor({scripture}: any) {
    super()
    const words = wordSplit(scripture.text, true)
    const boardSize = 10
    this.state = {
      words,
      boardSize,
      options: scripture.options.Snake || {wordsAtOnce: 1},
      playing: false,
      finished: false,
    }
  }

  onChangeOption(update: $Shape<Options>) {
    this.setState({options: {...this.state.options, ...update}})
  }

  onStart = () => {
    const {scripture} = this.props
    this.props.onUpdate({
      options: {...scripture.options, Snake: this.state.options},
    })
    this.setState({playing: true})
  }

  onFinish = (errors: number) => {
    this.setState({playing: false, finished: true})
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 20}}>
        <Header onClose={() => this.props.onQuit()} title="Snake" />
        {this.state.playing
          ? <Measurer
              Game={Game}
              boardSize={this.state.boardSize}
              textStyle={{
                fontSize: 15,
                fontWeight: '200',
              }}
              onFinish={this.onFinish}
              words={this.state.words}
              scripture={this.props.scripture}
              options={this.state.options}
            />
          : <OptionsPicker
              options={[
                {
                  type: 'slider',
                  label: 'Number of words on the board at once',
                  value: this.state.options.wordsAtOnce,
                  step: 1,
                  minimumValue: 1,
                  maximumValue: 5,
                  onChange: wordsAtOnce => this.onChangeOption({wordsAtOnce}),
                },
              ]}
              onStart={this.onStart}
            />}
      </View>
    )
  }
}
