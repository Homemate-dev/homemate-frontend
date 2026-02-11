import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { useToastAnimation } from '@/libs/hooks/useToastAnimation'

type SimpleToastOptions = {
  message?: string
  messageNode?: React.ReactNode
  duration?: number // ms (default 1800)
  actionText?: string
  onActionPress?: () => void
}

type SimpleToastContextType = {
  show: (options: SimpleToastOptions) => void
  hide: () => void
}

const DEFAULT_DURATION = 2500
const ACTION_TOAST_DURATION = 4500
const SimpleToastContext = createContext<SimpleToastContextType | null>(null)

export function useSimpleToast() {
  const ctx = useContext(SimpleToastContext)
  if (!ctx) throw new Error('SimpleToastProvider로 감싸야 합니다.')
  return ctx
}

export function SimpleToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<SimpleToastOptions | null>(null)

  const hasAction = !!toast?.actionText

  const { opacity, translateY, animateIn, animateOut } = useToastAnimation({
    inTranslateFrom: 80,
    inDuration: 220,
    outDuration: 180,
  })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  const hide = () => {
    clearTimer()
    animateOut(() => {
      setToast(null) // 애니메이션 끝나면 언마운트
    })
  }

  const show = (options: SimpleToastOptions) => {
    clearTimer()
    setToast(options)

    // state set 이후 프레임에서 실행되도록 보장(렌더 타이밍 안정화)
    requestAnimationFrame(() => {
      animateIn()
    })

    const duration =
      typeof options.duration === 'number'
        ? options.duration
        : options.actionText
          ? ACTION_TOAST_DURATION
          : DEFAULT_DURATION

    timer.current = setTimeout(() => {
      animateOut(() => {
        timer.current = null
        setToast(null)
      })
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
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
          <Pressable style={styles.toast} onPress={hide}>
            <View style={styles.message}>
              <Image
                source={require('../assets/images/alert-circle.svg')}
                resizeMode="contain"
                style={{ width: 18, height: 18, marginRight: 6 }}
              />
              <Text style={[styles.text, hasAction ? styles.textWithAction : styles.textDefault]}>
                {toast.messageNode ?? toast.message}
              </Text>
            </View>

            {!!toast.actionText && (
              <Pressable
                hitSlop={8}
                onPress={() => {
                  toast.onActionPress?.()
                  hide()
                }}
              >
                <Text style={styles.actionText}>{toast.actionText}</Text>
              </Pressable>
            )}
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
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.09,
    shadowRadius: 8.3,
    elevation: 2,
  },
  message: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 400,
  },

  textDefault: {
    color: '#57C9D0',
  },

  textWithAction: {
    color: '#81878F',
  },

  actionText: {
    color: '#57C9D0',
    fontSize: 12,
    fontWeight: 400,
  },
})
