// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'
import {hashHistory} from 'react-router'

// TODO allow picking keywords from this page
// require at least (# words / 5) keywords before you can play "keywords" based games
// also maybe chunking?
export default class ReferencePage extends Component {
  render() {
    const {scriptureText, scriptureReference, scores} = this.props
    return <div className={css(styles.container)}>
      <div className={css(styles.preview)}>
        {scriptureText}
      </div>
      {this.props.games.map(game => (
        <button
          key={game.path}
          className={css(styles.button)}
          style={{backgroundColor: game.color}}
          onClick={() => hashHistory.push(`/${scriptureReference}/${game.path}`)}
        >
          {game.title}
          {scores[game.path] ?
            <div className={css(styles.score)}>
              {parseInt(scores[game.path][0].score / 1000)}s
            </div> :
            <div className={css(styles.score)}>
              never played
            </div>
          }
        </button>
      ))}
    </div>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'auto',
  },

  score: {
    marginLeft: 5,
    fontSize: '.5em',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },

  button: {
    flexShrink: 0,
    marginTop: 5,
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1.5em',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

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
