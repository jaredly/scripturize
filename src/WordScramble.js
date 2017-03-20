// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Button,
  Switch,
  Slider,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import wordSplit from './wordSplit'
import Header from './Header'
import OptionsPicker from './Options'

import type {Data, Scripture, Tag} from './types'

const shuffle = items => {
  const ix = items.map((_, i) => [Math.random(), i])
  ix.sort((a, b) => a[0] - b[0])
  return ix.map(a => items[a[1]])
}

const makeBank = (words: string[], start, size) => {
  const bank = words.slice(start, start + size)
  return shuffle(bank)
}

class Game extends React.Component {
  state: {
    wordBank: string[],   
    bankUsed: boolean[],
    words: string[],
    gotten: number,
    wrong: number,
  }

  constructor({scripture: {text, keywords}, options: {bankSize}}) {
    super()
    const words = wordSplit(text)
    const wordBank = makeBank(words, 0, bankSize)
    this.state = {
      words,
      gotten: 0,
      wrong: 0,
      wordBank,
      bankUsed: wordBank.map(_ => false),
    }
  }

  use = (index: number) => {
    if (this.state.wordBank[index] !== this.state.words[this.state.gotten]) {
      return this.setState({wrong: this.state.wrong + 1})
    }
    const bankUsed = this.state.bankUsed.map((a, i) => i === index ? true : a)
    if (!bankUsed.some(x => !x)) {
      this.nextBank()
    } else {
      this.setState({bankUsed, gotten: this.state.gotten + 1})
    }
  }

  nextBank() {
    const {words} = this.state
    const {bankSize} = this.props.options
    const wordBank = makeBank(words, this.state.gotten + 1, bankSize)
    this.setState({
      gotten: this.state.gotten + 1,
      wordBank,
      bankUsed: wordBank.map(_ => false),
    })
  }

  render() {
    const {words, gotten, wrong, wordBank, bankUsed} = this.state
    return <View
      style={{flex: 1}}
    >
      <ScrollView
        style={{flex: 1}}
      >
        <View
          style={{
            paddingHorizontal: 10,
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          {words.slice(0, gotten).map((word, i) => (
            <Text
              key={i}
              style={{
                padding: 3,
                margin: 0,
                fontSize: 20,
                fontWeight: '200',
              }}
            >
              {word}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View style={{
        paddingHorizontal: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
      }}>
        {wordBank.map((word, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => this.use(i)}
          >
          <Text
            style={{
              padding: 5,
              paddingHorizontal: 10,
              margin: 2,
              fontSize: 25,
              fontWeight: '200',
              backgroundColor: bankUsed[i] ? '#ccc' : '#fee',
              color: bankUsed[i] ? 'transparent' : 'black',
            }}
          >
            {word}
          </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{padding: 10, flexDirection: 'row'}}
      >
        <Text style={{fontSize: 20, textAlign: 'center', fontWeight: '200'}}>
          {wrong} wrong.
        </Text>
        <View style={{flex: 1}} />
        <Text style={{fontSize: 20, textAlign: 'center', fontWeight: '200'}}>
          {gotten}/{words.length}
        </Text>
      </View>
    </View>
  }
}

type Options = {
  bankSize: number,
}

export default class WordScramble extends React.Component {
  static description = 'Rearrange words'
  static gameType = 'memorize'
  state: {
    options: Options,
    playing: boolean,
  }

  constructor({scripture}: any) {
    super()
    this.state = {
      options: scripture.options.WordScramble || {
        bankSize: 5,
      },
      playing: false,
    }
  }

  onChangeOption(update: $Shape<Options>) {
    this.setState({ options: { ...this.state.options, ...update } })
  }

  onStart = () => {
    const {scripture} = this.props
    this.props.onUpdate({options: {...scripture.options, WordScramble: this.state.options}})
    this.setState({playing: true})
  }

  render() {
    return <View
      style={{flex: 1, marginTop: 20,}}
    >
      <Header
        onClose={() => this.props.onQuit()}
        title="Word Scramble"
      />
      {this.state.playing
        ? <Game
            scripture={this.props.scripture}
            options={this.state.options}
          />
        : <OptionsPicker
            options={[{
              type: 'slider',
              label: 'Size of word bank (smaller is easier)',
              value: this.state.options.bankSize,
              step: 1,
              minimumValue: 5,
              maximumValue: 15,
              onChange: bankSize => this.onChangeOption({bankSize}),
            }]}
            onStart={this.onStart}
          />
        }
    </View>
  }
}

