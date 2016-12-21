// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'

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
      <div className={css(styles.scriptures)}>
        {currentScriptures.map(
          reference => (
            <div
              key={reference}
              onClick={() => hashHistory.push('/' + reference)}
              className={css(styles.scripture)}
            >
              {reference}
            </div>
          )
        )}
      </div>
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
  },
  scripture: {
    padding: '10px 20px',
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
    fontSize: '.8em',
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
