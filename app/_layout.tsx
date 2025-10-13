import { PoetsenOne_400Regular, useFonts } from '@expo-google-fonts/poetsen-one'
import { Href, router, Stack } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { setAccessToken, setOnUnauthorized } from '@/libs/api/axios'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoetsenOne_400Regular,
  })

  useEffect(() => {
    // 토큰 만료 시 토큰 제거 + 로그인 화면 이동
    setAccessToken(null)
    setOnUnauthorized(() => {
      router.replace('/onboarding' as Href)
    })
  }, [])

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom']} className="flex-1 bg-[#F8F8FA]">

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="start" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
