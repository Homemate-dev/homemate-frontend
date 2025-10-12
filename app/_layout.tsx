import { PoetsenOne_400Regular, useFonts } from '@expo-google-fonts/poetsen-one'
import { Stack } from 'expo-router'
import 'react-native-reanimated'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoetsenOne_400Regular,
  })

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
