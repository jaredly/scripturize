
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import makeMap from './makeMap'
import WordBoard from './WordBoard'
import WalkTiles from './WalkTiles'
import Timer from './Timer'
import PreviewText from './PreviewText'
import Scores from './Scores'

const WIDTH = Math.min(window.innerWidth, window.innerHeight)
const HEIGHT = WIDTH

const slideTime = 200
const minSlide = 100
const SLIDE = true

const GAME_ID = 'word-path'

const initialState = letters => {
  const {matrix, path} = makeMap(letters)
  return {
    won: false,
    showingScores: false,
    text: letters,
    // start: Date.now(),
    wrong: 0,
    showWrong: false,
    matrix,
    path,
    size: 30,
    x: path[0][0],
    y: path[0][1],
    walked: [path[0]],
    taken: {
      [`${path[0][0]},${path[0][1]}`]: true,
    },
    dx: 0,
    dy: 0,
  }
}

export default class WordPath extends Component {
  constructor(props) {
    super()

    this.state = initialState(props.scripture.letters)
    this.moving = false
    this._touching = false
  }

  playAgain = () => {
    this.setState(initialState(this.props.scripture.letters))
    this.moving = false
    this._touching = false
  }

  componentDidMount() {
    window.addEventListener('wheel', this.onWheel)
    window.addEventListener('touchstart', this.onTouchStart)
    window.addEventListener('touchmove', this.onTouchMove)
    window.addEventListener('touchend', this.onTouchEnd)
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('touchstart', this.onTouchStart)
    window.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('touchend', this.onTouchEnd)
  }

  onTouchStart = e => {
    if (this.state.won) return
    this._touching = {
      x: e.touches[0].clientX - this.state.dx,
      y: e.touches[0].clientY - this.state.dy
    }
  }

  onTouchMove = e => {
    if (!this._touching) return
    const dx = - (e.touches[0].clientX - this._touching.x)
    const dy = - (e.touches[0].clientY - this._touching.y)
    e.preventDefault()
    e.stopPropagation()
    if (this.moving) {
      this._touching = {x: e.touches[0].clientX, y: e.touches[0].clientY}
      return
    }
    const ax = Math.abs(dx)
    const ay = Math.abs(dy)

    const slider = window.innerWidth / 5
    if (Math.max(ax, ay) < slider * .5 ) {
      if (SLIDE) this.setState({dx, dy})
      return
    }

    this._touching = {x: e.touches[0].clientX, y: e.touches[0].clientY}
    if (ax > ay) {
      this.go(dx > 0 ? 1 : -1, 0)
    } else {
      this.go(0, dy > 0 ? 1 : -1)
    }
    this.moving = true
    setTimeout(() => this.moving = false, slideTime / 3)
  }

  onTouchEnd = e => {
    this._touching = false
    this.setState({dx: 0, dy: 0})
  }

  onWheel = e => {
    e.preventDefault()
    e.stopPropagation()
    window.scrollTop = 0
    window.scrollLeft = 0
    // console.log(e.deltaX, e.deltaY)
    if (this.moving || this.state.won) return
    const dx = this.state.dx + e.deltaX
    const dy = this.state.dy + e.deltaY
    const ax = Math.abs(dx)
    const ay = Math.abs(dy)
    if (Math.max(ax, ay) < minSlide) {
      // console.log(dx, dy)
      this.setState({dx, dy})
      return
    }
    if (ax > ay) {
      this.go(dx > 0 ? 1 : -1, 0)
    } else {
      this.go(0, dy > 0 ? 1 : -1)
    }
    this.moving = true
    setTimeout(() => this.moving = false, slideTime)
  }

  go(dx, dy) {
    if (this.state.won) return
    const {walked, taken, x, y, wrong} = this.state
    const nx = x + dx
    const ny = y + dy
    if (ny >= this.state.matrix[0].length) return
    if (nx >= this.state.matrix.length) return
    if (ny < 0 || nx < 0) return

    if (taken[`${nx},${ny}`]) {
      if (walked.length > 1) {
        const llast = walked[walked.length - 2]
        if (nx === llast[0] && ny === llast[1]) {
          // going back
          this.setState({
            walked: walked.slice(0, -1),
            showWrong: wrong < 2 ? false : this.state.showWrong,
            wrong: Math.max(0, wrong - 1),
            x: nx, y: ny,
            dx: 0, dy: 0,
            taken: {
              ...taken,
              [`${x},${y}`]: false,
            },
          })
        }
      }
      return false
    }

    let nwrong = 0
    if (wrong > 0) {
      nwrong = wrong + 1
    } else {
      const right = this.state.path[this.state.walked.length]
      if (right[0] !== nx || right[1] !== ny) {
        nwrong = 1
      }
    }
    const won = nwrong === 0 && walked.length + 1 === this.state.path.length ? Date.now() : false
    if (won) {
      this.props.saveScore(GAME_ID, {
        score: won - this.state.start,
        date: won,
      })
    }
    this.setState({
      start: this.state.start || Date.now(),
      won,
      showingScores: won,
      wrong: nwrong,
      showWrong: nwrong > 2 ? true : this.state.showWrong,
      x: nx, y: ny,
      dx: 0, dy: 0,
      walked: walked.concat([[nx, ny]]),
      taken: {
        ...taken,
        [`${nx},${ny}`]: true,
      },
    })
  }

  render() {
    const {x, y, matrix, dx, dy, walked, wrong} = this.state

    const nwalked = walked.length
    const yn = 5
    const xn = 5
    const {
      bigEnough, ux, dless, tx, ty, size
    } = calcPlacement(x, y, dx, dy, xn, yn)

    let transform
    if (this.state.won) {
      // transform so the whole board is visible
      const yscale = yn / matrix[0].length
      const xscale = xn / matrix.length
      const scale = Math.min(yscale, xscale)
      transform = `scale(${scale}, ${scale})`
    } else {
      if (SLIDE) {
        transform = `translate(${
              tx - (ux  && bigEnough ? dless: 0)
            }px, ${
              ty - (ux || !bigEnough ? 0 : dless)
            }px)`
      } else {
        transform = `translate(${tx}px, ${ty}px)`
      }
    }

    return <div className={css(styles.container)}>
      {this.state.start && <Timer
        className={css(styles.timer)}
        start={this.state.start}
        end={this.state.won}
      />}
      <div className={css(styles.wordBoard)} style={{width: WIDTH, height: HEIGHT}}>
        <div
          style={{
            transition: bigEnough ? '' : `transform ${slideTime / 1000 * 1}s ease`,
            transform: transform,
            transformOrigin: 'top left',
          }}
        >
          <WalkTiles
            size={size}
            wrong={this.state.wrong}
            walked={this.state.walked}
            showWrong={this.state.showWrong}
          />
          <WordBoard
            matrix={matrix}
            size={size}
          />
        </div>
      </div>
      <PreviewText
        walked={this.state.walked}
        matrix={this.state.matrix}
      />
      {this.state.showingScores &&
        <Scores
          text={this.state.text}
          scores={this.props.scores[GAME_ID] || []}
          justNow={this.state.won}
          close={() => this.setState({showingScores: false})}
          playAgain={this.playAgain}
        />}
      {this.state.won &&
        <button
          onClick={this.playAgain}
          className={css(styles.button)}
        >
          Play again
        </button>}
    </div>
  }
}

const calcPlacement = (x, y, dx, dy, xn, yn) => {
  const size = WIDTH / yn
  const ymargin = (yn - 1) / 2 * size
  const xmargin = (xn - 1) / 2 * size
  const cx = -x * size
  const cy = -y * size
  // const tsize = size / 3
  const ux = Math.abs(dx) > Math.abs(dy)
  const swipeMin = 5
  const dd = ux ? dx : dy

  const tx = cx + xmargin
  const ty = cy + ymargin
  const bigEnough = Math.abs(ux ? dx : dy) > swipeMin
  const dless = Math.sqrt(dd > 0 ? dd - swipeMin : dd + swipeMin)

  return {bigEnough, ux, dless, tx, ty, size}
}

const styles = StyleSheet.create({
  container: {
    WebkitOverflowScrolling: 'touch',
    flex: 1,
  },

  timer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },

  wordBoard: {
    overflow: 'hidden',
    marginBottom: 50,
  },

  item: {
    position: 'absolute',
  },

  button: {
    backgroundColor: '#aef',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'stretch',
    marginTop: 5,
  },
})
