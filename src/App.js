// @flow

import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Browse from './pages/Browse'
import KeyWords from './pages/KeyWords'
import WordPath from './pages/WordPath'
import ReferencePage from './pages/Reference'

const pages = [
  {name: 'KeyWords', path: 'key-words'},
  {name: 'WordPath', path: 'word-path'},
]

const scriptures = {
  "Moses 1:39": "For behold, this is my work and my glory—to bring to pass the immortality and eternal life of man.",
  "Moses 7:18": "And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them.",
}

const title = (reference, secondRoute) => {
  if (!reference) return 'Scripturize'
  for (let page of pages) {
    if (page.path === secondRoute.path) return page.name
  }
  return reference
}

const Wrapper = ({children, routes, params}) => <div className={css(styles.container)}>
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
      {title(params, routes[2])}
    </div>
    <div className={css(styles.side)}/>
  </div>
  {React.cloneElement(children, {
    pages,
    scriptures,
  })}
</div>

const ReferenceWrapper = ({children, params}) => React.cloneElement(children, {
  scriptureText: scriptures[params.reference],
  scriptureReference: params.reference,
})

export default class App extends Component {
  constructor() {
    super()
  }

  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={Wrapper}>
        <IndexRoute component={Browse}/>
        <Route path=":reference" component={ReferenceWrapper}>
          <IndexRoute component={ReferencePage} />
          <Route path="key-words" component={KeyWords} />
          <Route path="word-path" component={WordPath} />
        </Route>
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
