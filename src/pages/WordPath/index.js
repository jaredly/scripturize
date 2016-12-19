
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

const slideTime = 400
const minSlide = 20

export default class WordPath extends Component {
  constructor() {
    super()

    const {matrix, path} = makeMap(justLetters)
    this.state = {
      matrix,
      path,
      size: 30,
      x: path[0][0],
      y: path[0][1],
      walked: [path[0]],
      taken: {
        [`${path[0][0]},${path[0][1]}`]: true,
      },
    }
    this.moving = false
  }

  componentDidMount() {
    window.addEventListener('wheel', this.onWheel)
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.onWheel)
  }

  onWheel = e => {
    window.scrollTop = 0
    window.scrollLeft = 0
    e.preventDefault()
    e.stopPropagation()
    // console.log(e.deltaX, e.deltaY)
    if (this.moving) return
    const ax = Math.abs(e.deltaX)
    const ay = Math.abs(e.deltaY)
    if (Math.max(ax, ay) < minSlide) {
      // console.log('ignore slide', ax, ay)
      return
    }
    if (ax > ay) {
      this.go(e.deltaX > 0 ? 1 : -1, 0)
    } else {
      this.go(0, e.deltaY > 0 ? 1 : -1)
    }
    this.moving = true
    setTimeout(() => this.moving = false, slideTime)
  }

  go(dx, dy) {
    const {walked, taken, x, y} = this.state
    const nx = x + dx
    const ny = y + dy
    if (ny >= this.state.matrix[0].length) return
    if (nx >= this.state.matrix.length) return
    if (ny < 0 || nx < 0) return

    if (taken[`${nx},${ny}`]) {
      if (walked.length > 1) {
        const llast = walked[walked.length - 2]
        if (nx === llast[0] && ny === llast[1]) {
          this.setState({
            walked: walked.slice(0, -1),
            x: nx, y: ny,
            taken: {
              ...taken,
              [`${x},${y}`]: false,
            },
          })
        }
      }
      return false
    }

    this.setState({
      x: nx, y: ny,
      walked: walked.concat([[nx, ny]]),
      taken: {
        ...taken,
        [`${nx},${ny}`]: true,
      },
    })
  }

  render() {
    const {x, y, matrix} = this.state
    const width = 500
    const height = 500
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
    const nwalked = this.state.walked.length
    return <div className={css(styles.container)} style={{
      width,
      height,
    }}>
      <div
        className={css(styles.wordBoard)}
        style={{
          transition: `transform ${slideTime / 1000 * 1.5}s ease`,
          transform: `translate(${tx}px, ${ty}px)`,
        }}
      >
        {this.state.walked.map((pos, i) => (
          <WalkTile
            key={i}
            pos={pos}
            next={i < nwalked - 1 && this.state.walked[i + 1]}
            size={size}
          />
        ))}
        <WordBoard
          matrix={matrix}
          size={size}
        />
      </div>
    </div>
  }
}

const walkPerc = .8
const WalkTile = ({pos, next, size}) => {
  return <div>
    <div
      style={{
        left: pos[0] * size + size * (.5 - walkPerc/2),
        top: pos[1] * size + size * (.5 - walkPerc/2),
        width: size * walkPerc,
        height: size * walkPerc,
      }}
      className={css(styles.walkedTile)}
    />
    {next && makeNextBlock(pos, next, size)}
  </div>
}

const makeNextBlock = (pos, next, size) => {
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
    className={css(styles.walkedTile)}
  />
}


const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  wordBoard: {
  },

  walkedTile: {
    position: 'absolute',
    backgroundColor: '#aaf',
  },

  item: {
    position: 'absolute',
  },
})

