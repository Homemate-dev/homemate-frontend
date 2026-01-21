import { useRef } from 'react'
import { Animated, Easing } from 'react-native'

type ToastAnimationConfig = {
  inTranslateFrom?: number
  inDuration?: number
  outDuration?: number
}

export function useToastAnimation(config?: ToastAnimationConfig) {
  const { inTranslateFrom = 80, inDuration = 220, outDuration = 180 } = config ?? {}

  const translateY = useRef(new Animated.Value(inTranslateFrom)).current
  const opacity = useRef(new Animated.Value(0)).current

  const animateIn = () => {
    translateY.stopAnimation()
    opacity.stopAnimation()

    translateY.setValue(inTranslateFrom)
    opacity.setValue(0)

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: inDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: inDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start()
  }

  // 퇴장: 투명도만
  const animateOut = (onEnd?: () => void) => {
    opacity.stopAnimation()

    Animated.timing(opacity, {
      toValue: 0,
      duration: outDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      onEnd?.()
    })
  }

  return {
    opacity,
    translateY,
    animateIn,
    animateOut,
  }
}
