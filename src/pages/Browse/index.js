// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'
import Add from './Add'

const isCurrent = scores => {
  const aMonthAgo = Date.now() - 1000 * 60 * 60 * 24 * 30
  if (!scores) return false
  for (let game in scores) {
    if (scores[game].some(score => score.date > aMonthAgo)) {
      return true
    }
  }
  return false
}

const masteredGames = (games, scores, scripture, keywords) => {
  if (!scores) return 0
  return Object.keys(games).filter(game => {
    return scores[game] && games[game].isMastered(scripture, scores[game][0], keywords)
  })
}

const isMastered = (games, scores, scripture) => {
  if (!scores) return false
  const notMastered = Object.keys(games).some(game => {
    if (!scores[game]) return true
    return !games[game].isMastered(scripture, scores[game][0])
  })
  return !notMastered
}

const organizeScriptures = (games, currentScriptures, scriptures, scores, keywords) => {
  const current = []
  const mastered = []
  const rest = []
  const numGames = Object.keys(games).length
  currentScriptures.forEach(reference => {
    const count = masteredGames(games, scores[reference], scriptures[reference], keywords[reference]).length
    if (count === numGames) {
      mastered.push(reference)
    } else if (isCurrent(scores[reference])) {
      current.push({reference, count})
    } else {
      rest.push(reference)
    }
  })
  return {current, rest, mastered}
}

const renderReference = (reference, count=0) => {
  const stars = []
  for (let i=0; i<count; i++) {
    stars.push(<div key={i} className={css(styles.star)}>★</div>)
  }
  return <div
    key={reference}
    onClick={() => hashHistory.push('/' + reference)}
    className={css(styles.scripture)}
  >
    <div className={css(styles.referenceName)}>
      {reference}
    </div>
    {stars}
  </div>
}
// TODO played # times

const renderScriptures = (games, currentScriptures, scriptures, scores, keywords) => {
  const {current, mastered, rest} = organizeScriptures(games, currentScriptures, scriptures, scores, keywords)
  console.log(current)
  return (
    <div className={css(styles.scriptures)}>
      <div className={css(styles.sectionHeader)}>
        Active
      </div>
      <div className={css(styles.section)}>
        {current.length ? current.map(reference => (
          renderReference(reference.reference, reference.count)
        )) : <div className={css(styles.scripture)}>No active scriptures</div>}
      </div>
      <div className={css(styles.sectionHeader)}>
        Mastered
      </div>
      <div className={css(styles.section)}>
        {mastered.length ? mastered.map(reference => (
          renderReference(reference)
        )) : <div className={css(styles.scripture)}>
          No scriptures mastered. To master, you have to select keywords, and get a ★ on all mini-games.
        </div>}
      </div>
      <div className={css(styles.sectionHeader)}>
        Inactive
      </div>
      <div className={css(styles.section)}>
        {rest.length ? rest.map(reference => (
          renderReference(reference)
        )) : <div className={css(styles.scripture)}>No inactive scriptures</div>}
      </div>
    </div>
  )
}

export default class Browse extends Component {
  constructor() {
    super()
    this.state = {
      adding: false,
    }
  }

  render() {
    const {currentScriptures, scriptures, games, scores, keywords} = this.props
    if (this.state.adding) {
      return <Add
        {...this.props}
        onDone={() => this.setState({adding: false})}
      />
    }
    return <div className={css(styles.container)}>
      {renderScriptures(games, currentScriptures, scriptures, scores, keywords)}
      <button
        onClick={() => this.setState({adding: true})}
        className={css(styles.addButton)}
      >
        Add scriptures
      </button>
    </div>
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // flexDirection: 'row',
  },
  scriptures: {
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },

  scripture: {
    padding: '10px 20px',
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionHeader: {
    padding: '5px 20px',
    backgroundColor: '#aef',
    color: '#0062bb',
  },

  addButton: {
    backgroundColor: '#aef',
    padding: '10px 20px',
    marginTop: 10,
    border: 'none',
    fontSize: '1.3em',
    fontWeight: 200,
  },

  scriptureText: {
    fontSize: '.9em',
    marginTop: 5,
  },

  referenceName: {
    flex: 1,
  },

  star: {
    fontSize: 12,
    // paddingLeft: 10,
  },

  button: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    boxShadow: '0 0 3px #88a',
    margin: 5,
    backgroundColor: 'white',
    border: 'none',
  },
})
