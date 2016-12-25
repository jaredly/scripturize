// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'
import {hashHistory} from 'react-router'

import ChooseWords from '../KeyWords/ChooseWords'

const showScripture = ({words, seps}, keywords) => {
  return <div className={css(styles.preview)}>
    {words.map((word, i) => (
      <div key={i} className={css(styles.word)}>
        <div className={css(keywords[i] && styles.selectedWord)}>
          {word}
        </div>
        <div className={css(styles.sep)}>{seps[i]}</div>
      </div>
    ))}
  </div>
}

// TODO allow picking keywords from this page
// require at least (# words / 5) keywords before you can play "keywords" based games
// also maybe chunking?
export default class ReferencePage extends Component {
  render() {
    const {scripture, scores, games, keywords} = this.props
    return <div className={css(styles.container)}>
      {showScripture(scripture.keyWords, keywords || {})}
      <button
        className={css(styles.button, styles.pickKeywords)}
        onClick={() => hashHistory.push(`/${scripture.reference}/key-words`)}
      >
        Pick keywords
      </button>
      {Object.keys(games).map(path => (
        (games[path].needsKeywords && !keywords) ? null :
          <button
            key={path}
            className={css(styles.button)}
            style={{backgroundColor: games[path].color}}
            onClick={() => hashHistory.push(`/${scripture.reference}/${path}`)}
          >
            {games[path].title}
            {scores[path] ?
              <div className={css(styles.score)}>
                {games[path].formatScore(scores[path][0])}
              </div> :
              <div className={css(styles.score)}>
                never played
              </div>
            }
            {scores[path] && games[path].isMastered(scripture, scores[path][0], keywords) ?
              <div className={css(styles.mastered)}>
                ★
              </div>
              : null}
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

  mastered: {
    fontSize: 16,
    paddingLeft: 10,
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

  pickKeywords: {
    fontSize: '1em',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  preview: {
    color: '#777',
    fontSize: 24,
    padding: 10,
    flexDirection: 'row',
    lineHeight: '1em',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  word: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: '3px 0px',
    borderRadius: 5,
    minWidth: 15,
  },

  sep: {
    minWidth: 15,
  },

  selectedWord: {
    // backgroundColor: '#aaf',
    fontWeight: 'bold',
    color: 'black',
  },

})
