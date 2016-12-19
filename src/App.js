// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Browse from './pages/Browse'
import KeyWords from './pages/KeyWords'

const pages = [
  {name: 'KeyWords', path: 'key-words'},
  {name: 'WordPath', path: 'word-path'},
]

const title = secondRoute => {
  if (!secondRoute) return 'Scripturize'
  for (let page of pages) {
    if (page.path === secondRoute.path) return page.name
  }
  return 'Scripturize!'
}

const Wrapper = ({children, routes}) => <div className={css(styles.container)}>
  <div className={css(styles.top)}>
    <div className={css(styles.side)}>
      {routes.length > 1 && routes[1].path && <button
        className={css(styles.homeButton)}
        onClick={() => hashHistory.push('/')}
      >
        home
      </button>}
    </div>
    <div className={css(styles.title)}>
      {title(routes[1])}
    </div>
    <div className={css(styles.side)}/>
  </div>
  {React.cloneElement(children, {
    pages,
  })}
</div>

export default class App extends Component {
  constructor() {
    super()
  }

  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={Wrapper}>
        <IndexRoute component={Browse}/>
        <Route path="key-words" component={KeyWords} />
      </Route>
    </Router>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  side: {
    width: 100,
  },

  title: {
    flex: 1,
    padding: '5px 10px',
    alignItems: 'center',
  },

  top: {
    flexDirection: 'row',
  },

  homeButton: {
    borderRadius: 5,
    boxShadow: '0 0 3px #88a',
    margin: 5,
    backgroundColor: 'white',
    border: 'none',
    alignSelf: 'flex-start',
  },
});

