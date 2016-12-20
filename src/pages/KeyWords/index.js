// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'
import ChooseWords from './ChooseWords'
import TestWords from './TestWords'

const verse = '2 ne 9:51'

const scriptureText = "Wherefore, do not spend money for that which is of no worth, nor your labor for that which cannot satisfy. Hearken diligently unto me, and remember the words which I have spoken; and come unto the Holy One of Israel, and feast upon that which perisheth not, neither can be corrupted, and let your soul delight in fatness."

const tokens = scriptureText.split(/\b/g)
const words = tokens.filter((_, i) => i % 2 == 0)
const seps = tokens.filter((_, i) => i % 2 == 1)

const makeKey = key => 'chosen-words:' + key

const load = key => {
  try {
    return JSON.parse(localStorage[makeKey(key)])
  } catch (e) {
    return null
  }
}

const save = (key, data) => localStorage[makeKey(key)] = JSON.stringify(data)

export default class KeyWords extends Component {
  constructor() {
    super()
    this.state = {
      chosenWords: load(verse),
    }
  }

  onChoose = selected => {
    this.setState({chosenWords: selected})
    save(verse, selected)
  }

  render() {
    if (!this.state.chosenWords) {
      return <div className={css(styles.container)}>
        <ChooseWords
          words={words}
          seps={seps}
          onChoose={this.onChoose}
        />
      </div>
    }
    return <TestWords
      words={words}
      seps={seps}
      keyWords={this.state.chosenWords}
    />
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
})


