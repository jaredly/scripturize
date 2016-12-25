// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Browse from './pages/Browse'
import KeyWords from './pages/KeyWords'
import WordPath from './pages/WordPath'
import FallingWords from './pages/FallingWords'
import ReferencePage from './pages/Reference'
import TestWords from './pages/KeyWords/TestWords'

const games = {
  'key-word-blanks': {
    title: 'Key Word Blanks',
    color: '#afa',
    needsKeywords: true,
    sortScores: (a, b) => a.score - b.score,
    formatScore: score => `${parseInt(score.score / 1000)}s`,
    isMastered: (scripture, score, keywords) => keywords && (score.score / 1000) / Object.keys(keywords).length <= 1,
    masteredText: 'Take less than 1 seconds per keyword',
  },

  'word-path': {
    title: 'Word Path',
    color: '#aef',
    sortScores: (a, b) => a.score - b.score,
    formatScore: score => `${parseInt(score.score / 1000)}s`,
    isMastered: (scripture, score) => scripture.letters.length / (score.score / 1000) >= 1.5,
    masteredText: 'Get better than 1.5 letters per second',
  },

  'falling-words': {
    title: 'Falling words',
    color: '#fea',
    sortScores: (a, b) => b.score - a.score,
    formatScore: score => score.score,
    isMastered: (scripture, score) => score.difficulty === 'hard' && score.finished,
    masteredText: 'Win on Hard',
  },
  // {title: 'Falling blocks', path: 'falling-blocks'},
  // {title: 'Key Words', path: 'key-words'},
}

const scriptureSections = require('./scripture-mastery.json')

const splitWords = text => text
  // .toLowerCase()
  .replace(/[^a-zA-Z]+/g, ' ').trim()
  .split(/\s+/g)
  // .replace(/[^a-zA-Z.;?!]+/g, ' ').trim()
  // .replace(/[.;?!]\s+/g, n => n.trim())

const justLetters = text => text
  .toLowerCase()
  .toUpperCase()
  .replace(/[^a-zA-Z.;?!]+/g, ' ').trim()
  .replace(/[.;?!]\s+/g, n => n.trim())

const splitKeyWords = text => {
  const tokens = text.trim().split(/\b/g)
  return {
    words: tokens.filter((_, i) => i % 2 == 0),
    seps: tokens.filter((_, i) => i % 2 == 1),
  }
}

const preprocessScripture = (reference, text) => ({
  reference,
  text,
  keyWords: splitKeyWords(text),
  words: splitWords(text),
  letters: justLetters(text),
})

const scriptures = {}
Object.keys(scriptureSections).forEach(section => {
  for (let ref in scriptureSections[section]) {
    scriptures[ref] = preprocessScripture(ref, scriptureSections[section][ref])
  }
})

const title = (reference, secondRoute) => {
  if (!reference) return 'Scripturize'
  for (let path in games) {
    if (path === secondRoute.path) return games[path].title
  }
  return reference
}

const tryLocalStorage = key => {
  try {
    return JSON.parse(localStorage[key])
  } catch (e) {
    return null
  }
}

const currentScripturesKey = 'memorize:current-scriptures'
const loadCurrentScriptures = () => tryLocalStorage(currentScripturesKey) || [
  'Moses 1:39'
]
const saveCurrentScriptures = scriptures => {
  localStorage[currentScripturesKey] = JSON.stringify(scriptures)
}

const scoresKey = 'memorize:scores'
const loadScores = () => tryLocalStorage(scoresKey) || {}
const saveScores = scores => {
  localStorage[scoresKey] = JSON.stringify(scores)
}

const keywordsKey = 'memorize:keywords'
const loadKeywords = () => tryLocalStorage(keywordsKey) || {}
const saveKeywords = keywords => localStorage[keywordsKey] = JSON.stringify(keywords)

class Wrapper extends Component {
  constructor() {
    super()
    this.state = {
      scores: loadScores(),
      currentScriptures: loadCurrentScriptures(),
      keywords: loadKeywords(),
    }
  }

  clearScores = (reference, game) => {
    const scores = {
      ...this.state.scores,
      [reference]: {
        ...this.state.scores[reference],
        [game]: null,
      }
    }
    saveScores(scores)
    this.setState({scores})
  }

  saveScore = (reference, game, score) => {
    const scores = {
      ...this.state.scores,
      [reference]: {
        ...this.state.scores[reference],
        [game]: ((this.state.scores[reference] || {})[game] || []).concat([
          score
        ]).sort(games[game].sortScores)
      }
    }
    saveScores(scores)
    this.setState({scores})
  }

  saveKeywords = (reference, newKeywords) => {
    const keywords = {
      ...this.state.keywords,
      [reference]: newKeywords,
    }
    saveKeywords(keywords)
    this.setState({keywords})
  }

  addScripture = reference => {
    const currentScriptures = this.state.currentScriptures.concat([reference]).sort()

    saveCurrentScriptures(currentScriptures)
    this.setState({currentScriptures})
  }

  removeScripture = reference => {
    const currentScriptures = this.state.currentScriptures.filter(r => r !== reference)
    saveCurrentScriptures(currentScriptures)
    this.setState({currentScriptures})
  }

  onBack = () => {
    if (this.props.routes[2].path) {
      hashHistory.push(`/${this.props.params.reference}`)
    } else {
      hashHistory.push('/')
    }
  }

  render() {
    const {children, routes, params} = this.props
    const {scores, currentScriptures, keywords} = this.state
    return <div className={css(styles.container)}>
      <div className={css(styles.top)}>
        <div className={css(styles.side)}>
          {routes.length > 1 && routes[1].path && <button
            className={css(styles.homeButton)}
            onClick={this.onBack}
          >
            back
          </button>}
        </div>
        <div className={css(styles.title)}>
          {title(params.reference, routes[2])}
        </div>
        <div className={css(styles.side)}/>
      </div>
      {React.cloneElement(children, {
        games,
        scores,
        keywords,
        scriptures,
        currentScriptures,
        saveScore: this.saveScore,
        clearScores: this.clearScores,
        addScripture: this.addScripture,
        removeScripture: this.removeScripture,
        saveKeywords: this.saveKeywords,
      })}
    </div>
  }
}

const ReferenceWrapper = ({children, params, scores, keywords, saveScore, clearScores, saveKeywords, games}) => React.cloneElement(children, {
  scripture: scriptures[params.reference],
  scores: scores[params.reference] || {},
  games,
  saveScore: (game, score) => saveScore(params.reference, game, score),
  clearScores: game => clearScores(params.reference, game),
  saveKeywords: keywords => saveKeywords(params.reference, keywords),
  keywords: keywords[params.reference],
})

export default class App extends Component {
  constructor() {
    super()
  }

  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={Wrapper}>
        <IndexRoute component={Browse}/>
        <Route path=":reference" component={ReferenceWrapper}>
          <IndexRoute component={ReferencePage} />
          <Route path="key-words" component={KeyWords} />
          <Route path="key-word-blanks" component={TestWords} />
          <Route path="word-path" component={WordPath} />
          <Route path="falling-words" component={FallingWords} />
        </Route>
      </Route>
    </Router>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  side: {
    width: 80,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },

  title: {
    flex: 1,
    padding: '5px 10px',
    alignItems: 'center',
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  homeButton: {
    padding: '5px 20px',
    color: '#00c9fb',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'white',
    border: 'none',
    alignSelf: 'stretch',
  },
});
