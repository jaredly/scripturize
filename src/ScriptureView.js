// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import wordSplit from './wordSplit'
import Header from './Header'
import KeywordsPicker from './KeywordsPicker'

import type {Data, Scripture, Tag} from './types'

export default class ScriptureView extends React.Component {
  state: {pickingKeywords: boolean, }
  constructor() {
    super()
    this.state = {
      pickingKeywords: false,
    }
  }

  render() {
    const {scripture, tags} = this.props
    if (this.state.pickingKeywords) {
      return <KeywordsPicker
        scripture={scripture}
        onCancel={() => this.setState({pickingKeywords: false})}
        onSave={keywords => (this.setState({pickingKeywords: false}), this.props.onUpdate({keywords}))}
      />
    }

    return <View
      style={styles.container}
    >
      <Header
        onClose={this.props.onBack}
        title={scripture.nickname}
      />

      <ScrollView
      >
        <Text style={{
          fontSize: 15,
          paddingVertical: 5,
          textAlign: 'right',
          marginRight: 20,
        }}>
          {scripture.reference}
        </Text>
        {Object.keys(this.props.games).map(gid => (
          <TouchableOpacity key={gid} onPress={() => this.props.onStartGame(gid)}>
            <View
              style={{padding: 20,}}
            >
              <Text style={{
                fontSize: 20,
                fontWeight: '200',
              }}>
                  {gid}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <Words text={scripture.text} keywords={scripture.keywords || []} />
        <Button
          title={scripture.keywords ? "Change keywords": "Select keywords"}
          onPress={() => this.setState({pickingKeywords: true})}
        />
      </ScrollView>
    </View>
  }
}

const Words = ({text, keywords}) => {
  const words = wordSplit(text)
  return <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      padding: 10,
    }}
  >
    {words.map((word, i) => (
      <Text
        key={i}
        style={{
          fontSize: 20,
          fontWeight: keywords.indexOf(i) === -1 ? '200' : '600',
          paddingHorizontal: 3,
          paddingVertical: 3,
        }}
      >
        {word}
      </Text>
    ))}
  </View>
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    // justifyContent: 'center',
  },

  nickname: {
    fontSize: 20,
    fontWeight: '200',
    textAlign: 'center',
    margin: 10,
  }
});
