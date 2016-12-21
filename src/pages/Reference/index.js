// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'
import {hashHistory} from 'react-router'

const games = [
  {title: 'Word Path', path: 'word-path'},
  // {title: 'Falling blocks', path: 'falling-blocks'},
  // {title: 'Key Words', path: 'key-words'},
]

export default class ReferencePage extends Component {
  render() {
    const {scriptureText, scriptureReference} = this.props
    return <div className={css(styles.container)}>
      <div className={css(styles.preview)}>
        {scriptureText}
      </div>
      {games.map(game => (
        <button
          key={game.path}
          className={css(styles.button)}
          onClick={() => hashHistory.push(`/${scriptureReference}/${game.path}`)}
        >
          {game.title}
        </button>
      ))}
    </div>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    backgroundColor: '#aef',
    marginTop: 5,
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '2em',

    ':hover': {
      backgroundColor: '#ccc',
    },
  },

  preview: {
    padding: 20,
    fontSize: '1.5em',
    lineHeight: 1.5,
  }
})
