import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native'

type SimpleToastOptions = {
  message: string
  duration?: number // ms (default 1800)
}

type SimpleToastContextType = {
  show: (options: SimpleToastOptions) => void
  hide: () => void
}

const DEFAULT_DURATION = 2500
const SimpleToastContext = createContext<SimpleToastContextType | null>(null)

export function useSimpleToast() {
  const ctx = useContext(SimpleToastContext)
  if (!ctx) throw new Error('SimpleToastProvider로 감싸야 합니다.')
  return ctx
}

export function SimpleToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<SimpleToastOptions | null>(null)
  const translateY = useRef(new Animated.Value(80)).current
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  const animateOut = (cb?: () => void) => {
    Animated.timing(translateY, {
      toValue: 80,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setToast(null)
      cb?.()
    })
  }

  const hide = () => {
    clearTimer()
    animateOut()
  }

  const show = (options: SimpleToastOptions) => {
    clearTimer()
    setToast(options)

    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start()

    const duration = typeof options.duration === 'number' ? options.duration : DEFAULT_DURATION
    timer.current = setTimeout(() => {
      animateOut(() => (timer.current = null))
    }, duration)
  }

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [])

  return (
    <SimpleToastContext.Provider value={{ show, hide }}>
      {children}

      {toast && (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <Pressable style={styles.toast} onPress={hide}>
            <View style={styles.message}>
              <Image
                source={require('../assets/images/alert-circle.png')}
                resizeMode="contain"
                style={{ width: 18, height: 18, marginRight: 6 }}
              />
              <Text style={styles.text}>{toast.message}</Text>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </SimpleToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 85,
    left: 20,
    right: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.09,
    shadowRadius: 8.3,
    elevation: 2,
    margin: 'auto' as any, // RN에는 'auto' 미지원이라 필요 없으면 제거 가능
  },
  message: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#57C9D0',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 400,
  },
})
