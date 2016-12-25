
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'

import Timer from '../WordPath/Timer'

const randSort = items => {
  const indices = {
  }
  for (let i=0; i<items.length; i++) {
    indices[items[i]] = Math.random()
    // indices.push(Math.random())
  }
  return items.slice().sort((a, b) => indices[b] - indices[a])
}

const GAME_ID = 'key-word-blanks'

export default class PickWords extends Component {
  constructor(props) {
    super()
    this.state = {
      picked: {},
      left: randSort(Object.keys(props.keywords)),
      start: Date.now(),
    }
  }

  unPick = i => {
    this.setState({
      picked: {...this.state.picked, [i]: null},
      left: this.state.left.concat([this.state.picked[i]]),
    })
  }

  pick = (i, forI) => {
    const left = this.state.left.slice()
    const word = left[i]
    left.splice(i, 1)
    const picked = {...this.state.picked, [forI]: word}
    if (left.length === 0) {
      this.check(picked)
    }
    this.setState({
      picked: picked,
      left,
    })
  }

  check(picked) {
    const words = this.props.scripture.keyWords.words
    const good = !Object.keys(picked).some(forI => {
      return words[forI].toLowerCase() !== words[picked[forI]].toLowerCase()
    })
    if (!good) {
      return
    }
    const won = Date.now()
    this.props.saveScore(GAME_ID, {
      score: won - this.state.start,
      date: won,
    })
    hashHistory.push(`/${this.props.scripture.reference}`)
  }

  render() {
    const {scripture: {keyWords: {words, seps}}, keywords} = this.props
    const {picked} = this.state
    const nextPicked = Object.keys(keywords).filter(k => !picked[k]).sort((a,b) => a - b)[0]
    console.log(nextPicked)
    return <div className={css(styles.container)}>
      <Timer
        className={css(styles.timer)}
        start={this.state.start}
        end={false}
      />
      <div className={css(styles.scripture)}>
        {words.map((word, i) => (
          <div
            key={i}
            className={css(styles.item)}
          >
            {keywords[i] ?
              (picked[i] ?
              <div
                className={css(styles.picked)}
                onClick={() => this.unPick(i)}
              >
                {words[picked[i]]}
              </div>
              : <div className={css(styles.blank, i == nextPicked && styles.nextBlank)} />) :
                <div className={css(styles.filler)}>
                  {words[i]}
                </div>
            }
            <div className={css(styles.sep)}>{seps[i]}</div>
          </div>
        ))}
      </div>

      <div className={css(styles.left)}>
        {this.state.left.map((word, i) => (
          <div
            key={i}
            className={css(styles.leftWord)}
            onClick={() => this.pick(i, nextPicked)}
          >
            {words[word]}
          </div>
        ))}
      </div>
    </div>
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    overflow: 'auto',
  },

  timer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },

  item: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: '3px 0px',
    borderRadius: 5,
    minWidth: 15,
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

  blank: {
    width: 60,
    height: '1em',
    backgroundColor: '#aaa',
  },

  nextBlank: {
    backgroundColor: '#aaf',
    // outline: '5px solid red',
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

  picked: {
    // backgroundColor: '#aaa',
    fontWeight: 'bold',
  },

  left: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  leftWord: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
    padding: '3px 5px',
  },
})
