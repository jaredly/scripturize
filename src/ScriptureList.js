import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View,
  SegmentedControlIOS,
  TouchableHighlight,
  ScrollView,
} from 'react-native';


type Props = {

}
export default class ScriptureList extends React.Component {
  state: {
    selectedIndex: number,
  }
  constructor() {
    super()
    this.state = {
      selectedIndex: 0,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          values={['Recent', 'Needs work', 'All']}
          selectedIndex={this.state.selectedIndex}
          style={{marginHorizontal: 10, marginTop: 10, marginBottom: 10}}
          onChange={({nativeEvent: {selectedSegmentIndex: selectedIndex}}) => this.setState({selectedIndex})}
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
