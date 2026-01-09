// libs/auth/cleanupSession.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { Platform } from 'react-native'

import { setAccessToken } from '@/libs/api/axios'

export async function cleanupSession(qc: QueryClient) {
  setAccessToken(null)

  if (Platform.OS !== 'web') {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken'])
  }

  qc.clear()
}
