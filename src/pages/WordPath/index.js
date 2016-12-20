
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import makeMap from './makeMap'
import WordBoard from './WordBoard'

window.makeMap = makeMap

const scriptureText = "Wherefore, do not spend money for that which is of no worth, nor your labor for that which cannot satisfy. Hearken diligently unto me, and remember the words which I have spoken; and come unto the Holy One of Israel, and feast upon that which perisheth not, neither can be corrupted, and let your soul delight in fatness."
const justLetters = scriptureText
  .toLowerCase()
  .toUpperCase()
  .replace(/[^a-zA-Z\s]/g, '')

const slideTime = 200
const minSlide = 100

export default class WordPath extends Component {
  constructor() {
    super()

    const {matrix, path} = makeMap(justLetters)
    this.state = {
      text: justLetters,
      start: Date.now(),
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
    this.moving = false
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
    if (Math.max(ax, ay) < slider * .5) {
      // this.setState({dx, dy})
      // console.log('ignore slide', ax, ay)
      return
    }

    this._touching = {x: e.touches[0].clientX, y: e.touches[0].clientY}
    if (ax > ay) {
      this.go(dx > 0 ? 1 : -1, 0)
    } else {
      this.go(0, dy > 0 ? 1 : -1)
    }
    this.moving = true
    setTimeout(() => this.moving = false, slideTime)
  }

  onTouchEnd = e => {
    this._touching = false
  }

  onWheel = e => {
    e.preventDefault()
    e.stopPropagation()
    window.scrollTop = 0
    window.scrollLeft = 0
    // console.log(e.deltaX, e.deltaY)
    if (this.moving) return
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
    this.setState({
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
    const width = window.innerWidth
    const height = width
    const yn = 5
    const xn = 5
    const size = width / yn
    const ymargin = (yn - 1) / 2 * size
    const xmargin = (xn - 1) / 2 * size
    const cx = -x * size
    const cy = -y * size
    const tx = cx + xmargin
    const ty = cy + ymargin
    const tsize = size / 3
    // console.log(matrix, x, y)
    const nwalked = walked.length
    const ux = Math.abs(dx) > Math.abs(dy)
    let text = ''
    for (let i=0; i<nwalked; i++) {
      text += matrix[walked[i][0]][walked[i][1]]
    }

    return <div className={css(styles.container)}>
      <Timer start={this.state.start} />
      <div
        className={css(styles.wordBoard)}
        style={{
          width,
          height,
          overflow: 'hidden',
        }}
      >
      <div
        style={{
          transition: `transform ${slideTime / 1000 * 1.5}s ease`,
          transform: `translate(${
            tx // - (ux ? dx : 0)
          }px, ${
            ty // - (ux ? 0 : dy)
          }px)`,
        }}
      >
        {this.state.walked.map((pos, i) => (
          <WalkTile
            key={i}
            pos={pos}
            next={i < nwalked - 1 && this.state.walked[i + 1]}
            wrong={this.state.showWrong && i >= nwalked - wrong}
            size={size}
          />
        ))}
        <WordBoard
          matrix={matrix}
          size={size}
        />
      </div>
      </div>
      <div className={css(styles.formed)}>
        {text[0] + text.slice(1).toLowerCase()}
      </div>
    </div>
  }
}

const walkPerc = .8
const WalkTile = ({pos, next, size, wrong}) => {
  return <div>
    <div
      style={{
        left: pos[0] * size + size * (.5 - walkPerc/2),
        top: pos[1] * size + size * (.5 - walkPerc/2),
        width: size * walkPerc,
        height: size * walkPerc,
      }}
      className={css(styles.walkedTile, wrong && styles.wrongTile)}
    />
    {next && makeNextBlock(pos, next, size, wrong)}
  </div>
}

const timeDiff = dd => {
  const secs = (dd/1000)|0
  let s = secs % 60
  if (s < 10) s = '0' + s
  const mins = (secs / 60)|0
  let m = mins % 60
  if (mins < 60) return m + ':' + s
  if (m < 10) m = '0' + m
  const h = (mins / 60)|0
  return `${h}:${m}:${s}`
}

class Timer extends Component {
  constructor(){
    super()
    this.state = {tick: 0}
  }
  componentDidMount(){
    this._tick = setInterval(() => this.setState({tick: 0}), 100)
  }
  componentWillUnmount() {
    clearInterval(this._tick)
  }
  render() {
    return <div className={css(styles.timer)}>
      {timeDiff(Date.now() - this.props.start)}
    </div>
  }
}

const makeNextBlock = (pos, next, size, wrong) => {
  const walkThick = size * walkPerc
  const walkThin = size - walkThick
  const dx = next[0] - pos[0]
  const dy = next[1] - pos[1]
  const width = dx === 0 ? walkThick : walkThin
  const height = dy === 0 ? walkThick : walkThin
  // console.log(dx, dy, walkThin, walkThick, width, height)
  return <div
    style={{
      width: width,
      height: height,
      left: pos[0] * size + size / 2 + size / 2 * dx - width / 2,
      top: pos[1] * size + size / 2 + size / 2 * dy - height / 2,
    }}
    className={css(styles.walkedTile, wrong && styles.wrongTile)}
  />
}


const styles = StyleSheet.create({
  container: {
    WebkitOverflowScrolling: 'touch',
  },

  timer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },

  formed: {
    padding: 10,
  },

  wordBoard: {
  },

  walkedTile: {
    position: 'absolute',
    backgroundColor: '#aaf',
  },

  wrongTile: {
    backgroundColor: '#faa',
  },

  item: {
    position: 'absolute',
  },
})

