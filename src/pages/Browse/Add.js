import React from 'react'
import {css, StyleSheet} from 'aphrodite'

export default ({addScripture, currentScriptures, scriptures, games, scores, keywords, onDone}) => {
  const smap = {}
  currentScriptures.forEach(k => smap[k] = true)
  return <div className={css(styles.container)}>
    <div className={css(styles.scriptures)}>
      {Object.keys(scriptures).map(
        reference => (
          smap[reference] ?
            null :
            <div
              key={reference}
              className={css(styles.scripture)}
              onClick={() => addScripture(reference)}
            >
              {reference}
              <div className={css(styles.scriptureText)}>
                {scriptures[reference].text}
              </div>
            </div>
        )
      )}
    </div>
    <button
      onClick={onDone}
      className={css(styles.addButton)}
    >
      Done
    </button>
  </div>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scriptures: {
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },

  scripture: {
    padding: '10px 20px',
  },

  sectionHeader: {
    padding: '5px 20px',
    backgroundColor: '#aef',
    color: '#0062bb',
  },

  addButton: {
    backgroundColor: '#aef',
    padding: '10px 20px',
    marginTop: 10,
    border: 'none',
    fontSize: '1.3em',
    fontWeight: 200,
  },

  scriptureText: {
    fontSize: '.9em',
    marginTop: 5,
  },

  referenceName: {
    flex: 1,
  },

  star: {
    fontSize: 12,
    // paddingLeft: 10,
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
