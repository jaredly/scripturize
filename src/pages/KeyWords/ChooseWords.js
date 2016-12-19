
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

export default class ChooseWords extends Component {
  constructor() {
    super()
    this.state = {
      selected: {},
    }
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
      <button
        onClick={() => this.props.onChoose(this.state.selected)}
      >
        Next
      </button>
    </div>
  }
}

const styles = StyleSheet.create({

  container: {
  },

  scripture: {
    color: '#777',
    fontSize: 24,
    padding: 10,
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
})
