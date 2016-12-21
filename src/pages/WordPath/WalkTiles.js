
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'


export default class WalkTiles extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.walked !== this.props.walked
  }

  render() {
    const {wrong, size, walked, showWrong} = this.props
    const nwalked = walked.length
    return <div >
      {walked.map((pos, i) => (
        <WalkTile
          key={i}
          pos={pos}
          next={i < nwalked - 1 && walked[i + 1]}
          wrong={showWrong && i >= nwalked - wrong}
          size={size}
        />
      ))}
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

const makeNextBlock = (pos, next, size, wrong) => {
  const walkThick = size * walkPerc
  const walkThin = size - walkThick + 5
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

  walkedTile: {
    position: 'absolute',
    backgroundColor: '#aaf',
  },

  wrongTile: {
    backgroundColor: '#faa',
  },
})
