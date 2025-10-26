import 'react-native-reanimated'

import { QueryClientProvider } from '@tanstack/react-query'
import { Href, router, Stack } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider as ReduxProvider } from 'react-redux'

import { setAccessToken, setOnUnauthorized } from '@/libs/api/axios'
import { queryClient } from '@/libs/queryClient'
import { store } from '@/store'

export default function RootLayout() {
  useEffect(() => {
    // 토큰 만료 시 토큰 제거 + 로그인 화면 이동
    setAccessToken(null)
    setOnUnauthorized(() => {
      router.replace('/onboarding' as Href)
    })
  }, [])

  // if (!fontsLoaded) return null

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView edges={['bottom']} className="flex-1 bg-[#F8F8FA]">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(modals)" options={{ headerShown: false }} />
            </Stack>
            {/* <AchievementModal /> */}
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
