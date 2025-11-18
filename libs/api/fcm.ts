import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { getMessaging, getToken } from 'firebase/messaging'
import { Platform } from 'react-native'

import { api } from '@/libs/api/axios'
import { NOTIFICATION_ENDPOINTS } from '@/libs/api/endpoints'
import { firebaseApp } from '@/libs/firebase/init'

export const registerFCMToken = async (accessToken: string) => {
  console.log('[FCM] registerFCMToken 호출됨')

  // 로그인(액세스 토큰) 안 되어 있으면 아예 호출 안 함 → 401 예방
  console.log('[FCM] 현재 accessToken 존재?', !!accessToken)

  if (!accessToken) {
    console.log('🔒 accessToken 없음: 로그인 전이라 푸시 토큰 등록 스킵')
    return
  }

  try {
    /** ─────────────────────────────────────────────
     * 🌐 WEB: Firebase Messaging + VAPID (iOS Safari PWA 포함)
     * ───────────────────────────────────────────── */
    if (Platform.OS === 'web') {
      const messaging = getMessaging(firebaseApp)

      // 브라우저 알림 권한 요청 (안 했으면)
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          console.log('웹 푸시 권한 거부됨')
          return
        }
      } else if (Notification.permission !== 'granted') {
        console.log('웹 푸시 권한 거부됨')
        return
      }

      const token = await getToken(messaging, {
        // FCM Web Push용 VAPID 키 (expo config에 넣은 거와 동일)
        vapidKey:
          'BLa4XgiuPsT4-9NPqs8xbdlYnUuRP_p2K9NqHTc0ofaxEBhfw5icOclS-vOso2v9aZR8RNkR9gs2GdUryxzx3eo',
      })

      if (!token) {
        console.log('웹 FCM 토큰 발급 실패 (빈 토큰)')
        return
      }

      await api.post(NOTIFICATION_ENDPOINTS.ENABLE_PUSH, { token })
      console.log('✅ 웹 푸시 토큰 등록 성공')
      return
    }

    /** ─────────────────────────────────────────────
     * 📱 APP (iOS / Android): Expo Notifications
     * ───────────────────────────────────────────── */
    if (!Device.isDevice) {
      console.log('푸시 알림은 실제 기기에서만 지원됩니다.')
      return
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.log('푸시 알림 권한 거부됨')
      return
    }

    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
      projectId: 'abcd1234-5678-90ef-ghij-klmnopqrstuv', // 네 Expo projectId
    })

    if (!expoPushToken) {
      console.log('앱 푸시 토큰 발급 실패')
      return
    }

    await api.post(NOTIFICATION_ENDPOINTS.ENABLE_PUSH, { token: expoPushToken })
    console.log('✅ 앱 푸시 토큰 등록 성공:', expoPushToken)
  } catch (error) {
    console.error('❌ 푸시 토큰 등록 실패:', error)
  }
}

export const unregisterFCMToken = async () => {
  try {
    await api.delete(NOTIFICATION_ENDPOINTS.DISABLE_PUSH)
  } catch (error) {
    console.error('푸시 토큰 해제 실패:', error)
  }
}
