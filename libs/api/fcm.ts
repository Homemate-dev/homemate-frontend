import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

import { api } from '@/libs/api/axios'

export const registerFCMToken = async () => {
  try {
    if (!Device.isDevice) {
      console.log('푸시 알림은 실제 기기에서만 지원됩니다.')
      return
    }

    // 알림 권한 확인 및 요청
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      return
    }

    // Expo Push Token 발급
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'abcd1234-5678-90ef-ghij-klmnopqrstuv',
    })

    const token = tokenData.data

    // 서버에 푸시 토큰 등록
    await api.post('/push/subscriptions', { token })
  } catch (error) {
    console.error(' 푸시 토큰 등록 실패:', error)
  }
}

// 푸시 토큰 해제
export const unregisterFCMToken = async () => {
  try {
    await api.delete('/push/subscriptions')
  } catch (error) {
    console.error('푸시 토큰 해제 실패:', error)
  }
}
