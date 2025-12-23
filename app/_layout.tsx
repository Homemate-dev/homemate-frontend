// app/_layout.tsx

import '@/libs/firebase/init'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { Stack, useRouter, useSegments } from 'expo-router'
import Head from 'expo-router/head'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'

import AchievementModal from '@/components/AchievementModal'
import WebFCMListener from '@/components/notification/WebFCMListener'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { registerFCMToken } from '@/libs/firebase/fcm'
import { store } from '@/store'

const queryClient = new QueryClient()

function RootNavigator() {
  const { token, user, loading, verified } = useAuth()

  const router = useRouter()
  const segments = useSegments()

  const [loaded] = useFonts({
    SeoulNamsanEB: require('../assets/fonts/SeoulNamsanEB.ttf'),
    PretendardRegular: require('../assets/fonts/prestandard/Pretendard-Regular.ttf'),
    PretendardMedium: require('../assets/fonts/prestandard/Pretendard-Medium.ttf'),
    PretendardBold: require('../assets/fonts/prestandard/Pretendard-Bold.ttf'),
    PretendardSemiBold: require('../assets/fonts/prestandard/Pretendard-SemiBold.ttf'),
  })

  // 웹에서 code 처리 완료 여부
  const [isCodeHandled, setIsCodeHandled] = useState(Platform.OS !== 'web')

  /** 웹: /?code=... 로 들어오면 먼저 /login?code=... 로 리다이렉트
   *  - 이 동안에는 스택 렌더 X (로딩만)
   *  - /login 으로 이미 온 상태면 여기서는 건드리지 않음 (Login.tsx가 처리)
   */
  useEffect(() => {
    if (Platform.OS !== 'web') return

    const currentUrl = new URL(window.location.href)
    const parsed = Linking.parse(currentUrl.toString())
    const raw = parsed.queryParams?.code
    const code = Array.isArray(raw) ? raw[0] : raw

    // code 없으면 처리 완료
    if (!code) {
      setIsCodeHandled(true)
      return
    }

    // 이미 /login 에서 code 들고 있으면 여기서 할 일 없음 → Login.tsx가 fetchKakaoToken 실행
    if (currentUrl.pathname === '/login') {
      setIsCodeHandled(true)
      return
    }

    // /login 이 아니면 /login?code=... 로 한번에 이동
    currentUrl.pathname = '/login'
    currentUrl.searchParams.set('code', code)
    window.location.replace(currentUrl.toString())
    // 여기서는 setIsCodeHandled 안 해도 됨 (페이지 리로드 되니까)
  }, [])

  /** 로그인 완료 + 토큰 준비된 뒤에만 푸시 토큰 등록 */
  useEffect(() => {
    console.log('[FCM] useEffect user/token/verified:', !!user, !!token, verified)
    if (!verified || !user || !token) return
    registerFCMToken(token)
  }, [user, token, verified])

  /** 라우트 가드: 준비 끝나면 auth/tabs 강제 이동 */
  useEffect(() => {
    if (loading || !loaded || !isCodeHandled) return

    const seg0 = segments[0] // "(auth)" | "(tabs)" | undefined
    const isAuthed = verified && !!token

    const protectedGroups = ['(tabs)', '(modals)'] as const
    const isInProtected = protectedGroups.includes(seg0 as any)

    if (isAuthed) {
      if (seg0 === '(auth)' || !seg0) router.replace('/(tabs)/home')
      return
    }

    if (seg0 !== '(auth)') router.replace('/(auth)')
  }, [loading, loaded, isCodeHandled, verified, token, segments, router])

  // 아직 준비 안됐으면(폰트 로딩, auth 로딩, code 처리 전) → 스택 렌더하지 말고 로딩만
  if (!loaded || loading || !isCodeHandled) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57C9D0" />
      </View>
    )
  }

  const isLoggedIn = verified && !!user

  return (
    <Stack key={isLoggedIn ? 'app' : 'auth'} screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <>
      {/* 웹에서 탭 타이틀 설정 */}
      {Platform.OS === 'web' && (
        <Head>
          <title>Homemate</title>
        </Head>
      )}

      <Provider store={store}>
        <SafeAreaProvider>
          <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: '#F8F8FA' }}>
            <QueryClientProvider client={queryClient}>
              <WebFCMListener />
              <ToastProvider>
                <AuthProvider>
                  <RootNavigator />
                  <AchievementModal />
                </AuthProvider>
              </ToastProvider>
            </QueryClientProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    </>
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
