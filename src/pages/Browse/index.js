// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {hashHistory} from 'react-router'

export default class Browse extends Component {
  render() {
    return <div className={css(styles.container)}>
      {this.props.pages.map(page => (
        <button
          key={page.path}
          onClick={() => hashHistory.push('/' + page.path)}
          className={css(styles.button)}
        >
          {page.name}
        </button>
      ))}
    </div>
  }
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
  },

  button: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    boxShadow: '0 0 3px #88a',
    margin: 5,
    backgroundColor: 'white',
    border: 'none',
  },
})

