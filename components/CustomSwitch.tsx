import React from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

interface Props {
  value: boolean
  onValueChange: (val: boolean) => void
}

export default function CustomSwitch({ value, onValueChange }: Props) {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0, // thumb 이동 거리
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [value])

  return (
    <TouchableWithoutFeedback onPress={() => onValueChange(!value)}>
      <View style={[styles.track, value && styles.trackActive]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  track: {
    width: 45,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    padding: 2,
  },
  trackActive: {
    backgroundColor: '#57C9D0',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
})
