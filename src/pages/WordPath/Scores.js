
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'


const Scores = ({scores, justNow, text, close}) => (
  <div className={css(styles.scores)}>
    <table>
      <thead>
        <tr>
          <th  className={css(styles.head)}>Seconds</th>
          <th className={css(styles.head)}>Letters/s</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, i) => (
          <tr key={i}>
            <td className={css(styles.cell, score.date === justNow && styles.thisScore)}>
              {parseInt(score.score / 1000)}s
            </td>
            <td className={css(styles.cell, score.date === justNow && styles.thisScore)}>
              {parseInt(10 * text.length / (score.score / 1000)) / 10}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div style={{flex: 1}}/>
    <button
      onClick={close}
      className={css(styles.button)}
    >
      Close
    </button>
  </div>
)

export default Scores

const styles = StyleSheet.create({
  head: {
    paddingBottom: 10,
  },

  button: {
    backgroundColor: '#aef',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'stretch',
    marginTop: 5,
  },

  cell: {
    textAlign: 'center',
    paddingBottom: 10,
  },

  thisScore: {
    fontWeight: 'bold',
    color: '#006eff',
  },

  scores: {
    position: 'absolute',
    width: 250,
    marginLeft: -125,
    left: '50%',
    top: 100,
    bottom: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    borderRadius: 3,
    boxShadow: '0 0 10px #777',
  }
})
