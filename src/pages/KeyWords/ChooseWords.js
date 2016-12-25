
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

export default class ChooseWords extends Component {
  constructor(props) {
    super()
    this.state = {
      selected: props.initial || {},
    }
  }

  canSubmit() {
    const minWords = parseInt(this.props.words.length / 6)
    const picked = Object.keys(this.state.selected).filter(k => this.state.selected[k]).length
    return picked >= minWords
  }

  render() {
    const {words, seps} = this.props
    return <div className={css(styles.container)}>
      <div className={css(styles.scripture)}>
        {words.map((word, i) => (
          <div
            key={i}
            onClick={() => this.setState({selected: {...this.state.selected, [i]: !this.state.selected[i]}})}
            className={css(styles.word)}
          >
            <div className={css(this.state.selected[i] && styles.selectedWord)}>
              {word}
            </div>
            <div className={css(styles.sep)}>{seps[i]}</div>
          </div>
        ))}
      </div>
      <div
        className={css(styles.hintText)}
      >
        Choose at least {parseInt(words.length / 6)} key words.
      </div>
      <button
        onClick={() => this.props.onChoose(this.state.selected)}
        className={css(styles.button)}
        disabled={!this.canSubmit()}
      >
        Done
      </button>
    </div>
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    overflow: 'auto',
  },

  scripture: {
    color: '#777',
    fontSize: 24,
    padding: 10,
    lineHeight: '1em',
    flexDirection: 'row',
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

  button: {
    backgroundColor: '#aef',
    padding: '10px 20px',
    marginTop: 10,
    border: 'none',
    fontSize: '1.3em',
    fontWeight: 200,
  },

  hintText: {
    padding: '5px 10px',
  },
})
