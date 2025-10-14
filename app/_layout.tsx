import { Stack } from 'expo-router'
import 'react-native-reanimated'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function RootLayout() {
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
