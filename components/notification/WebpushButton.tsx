import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { registerFCMToken } from '@/libs/api/fcm'

export default function WebPushButton() {
  const { token } = useAuth()

  // 네이티브 앱에서는 버튼 숨김
  if (Platform.OS !== 'web') return null

  const handleEnableWebPush = async () => {
    if (!token) {
      console.log('[WEB PUSH] accessToken 없음 - 로그인 필요')
      return
    }

    try {
      console.log('[WEB PUSH] 권한 요청 시작')
      const permission = await Notification.requestPermission()

      console.log('[WEB PUSH] permission 결과:', permission)

      if (permission !== 'granted') {
        console.log('[WEB PUSH] 권한이 허용되지 않음')
        return
      }

      // 이제 권한이 granted 상태이므로 토큰 등록 시도
      await registerFCMToken(token)
    } catch (e) {
      console.error('[WEB PUSH] 등록 중 에러:', e)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleEnableWebPush}>
        <Text style={styles.text}>웹 푸시 알림 켜기</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // 레이아웃은 나중에 MyPage에 맞게 조절
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
})
