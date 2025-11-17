import { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'

type ToggleProps = {
  value: boolean
  onChange: (next: boolean) => void
}

export default function Toggle({ value, onChange }: ToggleProps) {
  const translateX = useRef(new Animated.Value(value ? 18 : 0)).current

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 18 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [value, translateX])

  return (
    <Pressable onPress={() => onChange(!value)}>
      <View style={[styles.container, { backgroundColor: value ? '#57C9D0' : '#E6E7E9' }]}>
        <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 24, // 6 * 4
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  circle: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
  },
})
