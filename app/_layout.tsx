import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'

const queryClient = new QueryClient()

function RootNavigator() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#57C9D0" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(modals)" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
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
