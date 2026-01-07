import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Platform } from 'react-native'

import { setAccessToken } from '@/libs/api/axios'
import { postLogout } from '@/libs/api/mypage/postLogout'

export function useLogout() {
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: postLogout,

    onMutate: async () => {
      // 로그아웃 누르는 순간부터 네트워크/쿼리 멈추기
      await qc.cancelQueries()
    },

    onSettled: async () => {
      // 1) 토큰 먼저 끊기
      setAccessToken(null)

      // 2) 저장소 정리
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('refreshToken')
        window.localStorage.removeItem('user')
      } else {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user'])
      }

      // 3) 캐시 정리
      qc.clear()

      // 4) 이동
      router.replace('/(auth)')
    },
  })
}
