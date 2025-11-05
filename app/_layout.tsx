import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { registerFCMToken } from '@/libs/api/fcm'

const queryClient = new QueryClient()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

function RootNavigator() {
  const { token, user, loading } = useAuth()

  // 폰트 로드
  const [loaded] = useFonts({
    SeoulNamsanEB: require('../assets/fonts/SeoulNamsanEB.ttf'),
    PretendardRegular: require('../assets/fonts/prestandard/Pretendard-Regular.ttf'),
    PretendardMedium: require('../assets/fonts/prestandard/Pretendard-Medium.ttf'),
    PretendardBold: require('../assets/fonts/prestandard/Pretendard-Bold.ttf'),
    PretendardSemiBold: require('../assets/fonts/prestandard/Pretendard-SemiBold.ttf'),
  })

  useEffect(() => {
    registerFCMToken()
  }, [])

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
      {isLoggedIn ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: '#F8F8FA' }}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </ToastProvider>
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
