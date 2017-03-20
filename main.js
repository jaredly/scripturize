// @flow
// $FlowFixMe
import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';

import ScriptureList from './src/ScriptureList';
import ScriptureView from './src/ScriptureView';

import type {Data, Scripture, Tag} from './src/types'

/*
Games:
absorb
- record yourself saying it
- listen to yourself having said it
- watch each word being revealed in sequence
- setup chunks
- pick keywords

memorize
- word path
- flappy verse
- falling words probably
- snake w/ words

^ show "best today", "best this week", and "best all time"

recall
- first letter typing
- ??? is there anything else?

*/

const KEY = 'scripturize'

const tagColors = ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']

const initialData = (): Data => {
  return {
    scriptures: {
      demo: {
        id: 'demo',
        tags: ['demo-tag'],
        nickname: 'God loved the world',
        reference: 'John 3:16',
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        keywords: null,
        chunks: null,
        scores: {},
      },
    },
    tags: {
      'demo-tag': {
        id: 'demo-tag',
        name: 'Love',
        color: tagColors[0],
      }
    },
  }
}

class Main extends React.Component {
  props: {data: Data}
  state: {scripture: ?string, game: ?string}
  constructor() {
    super()
    this.state = {scripture: null, game: null}
  }

  render() {
    if (this.state.scripture) {
      if (this.state.game) {
        // return render game
      }
      return <ScriptureView
        onStartGame={game => this.setState({game})}
        onBack={() => this.setState({scripture: null})}
        onUpdate={update => this.props.onUpdate(this.state.scripture, update)}
        scripture={this.props.data.scriptures[this.state.scripture]}
        tags={this.props.data.tags}
      />
      // return render scripture overview
    }

    return <ScriptureList
      onSelect={id => this.setState({scripture: id})}
      scriptures={this.props.data.scriptures}
      tags={this.props.data.tags}
    />
  }
}

const save = data => AsyncStorage.setItem(KEY, JSON.stringify(data))

class App extends React.Component {
  state: {data: any}
  constructor() {
    super()
    this.state = {
      data: null,
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(KEY).then(res => {
      let data
      if (res) {
        // try { data = JSON.parse(res) } catch (e) { }
      }
      if (!data) {
        data = initialData()
        save(data)
      }
      this.setState({data})
    }, err => console.error(err))
  }

  onUpdate = (id: string, update: any) => {
    const {data} = this.state
    const newData = {
      ...data,
      scriptures: {
        ...data.scriptures,
        [id]: {
          ...data.scriptures[id],
          ...update,
        }
      }
    }
    save(newData)
    this.setState({data: newData})
  }

  render() {
    return this.state.data
      ? <Main
        data={this.state.data}
        onUpdate={this.onUpdate}
      />
      : <Text style={styles.loading}>Loading...</Text>
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    // justifyContent: 'center',
  },
});

Expo.registerRootComponent(App);