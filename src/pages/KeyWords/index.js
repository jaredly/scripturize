// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'

const scriptureText = "Wherefore, do not spend money for that which is of no worth, nor your labor for that which cannot satisfy. Hearken diligently unto me, and remember the words which I have spoken; and come unto the Holy One of Israel, and feast upon that which perisheth not, neither can be corrupted, and let your soul delight in fatness."

const tokens = scriptureText.split(/\b/g)
const words = tokens.filter((_, i) => i % 2 == 0)
const seps = tokens.filter((_, i) => i % 2 == 1)

export default class KeyWords extends Component {
  constructor() {
    super()
    this.state = {
      selected: {},
    }
  }

  render() {
    return <div className={css(styles.container)}>
      <div className={css(styles.scripture)}>
        {words.map((word, i) => (
          word.match(/[a-zA-Z]/) ?
            <div
              key={i}
              onClick={() => this.setState({selected: {...this.state.selected, [i]: !this.state.selected[i]}})}
              className={css(styles.word, this.state.selected[i] && styles.selectedWord)}>
              {word}
            </div>
            : <div className={css(styles.space)}>{word}</div>
        ))}
      </div>
    </div>
  }
}

const styles = StyleSheet.create({

  container: {
  },

  scripture: {
    color: '#777',
    fontSize: 24,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  word: {
    padding: '3px 0px',
    borderRadius: 5,
    minWidth: 15,
  },

  space: {
    minWidth: 15,
    padding: '3px 0px',
  },

  selectedWord: {
    // backgroundColor: '#aaf',
    fontWeight: 'bold',
    color: 'black',
  },
})


