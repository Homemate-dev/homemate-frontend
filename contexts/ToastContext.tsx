import { MaterialIcons } from '@expo/vector-icons'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native'

type ToastOptions = {
  message: string
  duration?: number // ms (기본 2500ms)
  onPress?: () => void
}

type ToastContextType = {
  show: (options: ToastOptions) => void
  hide: () => void
}

const DEFAULT_DURATION = 2500
const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('ToastProvider로 감싸야 합니다.')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null)
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

  const show = (options: ToastOptions) => {
    // 기존 타이머/애니메이션 정리
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

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return clearTimer
  }, [])

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}

      {toast && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable
            style={styles.toast}
            onPress={() => {
              toast.onPress?.()
              hide() // 눌러도 사라지게
            }}
          >
            <View style={styles.message}>
              <Image
                source={require('../assets/images/alert-circle.png')}
                resizeMode="contain"
                style={{ width: 18, height: 18, marginRight: 6 }}
              />
              <Text style={styles.msgTitle}>{toast.message}</Text>가 추가되었어요
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#57C9D0" />
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
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
    fontFamily: 'Pretendard',
    fontSize: 14,
    color: '#7E7E7E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgTitle: {
    fontFamily: 'Pretendard',
    fontWeight: 700,
    fontSize: 14,
    color: '#57C9D0',
  },
})
