import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View,
  SegmentedControlIOS,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Clipboard,
  Button,
  KeyboardAvoidingView,
} from 'react-native';

import Header from './Header'

class AddScripture extends React.Component {
  constructor() {
    super()
    this.state = {
      tags: [],
      nickname: '',
      reference: '',
      text: '',
    }
  }

  grabFromClipboard = () => {
    Clipboard.getString().then(string => this.setState({text: string}))
  }

  render() {
    return <KeyboardAvoidingView
      behavior="padding"
      style={{flex: 1, marginTop: 20}}
    >
      <Header 
        title="Add scripture"
        onClose={this.props.onCancel}
      />
      <ScrollView
        style={{flex: 1}}
      >
      <TextInput
        placeholder="Nickname"
        value={this.state.nickname}
        onChangeText={nickname => this.setState({nickname})}
        style={{height: 40, fontSize: 20, padding: 10}}
      />
      <TextInput
        placeholder="Reference"
        value={this.state.reference}
        onChangeText={reference => this.setState({reference})}
        style={{height: 40, fontSize: 20, padding: 10}}
      />
      <View style={{flexDirection: 'row'}}>
      <Text style={{paddingHorizontal: 10, marginTop: 10}}>Text</Text>
      {!this.state.text && <Button
        title="Grab from clipboard"  
        onPress={this.grabFromClipboard}
      />}
      </View>
      <TextInput
        multiline
        value={this.state.text}
        onChangeText={text => this.setState({text})}
        style={{height: 200, fontSize: 20, padding: 10}}
      />
      </ScrollView>
      <TouchableHighlight
        onPress={() => this.props.onAdd(this.state)}
        disabled={!this.state.nickname || !this.state.text || !this.state.reference}
      >
      <View
        style={{backgroundColor: '#fee'}}
      >
        <Text style={{
          fontSize: 20,
          textAlign: 'center',
          fontWeight: '200',
          padding: 10,
        }}>
          Add
        </Text>
      </View>
      </TouchableHighlight>
    </KeyboardAvoidingView>
  }
}

export default class ScriptureList extends React.Component {
  state: {
    filter: number,
    adding: boolean,
  }
  constructor() {
    super()
    this.state = {
      filter: 0,
      adding: false,
    }
  }

  render() {
    if (this.state.adding) {
      return <AddScripture
        onCancel={() => this.setState({adding: false})}
        onAdd={data => (this.setState({adding: false}), this.props.onAdd(data))}
        tags={this.props.tags}
        // TODO prefill with e.g. selected tags or something
      />
    }

    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          values={['Recent', 'Needs work', 'All']}
          selectedIndex={this.state.filter}
          style={{marginHorizontal: 10, marginTop: 10, marginBottom: 10}}
          onChange={({nativeEvent: {selectedSegmentIndex: filter}}) => this.setState({filter})}
        />
        <ScrollView style={{flex: 1}}>
        {Object.keys(this.props.scriptures).map(id => {
          const scripture = this.props.scriptures[id]
          return <TouchableHighlight
            key={id}
            underlayColor="#eee"
            onPress={() => this.props.onSelect(id)}
          >
            <View style={styles.scripture}>
              <Text style={styles.nickname}>{scripture.nickname}</Text>
              <Text style={styles.reference}>{scripture.reference}</Text>
              {/* TODO a little indicator about progress? */}
              <View style={styles.tags}>
                {scripture.tags.map(id => (
                  <View style={[styles.tag, {backgroundColor: this.props.tags[id].color}]} key={id}>
                    <Text style={styles.tagName}>
                      {this.props.tags[id].name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableHighlight>
        })}
        </ScrollView>
        <TouchableHighlight
          onPress={() => this.setState({adding: true})}
        >
        <View
          style={{backgroundColor: '#fee'}}
        >
          <Text style={{
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '200',
            padding: 20,
          }}>
            Add scripture
          </Text>
        </View>
        </TouchableHighlight>
      </View>
    );
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

  scripture: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  nickname: {
    fontSize: 20,
    fontWeight: '200',
  },

  reference: {
    fontSize: 16,
    fontWeight: '200',
  },

  tags: {
    flexDirection: 'row',
    marginTop: 10,
  },

  tag: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  tagName: {
    fontWeight: '200',
  }
});
