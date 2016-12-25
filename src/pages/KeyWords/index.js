// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'
import ChooseWords from './ChooseWords'
import TestWords from './TestWords'

export default class KeyWords extends Component {
  setKeyWords = selected => {
    const keywords = {}
    Object.keys(selected).forEach(key => {
      if (selected[key]) keywords[key] = true
    })
    this.props.saveKeywords(keywords)
    hashHistory.push(`/${this.props.scripture.reference}`)
  }

  render() {
    const {scripture, keywords} = this.props
    return <ChooseWords
      initial={keywords}
      words={scripture.keyWords.words}
      seps={scripture.keyWords.seps}
      onChoose={this.setKeyWords}
    />
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
})
