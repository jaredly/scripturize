// @flow
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  WebView,
  Button,
  Switch,
  Slider,
} from 'react-native'

export default class Measurer extends React.Component {
  wordHeight: number
  state: {size: ?{width: number, height: number}, wordSizes: number[]}
  constructor(props: {words: string[], Game: any}) {
    super()
    this.state = {size: null, wordSizes: []}
    this.wordHeight = 20
  }
  render() {
    if (this.state.size) {
      const {Game} = this.props
      return (
        <Game {...this.props} {...this.state} wordHeight={this.wordHeight} />
      )
    }
    return (
      <View
        style={{flex: 1, alignSelf: 'stretch', alignItems: 'center'}}
        onLayout={evt => {
          const size = {
            width: evt.nativeEvent.layout.width,
            height: evt.nativeEvent.layout.height,
          }
          setTimeout(() => this.setState({size}), 50)
        }}
      >
        {this.props.words.map((word, i) => (
          <Text
            key={i}
            onLayout={evt =>
              ((this.state.wordSizes[i] =
                evt.nativeEvent.layout.width), (this.wordHeight =
                evt.nativeEvent.layout.height))}
            style={[this.props.textStyle, {color: 'transparent'}]}
          >
            {word}
          </Text>
        ))}
      </View>
    )
  }
}
