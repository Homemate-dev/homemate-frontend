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

  const deviceType: 'WEB' | 'ANDROID' | 'IOS' =
    Platform.OS === 'web' ? 'WEB' : Platform.OS === 'ios' ? 'IOS' : 'ANDROID'

  try {
    /** ─────────────────────────────────────────────
     *  🌐 WEB: Firebase Messaging + VAPID
     *   - iOS Safari(웹)는 자동 권한 요청 X → 버튼에서만
     *   - 그 외(크롬/안드/데스크탑)는 자동 권한 요청
     * ───────────────────────────────────────────── */
    if (Platform.OS === 'web') {
      const messaging = getMessaging(firebaseApp)

      const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
      const isIosWeb = /iPhone|iPad|iPod/i.test(ua)

      console.log('[FCM][WEB] userAgent:', ua)
      console.log('[FCM][WEB] isIosWeb?', isIosWeb)
      console.log('[FCM][WEB] 현재 permission:', Notification.permission)

      // 🔹 iOS Safari / iOS PWA 분기
      if (isIosWeb) {
        // iOS Safari(PWA) → 자동 requestPermission() 호출 금지
        if (Notification.permission !== 'granted') {
          console.log(
            '[FCM][WEB][iOS] permission이 granted가 아님 → 버튼에서 requestPermission() 호출 필요'
          )
          return
        }

        // 2) 토큰 발급
        const token = await getToken(messaging, {
          vapidKey:
            'BLa4XgiuPsT4-9NPqs8xbdlYnUuRP_p2K9NqHTc0ofaxEBhfw5icOclS-vOso2v9aZR8RNkR9gs2GdUryxzx3eo',
        })

        if (!token) {
          console.log('[FCM][WEB][iOS] FCM 토큰 발급 실패 (빈 토큰)')
          return
        }

        // 3) 서버 등록
        try {
          await api.post(NOTIFICATION_ENDPOINTS.ENABLE_PUSH, { token, deviceType })
          console.log('✅ [FCM][WEB][iOS] 웹 푸시 토큰 등록 성공')
        } catch (err) {
          console.error('❌ [FCM][WEB][iOS] 서버 등록 실패:', err)
        }

        return
      }

      // 🔹 iOS 웹이 아닌 일반 웹(크롬/안드/데스크탑 등) → 자동 권한 요청 허용
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        console.log('[FCM][WEB] requestPermission 결과:', permission)

        if (permission !== 'granted') {
          console.log('[FCM][WEB] 웹 푸시 권한 거부됨')
          return
        }
      } else if (Notification.permission !== 'granted') {
        console.log('[FCM][WEB] 웹 푸시 권한 상태가 granted 아님:', Notification.permission)
        return
      }

      const token = await getToken(messaging, {
        // FCM Web Push용 VAPID 키
        vapidKey:
          'BLa4XgiuPsT4-9NPqs8xbdlYnUuRP_p2K9NqHTc0ofaxEBhfw5icOclS-vOso2v9aZR8RNkR9gs2GdUryxzx3eo',
      })

      if (!token) {
        console.log('웹 FCM 토큰 발급 실패 (빈 토큰)')
        return
      }

      await api.post(NOTIFICATION_ENDPOINTS.ENABLE_PUSH, { token, deviceType })
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

    await api.post(NOTIFICATION_ENDPOINTS.ENABLE_PUSH, { token: expoPushToken, deviceType })
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
