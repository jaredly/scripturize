
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

const GAME_ID = 'falling-words'

const initialState = (scriptureText, difficulty) => {
  const words = splitWords(scriptureText)
  const ordered = chunkedShuffle(words.slice(), 5)
  return {
    times: [Date.now()],
    words,
    ordered,
    wordsOnScreen: [0],
    offsets: ordered.map(() => Math.random()),
    sent: 1,
    // points lost?
    wrong: null,
    gotten: 0,
    score: 0,
    scoreMult: {
      easy: 1,
      medium: 2,
      hard: 5,
    }[difficulty],
    showingPreScreen: false,
    hangTime: {
      easy: 15,
      medium: 10,
      hard: 8,
    }[difficulty],
    addSpeed: {
      easy: 1000,
      medium: 750,
      hard: 550,
    }[difficulty]
  }
}

export default class FallingWords extends Component {
  constructor(props) {
    super()
    this.state = {
      showingPreScreen: true
    }
  }

  componentDidMount() {
    // this._time = setInterval(this.addWord, 1000)
  }

  componentWillUnmount() {
    clearInterval(this._time)
  }

  restart = (difficulty) => {
    clearInterval(this._time)
    const state = initialState(this.props.scriptureText, difficulty)
    this.setState(state)
    this._time = setInterval(this.addWord, state.addSpeed)
  }

  addWord = () => {
    if (this.state.showingPreScreen) return
    if (this.state.sent <= this.state.ordered.length) {
      this.setState({
        sent: this.state.sent + 1,
        wordsOnScreen: this.state.wordsOnScreen.concat([this.state.sent]),
        times: this.state.times.concat([Date.now()]),
      })
    }
    if (this.state.times[this.state.wordsOnScreen[0]] + this.state.hangTime * 1000 < Date.now()) {
      // lost!
      const now = Date.now()
      this.props.saveScore(GAME_ID, {
        score: this.state.score - 4 * this.state.scoreMult,
        date: now,
      })
      this.setState({
        won: now,
        showingPreScreen: true,
      })
    }
  }

  onClick = (i, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.state.ordered[i] === this.state.words[this.state.gotten]) {
      const wordsOnScreen = this.state.wordsOnScreen.slice()
      wordsOnScreen.splice(wordsOnScreen.indexOf(i), 1)
      this.setState({
        score: this.state.score + 2 * this.state.scoreMult,
        wordsOnScreen,
        gotten: this.state.gotten + 1,
        wrong: null,
      })
      if (this.state.gotten === this.state.words.length - 1) {
        const now = Date.now()
        this.props.saveScore(GAME_ID, {
          score: this.state.score + 2 * this.state.scoreMult,
          date: now,
        })
        this.setState({
          won: now,
          showingPreScreen: true,
        })
      }
    } else if (i !== this.state.wrong) {
      this.setState({
        score: this.state.score - this.state.scoreMult,
        wrong: i
      })
    }
  }

  renderPreScreen() {
    const scores = (this.props.scores[GAME_ID] || []).sort((a, b) => b.score - a.score)
    return <div
      className={css(styles.container)}
    >
      <button onClick={() => this.restart('easy')}
        className={css(styles.button)}
      >
        Easy
      </button>
      <button onClick={() => this.restart('medium')}
        className={css(styles.button)}
      >
        Medium
      </button>
      <button onClick={() => this.restart('hard')}
        className={css(styles.button)}
      >
        Hard
      </button>
      <div className={css(styles.scoresTitle)}>
        Scores
      </div>
      <div className={css(styles.scores)}>
      {scores.map(score => (
        <div key={score.date} className={css(styles.pastScore, score.date === this.state.won && styles.justNow)}>
          {score.score}
        </div>
      ))}
      </div>
    </div>
  }

  render() {
    if (this.state.showingPreScreen) {
      return this.renderPreScreen()
    }

    const width = window.innerWidth - 50
    const height = window.innerHeight - 100
    const {wordsOnScreen, offsets, sent, words, ordered, wrong, hangTime} = this.state

    const text = this.state.words.slice(0, this.state.gotten).join(' ')

    const divs = wordsOnScreen.map((wi, i) => (
        <div key={wi}
          className={css(styles.word)}
          onTouchStart={this.onClick.bind(null, wi)}
          onMouseDown={this.onClick.bind(null, wi)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: wrong === wi ? 'red' : '#aef',
            display: wi >= offsets.length ? 'none' : 'block',
            transform: `translate(${offsets[wi] * width}px, ${
              i === wordsOnScreen.length - 1 ?
              -50 : height
            }px)`,
            transition: `transform ${hangTime}s linear, background-color 1s ease`,
          }}
        >
          {ordered[wi]}
        </div>
    ))

    return <div className={css(styles.container)}>
      <div className={css(styles.score)}>
        {this.state.score}
      </div>
      <div className={css(styles.board)}>
        {divs}
      </div>
      <div className={css(styles.text)}>
        {text}
      </div>
    </div>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  score: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  scores: {
    flex: 1,
    overflow: 'auto',
  },

  pastScore: {
    textAlign: 'center',
  },

  scoresTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },

  justNow: {
    fontWeight: 'bold',
    color: '#006eff',
  },

  board: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
  },

  button: {
    backgroundColor: '#aef',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'stretch',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    fontSize: '1.5em',
  },

  text: {
    height: 100,
    // fontSize: 14,
    overflow: 'auto',
    padding: 10,
  },

  word: {
    // backgroundColor: '#aef',
    padding: '5px 10px',
    borderRadius: 5,
    fontSize: '1.5em',
  },
})
