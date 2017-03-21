// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Button,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import wordSplit from './wordSplit'
import Header from './Header'
import OptionsPicker from './Options'

import type {Data, Scripture, Tag} from './types'

class FastWord extends React.Component {
  state: any
  _un: *
  constructor(props: *) {
    super()
    this.state = {
      peek: false,
      current: props.parent.current === props.i,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.i !== this.props.i
      || nextState !== this.state
  }

  componentWillMount() {
    this._un = this.props.register(this.props.i, () => {
      const current = this.props.i === this.props.parent.current
      this.setState({
        current,
        peek: current && this.props.parent.peek,
      })
    })
  }

  componentWillUnmount() {
    this._un()
  }

  render() {
    const {peek, current} = this.state
    const {revealed, word, onTap} = this.props
    return <TouchableWithoutFeedback
      onPress={onTap}
    >
    <View>
    <Text
      style={{
        backgroundColor: current ? '#fcc' : '#fee',
        padding: 3,
        margin: 2,
        color: (revealed || (current && peek)) ? 'black' : 'transparent',
        fontSize: 25,
        fontWeight: '200',
      }}
    >
      {word}
    </Text>
    </View>
    </TouchableWithoutFeedback>
  }
}

class FastWordShower extends React.Component {
  parent: *
  listeners: any
  constructor() {
    super()
    this.parent = {
      current: 0,
      peek: false,
    }
    this.listeners = {}
  }

  register = (i, fn) => {
    this.listeners[i] = fn
    return () => this.listeners[i] = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current || nextProps.peek !== this.props.peek) {
      this.parent.current = nextProps.current
      this.parent.peek = nextProps.peek
      if (this.listeners[nextProps.current]) {
        this.listeners[nextProps.current]()
      }
      if (nextProps.current !== this.props.current) {
        this.listeners[this.props.current]()
      }
    }
  }

  render() {
    const {words, revealed} = this.props
    return <ScrollView
      style={{flex: 1}}
    >
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: 10,
        }}
      >
        {words.map((word, i) => (
          <FastWord
            i={i}
            key={i}
            word={word}
            parent={this.parent}
            revealed={revealed[i]}
            register={this.register}
            onTap={() => this.props.setIndex(i)}
          />
        ))}
      </View>
    </ScrollView>
  }
}

const getInitialRevealed = (words, showKeywords, keywords) => {
  return showKeywords
    ? words.map((_, i) => keywords.indexOf(i) !== -1)
    : words.map(() => false)
}

class Game extends React.Component {
  state: {
    done: ?number,
    index: number,
    words: string[],
    revealed: boolean[],
    auto: boolean,
    peek: boolean,
  }
  _int: *

  constructor({scripture: {text, keywords}, options: {showKeywords}}) {
    super()
    const words = wordSplit(text)
    this.state = {
      done: null,
      auto: false,
      peek: false,
      index: 0,
      words,
      revealed: getInitialRevealed(words, showKeywords, keywords),
    }
  }

  next = () => {
    // TODO if the last words are already revealed, then we're done too
    if (this.state.index === this.state.words.length - 1) {
      this.setState({done: Date.now()})
    } else {
      this.setState({index: this.state.index + 1})
    }
  }

  auto = () => {
    if (this.state.auto) {
      this.setState({auto: false})
      clearInterval(this._int)
      return
    }
    this.setState({auto: true})
    this._int = setInterval(() => {
      if (this.state.done || this.state.index >= this.state.words.length) {
        clearInterval(this._int)
        this.setState({ auto: false })
      } else {
        this.next()
      }
    }, 1000 * (60 / this.props.options.autoSpeed))
  }

  componentWillUnmount() {
    clearInterval(this._int)
  }

  render() {
    const {words, index, auto, revealed, peek} = this.state
    return <View
      style={{flex: 1}}
    >
      <FastWordShower
        words={words}
        revealed={revealed}
        peek={peek || auto}
        current={index}
        setIndex={index => this.setState({index})}
      />
      <View style={{
        flexDirection: 'row',
        alignSelf: 'stretch',
      }}>
        <MButton
          text={auto ? 'Stop' : 'Auto'}
          onPress={this.auto}
          style={{flex: 1}}
        />
        <MButton
          text={index === words.length - 1 ? 'Done' : "Next"}
          onPress={this.next}
          style={{flex: 1}}
        />
        <TouchableOpacity
          onPressIn={() => this.setState({peek: true})}
          onPressOut={() => this.setState({peek: false})}
          style={[{
            padding: 10,
            alignItems: 'center',
            flex: 1,
          }]}
        >
          <Text style={{
            color: 'blue',
            fontSize: 20,
          }}>Peek</Text>
        </TouchableOpacity>
      </View>
    </View>
  }
}

type Options = {
  showKeywords: boolean,
  autoSpeed: number,
}

export default class SlideReveal extends React.Component {
  static description = 'Reveal each word'
  static gameType = 'absorb'
  state: {
    options: Options,
    playing: boolean,
  }
  constructor({scripture}: any) {
    super()
    this.state = {
      options: scripture.options.SlideReveal || {
        showKeywords: !!scripture.keywords,
        autoSpeed: 120,
      },
      playing: false,
    }
  }

  onChange(update: $Shape<Options>) {
    this.setState({ options: { ...this.state.options, ...update } })
  }

  onStart = () => {
    const {scripture} = this.props
    this.props.onUpdate({options: {...scripture.options, SlideReveal: this.state.options}})
    this.setState({playing: true})
  }

  render() {
    return <View
      style={{flex: 1, marginTop: 20,}}
    >
      <Header
        onClose={() => this.props.onQuit()}
        title="Slide Reveal"
      />
      {this.state.playing
        ? <Game
            scripture={this.props.scripture}
            options={this.state.options}
          />
        : <OptionsPicker
            options={[{
              label: 'Show keywords',
              value: this.state.options.showKeywords,
              type: 'switch',
              onChange: showKeywords => this.onChange({showKeywords}),
            }, {
              label: 'Speed of auto-reveal',
              value: this.state.options.autoSpeed,
              minimumValue: 100,
              maximumValue: 200,
              step: 10,
              type: 'slider',
              onChange: autoSpeed => this.onChange({autoSpeed}),
            }]}
            onStart={this.onStart}
          />
        }
    </View>
  }
}

const MButton = ({onPress, text, style}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{
      padding: 10,
      alignItems: 'center',
    }, style]}
  >
    <Text style={{
      color: 'blue',
      fontSize: 20,
    }}>{text}</Text>
  </TouchableOpacity>
)
