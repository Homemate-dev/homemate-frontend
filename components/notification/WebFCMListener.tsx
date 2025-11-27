// app/components/WebFCMListener.tsx
import { useQueryClient } from '@tanstack/react-query'
import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { firebaseApp } from '@/libs/firebase/init'

export default function WebFCMListener() {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (Platform.OS !== 'web') return

    try {
      const messaging = getMessaging(firebaseApp)

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('[WEB FCM] Foreground message received:', payload)

        queryClient.invalidateQueries({ queryKey: ['notifications', 'chore'] })
        queryClient.invalidateQueries({ queryKey: ['notifications', 'notice'] })
      })

      return () => unsubscribe()
    } catch (e) {
      console.log('[WEB FCM] onMessage 등록 실패:', e)
    }
  }, [queryClient])

  return null
}
