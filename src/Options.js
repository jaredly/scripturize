// @flow
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,
  SegmentedControlIOS,
  TouchableOpacity,
  ScrollView,
  Slider,
  Button,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'

type OptionT = {
  type: 'switch',
  label: string,
  disabled?: boolean,
  value: boolean,
  onChange: (boolean) => void,
} | {
  type: 'options',
  label: string,
  value: string,
  values: string[],
  onChange: (string) => void,
} | {
  type: 'slider',
  label: string,
  value: number,
  step: number,
  minimumValue: number,
  maximumValue: number,
  onChange: (number) => void,
}

const Option = (props) => {
  const {option} = props
  switch (option.type) {
    case 'switch':
      return <View
        style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}
      >
        <Text style={{fontSize: 20, flex: 1, marginRight: 10}}>
          {option.label}
        </Text>
        <Switch
          disabled={option.disabled}
          value={option.value}
          onValueChange={option.onChange}
        />
      </View>
    case 'slider':
      return <View
        style={{padding: 10, alignItems: 'center'}}
      >
        <Text style={{fontSize: 20, flex: 1, marginRight: 10}}>
          {option.label}: <Text>{option.value}</Text>
        </Text>
        <Slider
          step={option.step}
          minimumValue={option.minimumValue}
          maximumValue={option.maximumValue}
          value={option.value}
          onValueChange={option.onChange}
        />
      </View>
    case 'options':
      return <View
        style={{padding: 10, alignItems: 'center'}}
      >
        <Text style={{fontSize: 20, flex: 1, marginRight: 10}}>
          {option.label}: <Text>{option.value}</Text>
        </Text>
        <SegmentedControlIOS
          values={option.values}
          selectedIndex={option.values.indexOf(option.value)}
          style={{marginHorizontal: 10, marginVertical: 10}}
          onChange={({nativeEvent: {selectedSegmentIndex: i}}) => option.onChange(option.values[i])}
        />
      </View>
  }
}

const OptionsPicker = ({options, onStart}: {options: OptionT[], onStart: () => void}) => (
  <View style={{ flex: 1, }}>
    <ScrollView
      style={{flex: 1}}
    >
      {options.map(option => <Option option={option} />)}
    </ScrollView>
    <TouchableOpacity onPress={onStart}>
      <Text>
        Start!
      </Text>
    </TouchableOpacity>
  </View>
)

export default OptionsPicker