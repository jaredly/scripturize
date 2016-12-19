
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

export default class WordBoard extends Component {
  constructor() {
    super()
  }

  shouldComponentUpdate(nextProps) {
    return false
  }

  render() {
    const size = this.props.size
    return <div className={css(styles.container)}>
        {this.props.matrix.map((row, r) => (
          row.map((l, c) => (
            <div
              key={r + ',' + c}
              className={css(styles.tile)}
              style={{
                left: (+r) * size,
                top: (+c) * size,
                width: size,
                height: size,
              }}
            >
              {l}
            </div>
          ))
        ))}
    </div>
  }
}

/*
 *
      {this.props.board.map((row, r) => (
        <div key={r} className={css(styles.row)}>
          {row.map((item, c) => (
            <div key={c} className={css(styles.item)} style={{
              top: r * size,
              left: c * size,
              width: size,
              height: size,
            }}>
              {item}
            </div>
          ))}
        </div>
      ))}
 * */

const styles = StyleSheet.create({
  container: {
  },

  tile: {
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2em',
  },

  item: {
    position: 'absolute',
  },
})

