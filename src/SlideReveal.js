// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Button,
  Switch,
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
      style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}
    >
      <Text style={{fontSize: 20, flex: 1}}>
        Reveal keywords initially
      </Text>
      <Switch
        disabled={!scripture.keywords}
        value={options.showKeywords}
        onValueChange={value => onChange({showKeywords: value})}
      />
    </View>
    </ScrollView>
    <MButton onPress={onStart} text='Start!' />
  </View>
)

const getInitialRevealed = (words, showKeywords, keywords) => {
  return showKeywords
    ? words.map((_, i) => keywords.indexOf(i) !== -1)
    : words.map(() => false)
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

class Game extends React.Component {
  state: {
    done: ?number,
    index: number,
    words: string[],
    revealed: boolean[],
    auto: boolean,
  }

  constructor({scripture: {text, keywords}, options: {showKeywords}}) {
    super()
    const words = wordSplit(text)
    this.state = {
      done: null,
      auto: false,
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

  show = () => {
    this.setState({
      index: this.state.index + 1,
      revealed: this.state.revealed.map((m, i) => i === this.state.index ? true : m)
    })
  }

  auto = () => {
    let int = setInterval(() => {
      if (this.state.done || this.state.index >= this.state.words.length) {
        clearInterval(int)
      } else {
        this.show()
      }
    }, 500)
  }

  render() {
    const {words, index, auto, revealed} = this.state
    return <View
      style={{flex: 1}}
    >
      <ScrollView
        style={{flex: 1}}
      >
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          {words.map((word, i) => (
            <Text
              key={i}
              style={{
                backgroundColor: index === i ? '#fcc' : '#fee',
                padding: 3,
                margin: 2,
                color: revealed[i] ? 'black' : 'transparent',
                fontSize: 25,
                fontWeight: '200',
              }}
            >
              {word}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View style={{
        flexDirection: 'row',
        alignSelf: 'stretch',
      }}>
        <MButton
          text="Auto"
          onPress={this.auto}
          style={{flex: 1}}
        />
        <MButton
          text={index === words.length - 1 ? 'Done' : "Next"}
          onPress={this.next}
          style={{flex: 1}}
        />
        <MButton
          text="Show"
          onPress={this.show}
          style={{flex: 1}}
        />
      </View>
    </View>
  }
}

export default class SlideReveal extends React.Component {
  static description = 'Reveal each word'
  static gameType = 'absorb'
  state: any
  constructor({scripture}: any) {
    super()
    this.state = {
      options: {
        showKeywords: !!scripture.keywords,
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
        title="Slide Reveal"
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
