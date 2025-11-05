import { MaterialIcons } from '@expo/vector-icons'
import React, { createContext, useContext, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'

type ToastOptions = {
  message: string
  duration?: number // default: 2500ms
  onPress?: () => void
}

type ToastContextType = {
  show: (options: ToastOptions) => void
  hide: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('ToastProvider로 감싸야 합니다.')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null)
  const translateY = useRef(new Animated.Value(80)).current
  const timer = useRef<any>(null)

  const hide = () => {
    Animated.timing(translateY, {
      toValue: 80,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => setToast(null))
  }

  const show = (options: ToastOptions) => {
    // 기존 토스트 종료
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setToast(options)

    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start()

    timer.current = setTimeout(hide, options.duration ?? 2500)
  }

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}

      {/* 하단 토스트 배너 */}
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
              hide()
            }}
          >
            <View style={styles.dot} />
            <Text style={styles.message} numberOfLines={1}>
              <Text style={styles.msgTitle}>{toast.message}</Text>가 추가되었어요
            </Text>
            <MaterialIcons name="chevron-left" size={28} color="#686F79" />
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 44,
    height: 41,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#57C9D0',
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontFamily: 'PretendardRegular',
    fontSize: 14,
    color: '#7E7E7E',
  },

  msgTitle: {
    fontFamily: 'PretendardBold',
    fontSize: 14,
    color: '#57C9D0',
  },
  action: {
    fontFamily: 'PretendardBold',
    fontSize: 15,
    color: '#21AEB6',
  },
})
