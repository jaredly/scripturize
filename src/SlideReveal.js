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
import OptionsPicker from './Options'

import type {Data, Scripture, Tag} from './types'

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
    const {words, index, auto, revealed, peek} = this.state
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
                color: (revealed[i] || (index === i && peek)) ? 'black' : 'transparent',
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

  onChange(update: any) {
    this.setState({ options: { ...this.state.options, ...update } })
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
            }]}
            onStart={() => this.setState({playing: true})}
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
