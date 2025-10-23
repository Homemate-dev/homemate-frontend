import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'

export default function Index() {
  const router = useRouter()
  const { token, loading } = useAuth()

  // ✅ 모든 훅은 return 전에 호출해야 함
  useEffect(() => {
    if (!loading) {
      if (token) {
        router.replace('/(tabs)/index') // ✅ 정확한 경로로 수정
      } else {
        router.replace('/onboarding')
      }
    }
  }, [loading, token, router]) // ✅ router 추가

  // ✅ 로딩 중 표시
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#57C9D0" />
      </View>
    )
  }

  // ✅ 로딩 이후엔 useEffect에서 이동하므로 빈 화면만
  return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
}
