// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'

export default ({onClose, title}: {onClose: () => void, title: string}) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}>
    <TouchableOpacity
      onPress={onClose}
      style={{alignSelf: 'stretch', paddingHorizontal: 20, paddingVertical: 10}}
    >
      <Ionicons
        name="ios-close"
        size={32}
        color="#aaa"
      />
    </TouchableOpacity>
    <Text style={{
      flex: 1,
      fontSize: 20,
      fontWeight: '200',
      textAlign: 'center',
      margin: 10,
    }}>
      {title}
    </Text>
  </View>

)
