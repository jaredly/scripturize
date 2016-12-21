// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Browse from './pages/Browse'
import KeyWords from './pages/KeyWords'
import WordPath from './pages/WordPath'
import ReferencePage from './pages/Reference'

const pages = [
  {name: 'KeyWords', path: 'key-words'},
  {name: 'WordPath', path: 'word-path'},
]

const scriptures = require('./scripture-mastery.json')

const title = (reference, secondRoute) => {
  if (!reference) return 'Scripturize'
  for (let page of pages) {
    if (page.path === secondRoute.path) return page.name
  }
  return reference
}

const tryLocalStorage = key => {
  try {
    return JSON.parse(localStorage[scoresKey])
  } catch (e) {
    return null
  }
}

const currentScripturesKey = 'memorize:current-scriptures'
const loadCurrentScriptures = () => tryLocalStorage(currentScripturesKey) || []
const saveCurrentScriptures = scriptures => {
  localStorage[currentScripturesKey] = JSON.stringify(scriptures)
}

const scoresKey = 'memorize:scores'
const loadScores = () => tryLocalStorage(scoresKey) || {}
const saveScores = scores => {
  localStorage[scoresKey] = JSON.stringify(scores)
}

const sortScores = (a, b) => a.score - b.score

class Wrapper extends Component {
  constructor() {
    super()
    this.state = {
      scores: loadScores(),
      scriptures: loadCurrentScriptures(),
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
        ]).sort(sortScores)
      }
    }
    saveScores(scores)
    this.setState({scores})
  }

  addScripture = reference => {
    const scriptures = this.state.scriptures.concat([reference]).sort()

    saveCurrentScriptures(scriptures)
    this.setState({scriptures})
  }

  removeScripture = reference => {
    const scriptures = this.state.scriptures.filter(r => r !== reference)
    saveCurrentScriptures(scriptures)
    this.setState({scriptures})
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
    const {scores} = this.state
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
        pages,
        scores,
        saveScore: this.saveScore,
        clearScores: this.clearScores,
        addScripture: this.addScripture,
        removeScripture: this.removeScripture,
      })}
    </div>
  }
}

const ReferenceWrapper = ({children, params, scores, saveScore}) => React.cloneElement(children, {
  scriptureText: scriptures[params.reference],
  scriptureReference: params.reference,
  scores: scores[params.reference] || {},
  saveScore: (game, score) => saveScore(params.reference, game, score),
  clearScores: game => clearScores(params.reference, game),
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
          <Route path="word-path" component={WordPath} />
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
    width: 100,
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
