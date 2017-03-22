// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableWithoutFeedback,
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
import Measurer from './Measurer'

import type {Data, Scripture, Tag} from './types'

class Game extends React.Component {
  up: boolean
  _raf: number
  player: *
  text: *
  state: *
  constructor() {
    super()
    this.up = false
    this.state = {
      gotten: 0,
    }
  }

  componentDidMount() {
    // this.run({width: 200, height: 500})
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._raf)
  }

  run({height, width}) {
    const playerHeight = 50
    const playerWidth = 50
    const start = Date.now()
    let wx = 0
    let wy = 100
    let y = 50
    let x = 50
    let dy = 0
    const wordSpeed = 2
    let wordHeight = this.props.wordHeight
    const loop = () => {
      if (this.up) {
        dy -= 0.4
      } else {
        dy += 0.4
      }
      y += dy
      if (y > height - 50) {
        y = height - 50
        if (dy > 0) dy = 0
      }
      if (y < -100) {
        y = -100
        if (dy < 0) dy = 0
      }
      // const t = Date.now() - start
      this.player.setNativeProps({
        style: {top: y}
      })
      const wordWidth = this.props.wordSizes[this.state.gotten]
      if (x <= wx + wordWidth && wx <= x + playerWidth
          && y <= wy + wordHeight && wy <= y + playerHeight) {
        wx = width
        wy = Math.random() * (height - 100) | 0
        this.setState({gotten: this.state.gotten + 1})
      } else {
        wx -= wordSpeed
        if (wx <= -wordWidth) {
          wx = width
          wy = Math.random() * (height - 100) | 0
        }
      }
      this.text.setNativeProps({
        style: {left: wx, top: wy}
      })
      this._raf = requestAnimationFrame(loop)
    }
    this._raf = requestAnimationFrame(loop)
  }

  render() {
    return <TouchableWithoutFeedback
      onPressIn={() => this.up = true}
      onPressOut={() => this.up = false}
      onLayout={evt => !this._raf && this.run(evt.nativeEvent.layout)}
    >
      <View style={{
        marginTop: 10,
        flex: 1,
      }}>
        <View ref={node => this.player = node} style={{
          position: 'absolute',
          top: 50,
          left: 50,
          width: 50,
          height: 50,
          backgroundColor: 'green',
          borderRadius: 5,
        }}
        />
      <Text ref={node => this.text = node} style={[{
        position: 'absolute',
        left: 200,
        top: 100,
      }, this.props.textStyle]}>
      {this.props.words[this.state.gotten]}  
      </Text>
      </View>
    </TouchableWithoutFeedback>

  }
}


type Options = {
  falseWords: boolean,  
}

export default class Flappy extends React.Component {
  static description = 'Flappy'
  static gameType = 'memorize'
  state: {
    options: Options,
    playing: boolean,
    words: string[],
  }

  constructor({scripture}: any) {
    super()
    const words = wordSplit(scripture.text, true)
    this.state = {
      words,
      options: scripture.options.Flappy || {falseWords: false},
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
        title="Flappy"
      />
      {this.state.playing
        ? <Measurer
            Game={Game}
            textStyle={{
              fontSize: 25,
              fontWeight: '200',
            }}
            words={this.state.words}
            scripture={this.props.scripture}
            options={this.state.options}
          />
        : <OptionsPicker
            options={[{
              type: 'switch',
              label: 'Include out-of-order & wrong words?',
              value: this.state.options.falseWords,
              onChange: falseWords => this.onChangeOption({falseWords}),
            }]}
            onStart={this.onStart}
          />
        }
    </View>
  }
}
