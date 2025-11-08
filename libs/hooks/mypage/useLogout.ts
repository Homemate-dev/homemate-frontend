// libs/hooks/auth/useLogout.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

import { postLogout } from '@/libs/api/mypage/postLogout'

export function useLogout() {
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: postLogout,
    onSuccess: async () => {
      // 캐시/토큰 정리
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken'])
      qc.clear() // 모든 React Query 캐시 삭제

      // 로그인 화면으로 이동
      router.replace('/(auth)')
    },
    onError: () => {
      alert('로그아웃 중 오류가 발생했습니다.')
    },
  })
}
