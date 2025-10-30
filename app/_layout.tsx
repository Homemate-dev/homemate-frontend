import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'


import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider as ReduxProvider } from 'react-redux'

import { setAccessToken, setOnUnauthorized } from '@/libs/api/axios'
import { queryClient } from '@/libs/queryClient'
import { store } from '@/store'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { setAccessToken } from '@/libs/api/axios'

const queryClient = new QueryClient()

function RootNavigator() {
  const { token, loading } = useAuth()


  // 개발 모드에서 임시 토큰 발급/사용
  const [devToken, setDevToken] = useState<string | null>(null)
  const [booting, setBooting] = useState(__DEV__)

  // .env.development 값
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') // 끝 슬래시 제거
  const DEV_USER_ID = process.env.EXPO_PUBLIC_DEV_USER_ID ?? '1'

  useEffect(() => {
    const fetchDevToken = async () => {
      if (!__DEV__) return setBooting(false)
      if (!BASE_URL) {
        console.warn('[DEV TOKEN WARN] BASE_URL 누락 (.env.development 확인)')
        return setBooting(false)
      }

      const getUrl = `${BASE_URL}/auth/dev/token/${DEV_USER_ID}`
      const postUrlPath = `${BASE_URL}/auth/dev/token/${DEV_USER_ID}`
      const postUrlBody = `${BASE_URL}/auth/dev/token`

      try {
        let data: any

        // 1) GET 시도
        try {
          console.log('[DEV TOKEN REQ:GET]', getUrl)
          const res = await axios.get(getUrl)
          data = res.data
        } catch (e: any) {
          console.warn('[DEV TOKEN GET FAIL]', e?.response?.status)

          // 2-a) POST (path param)
          try {
            console.log('[DEV TOKEN REQ:POST path]', postUrlPath)
            const res = await axios.post(postUrlPath)
            data = res.data
          } catch (e2: any) {
            console.warn('[DEV TOKEN POST path FAIL]', e2?.response?.status)

            // 2-b) POST (JSON body)
            console.log('[DEV TOKEN REQ:POST body]', postUrlBody)
            const res3 = await axios.post(postUrlBody, { userId: DEV_USER_ID })
            data = res3.data
          }
        }

        const t =
          (data && (data.accessToken || data.token || data.jwt || data.result)) ||
          (typeof data === 'string' ? data : null)

        if (typeof t === 'string' && t.length > 10) {
          setDevToken(t)
          setAccessToken(t) // axios 인터셉터에 주입 → 이후 모든 API Authorization 자동 첨부
          await AsyncStorage.setItem('accessToken', t) // 선택: 컨텍스트가 스토리지 읽는 경우 대비
          console.log('[DEV TOKEN OK]', t.slice(0, 16) + '...')
        } else {
          console.warn('[DEV TOKEN WARN] 예상치 못한 응답:', data)
        }
      } catch (err: any) {
        console.error('[DEV TOKEN ERROR]', err?.message || err)
      } finally {
        setBooting(false)
      }
    }

    fetchDevToken()
  }, [BASE_URL, DEV_USER_ID])

  // 컨텍스트 초기 로딩 or dev 토큰 발급 대기
  if (loading || booting) {

 
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57C9D0" />
      </View>
    )
  }

  // 1) 빈 문자열/스페이스 토큰을 null로 정규화
  const normalizedToken = typeof token === 'string' && token.trim().length > 0 ? token : null

  // 2) 개발 모드에서는 devToken을 최우선 사용
  const effectiveToken =
    __DEV__ && typeof devToken === 'string' && devToken.length > 0 ? devToken : normalizedToken

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {effectiveToken ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: '#F8F8FA' }}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
})
