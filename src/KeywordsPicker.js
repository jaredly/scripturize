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

import type {Data, Scripture, Tag} from './types'


export default class KeywordsPicker extends React.Component {
  state: {
    keywords: number[],
  }
  constructor(props: any) {
    super()
    this.state = {
      keywords: props.scripture.keywords || [],
    }
  }

  toggle = (i: number) => {
    const {keywords} = this.state
    if (keywords.indexOf(i) !== -1) {
      this.setState({keywords: keywords.filter(n => n !== i)})
    } else {
      this.setState({keywords: keywords.concat([i])})
    }
  }

  render() {
    const {scripture} = this.props
    const {keywords} = this.state
    const words = wordSplit(scripture.text)
    return <View
      style={styles.container}
    >
      <Header
        onClose={this.props.onCancel}
        title={scripture.nickname}
      />
      <ScrollView
        style={{flex: 1}}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            // justifyContent: 'flex-start',
            padding: 10,
          }}
        >
          {words.map((word, i) => (
            <TouchableOpacity
              key={i}
              onPressIn={() => this.toggle(i)}
            >
              <Text
                style={[{
                  padding: 10,
                  fontWeight: '200',
                  fontSize: 25,
                }, keywords.indexOf(i) !== -1 && {
                  backgroundColor: '#eee',
                }]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => this.props.onSave(this.state.keywords)}
      >
      <View
        style={{
          backgroundColor: '#841584',
          padding: 15,
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 23,
          color: 'white',
        }}>
          Set keywords
        </Text>
      </View>
      </TouchableOpacity>
    </View>
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

  nickname: {
    fontSize: 20,
    fontWeight: '200',
    textAlign: 'center',
    margin: 10,
  }
});
