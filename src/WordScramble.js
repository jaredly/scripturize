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

import type {Data, Scripture, Tag} from './types'

const OptionsPicker = ({scripture, options, onChange, onStart}) => (
  <View style={{
    flex: 1,
  }}>
  <ScrollView
    style={{flex: 1}}
  >
    <View
      style={{flexDirection: 'column', padding: 10, alignItems: 'stretch'}}
    >
      <Text style={{fontSize: 20, flex: 1}}>
        Size of word bank (smaller is easier): <Text>{options.bankSize}</Text>
      </Text>
      <Slider
        value={options.bankSize}
        step={3}
        minimumValue={5}
        maximumValue={14}
        onValueChange={bankSize => onChange({bankSize})}
      />
    </View>
    </ScrollView>
    <MButton onPress={onStart} text='Start!' />
  </View>
)

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

export default class WordScramble extends React.Component {
  static description = 'Rearrange words'
  static gameType = 'memorize'
  state: any

  constructor({scripture}: any) {
    super()
    this.state = {
      options: {
        bankSize: 5,
      },
      playing: false,
    }
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
            scripture={this.props.scripture}
            options={this.state.options}
            onChange={update => this.setState({options: {...this.state.options, ...update}})}
            onStart={() => this.setState({playing: true})}
          />
        }
    </View>
  }
}

