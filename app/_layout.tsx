// app/_layout.tsx

import '@/libs/firebase/init'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'

import AchievementModal from '@/components/AchievementModal'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { registerFCMToken } from '@/libs/api/fcm'
import { store } from '@/store'

const queryClient = new QueryClient()

function RootNavigator() {
  const { token, user, loading, verified } = useAuth()

  // 폰트
  const [loaded] = useFonts({
    SeoulNamsanEB: require('../assets/fonts/SeoulNamsanEB.ttf'),
    PretendardRegular: require('../assets/fonts/prestandard/Pretendard-Regular.ttf'),
    PretendardMedium: require('../assets/fonts/prestandard/Pretendard-Medium.ttf'),
    PretendardBold: require('../assets/fonts/prestandard/Pretendard-Bold.ttf'),
    PretendardSemiBold: require('../assets/fonts/prestandard/Pretendard-SemiBold.ttf'),
  })

  // ✅ 로그인 완료 + 토큰 준비된 뒤에만 푸시 토큰 등록
  useEffect(() => {
    console.log('[FCM] useEffect user/token/verified:', !!user, !!token, verified)
    if (!verified || !user || !token) return
    registerFCMToken(token)
  }, [user, token, verified])

  if (loading || !loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57C9D0" />
      </View>
    )
  }

  const isLoggedIn = !!token && !!user

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // ✅ 로그인 됐으면 탭/홈 쪽 그룹으로
        <Stack.Screen name="(tabs)" />
      ) : (
        // ✅ 아니면 auth 그룹으로
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: '#F8F8FA' }}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              {/* ✅ 전역 AuthProvider: 여기 딱 한 번만 */}
              <AuthProvider>
                <RootNavigator />
                <AchievementModal />
              </AuthProvider>
            </ToastProvider>
          </QueryClientProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
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
