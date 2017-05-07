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
import wordSplit from '../wordSplit'
import Header from '../Header'
import OptionsPicker from '../Options'
import Measurer from '../Measurer'
import Game from './Game'

type Options = {
  // wordsAtOnce: number,
}

export default class WordPath extends React.Component {
  static description = 'WordPath'
  static gameType = 'memorize'
  state: {
    options: Options,
    playing: boolean,
    words: string[],
    boardSize: number,
  }

  constructor({scripture}: any) {
    super()
    const words = wordSplit(scripture.text, true)
    // TODO maybe this is a waste?
    const boardSize = 10 // Math.ceil(Math.sqrt(Math.min(25, Math.max(words.length, 10)) * 5))
    this.state = {
      words,
      boardSize,
      options: scripture.options.Snake || {wordsAtOnce: 1},
      playing: false,
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
              words={this.state.words}
              scripture={this.props.scripture}
              options={this.state.options}
            />
          : <OptionsPicker options={[]} onStart={this.onStart} />}
      </View>
    )
  }
}
