import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'

const queryClient = new QueryClient()

function RootNavigator() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57C9D0" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? <Stack.Screen name="/index" /> : <Stack.Screen name="/login" />}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8FA' }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaView>
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
