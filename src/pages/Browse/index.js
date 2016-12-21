// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'

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

const organizeScriptures = (currentScriptures, scores) => {
  const current = []
  // const mastered = []
  const rest = []
  currentScriptures.forEach(reference => {
    if (isCurrent(scores[reference])) {
      current.push(reference)
    } else {
      rest.push(reference)
    }
  })
  return {current, rest}
}

const renderReference = (reference) => {
  return <div
    key={reference}
    onClick={() => hashHistory.push('/' + reference)}
    className={css(styles.scripture)}
  >
    {reference}
  </div>
}
// TODO played # times

const renderScriptures = (currentScriptures, scores) => {
  const {current, rest} = organizeScriptures(currentScriptures, scores)
  return (
    <div className={css(styles.scriptures)}>
      <div className={css(styles.sectionHeader)}>
        Active
      </div>
      <div className={css(styles.section)}>
        {current.length ? current.map(reference => (
          renderReference(reference)
        )) : <div className={css(styles.scripture)}>No active scriptures</div>}
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
    const {currentScriptures, scriptures} = this.props
    if (this.state.adding) {
      const smap = {}
      currentScriptures.forEach(k => smap[k] = true)
      return <div className={css(styles.container)}>
        <div className={css(styles.scriptures)}>
          {Object.keys(scriptures).map(
            reference => (
              smap[reference] ?
                null :
                <div
                  key={reference}
                  className={css(styles.scripture)}
                  onClick={() => this.props.addScripture(reference)}
                >
                  {reference}
                  <div className={css(styles.scriptureText)}>
                    {scriptures[reference]}
                  </div>
                </div>
            )
          )}
        </div>
        <button
          onClick={() => this.setState({adding: false})}
          className={css(styles.addButton)}
        >
          Done
        </button>
      </div>
    }
    return <div className={css(styles.container)}>
      {renderScriptures(currentScriptures, this.props.scores)}
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
