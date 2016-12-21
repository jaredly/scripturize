
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import Timer from '../WordPath/Timer'
import Scores from '../WordPath/Scores'

const splitWords = text => text
  // .toLowerCase()
  .replace(/[^a-zA-Z]+/g, ' ').trim()
  .split(/\s+/g)
  // .replace(/[^a-zA-Z.;?!]+/g, ' ').trim()
  // .replace(/[.;?!]\s+/g, n => n.trim())

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// a somewhat localized shuffle
function chunkedShuffle(array, chunkSize) {
  let res = []
  for (let i=0; i<array.length; i+=chunkSize) {
    res = res.concat(shuffle(array.slice(i, i + chunkSize)))
  }
  return res
}

export default class FallingWords extends Component {
  constructor(props) {
    super()
    const words = splitWords(props.scriptureText)
    const ordered = chunkedShuffle(words.slice(), 5)
    this.state = {
      words,
      ordered,
      wordsOnScreen: [],
      offsets: ordered.map(() => Math.random()),
      sent: 0,
      // points lost?
      wrong: {},
      gotten: 0,
    }
  }

  componentDidMount() {
    this._time = setInterval(this.addWord, 1000)
  }

  componentWillUnmount() {
    clearInterval(this._time)
  }

  addWord = () => {
    if (this.state.sent <= this.state.ordered.length) {
      this.setState({
        sent: this.state.sent + 1,
        wordsOnScreen: this.state.wordsOnScreen.concat([this.state.sent]),
      })
    }
  }

  onClick = i => {
    if (this.state.ordered[i] === this.state.words[this.state.gotten]) {
      const wordsOnScreen = this.state.wordsOnScreen.slice()
      wordsOnScreen.splice(wordsOnScreen.indexOf(i), 1)
      this.setState({
        wordsOnScreen,
        gotten: this.state.gotten + 1,
      })
    }
  }

  render() {
    const width = window.innerWidth - 50
    const height = window.innerHeight
    const {wordsOnScreen, offsets, sent, words, ordered} = this.state
    const fallTime = 15

    const divs = wordsOnScreen.map((wi, i) => (
        <div key={wi}
          className={css(styles.word)}
          onTouchStart={this.onClick.bind(null, wi)}
          onClick={this.onClick.bind(null, wi)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: wi >= offsets.length ? 'none' : 'block',
            transform: `translate(${offsets[wi] * width}px, ${
              i === wordsOnScreen.length - 1 ?
              -50 : height
            }px)`,
            transition: `transform ${fallTime}s linear`,
          }}
        >
          {ordered[wi]}
        </div>
    ))

    return <div className={css(styles.container)}>
      {divs}
    </div>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
  },

  word: {
    backgroundColor: '#aef',
    padding: '5px 10px',
    borderRadius: 5,
    fontSize: '1.5em',
  },
})
