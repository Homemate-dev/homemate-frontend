import { router } from 'expo-router'
import { useMemo } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'

import { useChoreNotifications } from '@/libs/hooks/notification/useChoreNotifications'
import { useNoticeNotifications } from '@/libs/hooks/notification/useNoticeNotifications'

export default function NotificationBell() {
  // 각 알림 목록 가져오기
  const { data: choreData = [] } = useChoreNotifications()
  const { data: noticeData = [] } = useNoticeNotifications()

  // 읽지 않은 알림 존재 여부
  const hasUnread = useMemo(() => {
    const choreUnread = choreData.some((n: any) => !n.isRead)
    const noticeUnread = noticeData.some((n: any) => !n.isRead)
    return choreUnread || noticeUnread
  }, [choreData, noticeData])

  return (
    <Pressable onPress={() => router.push('/notifications')} style={styles.wrap} hitSlop={8}>
      <Image
        source={require('@/assets/images/notification.png')}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />
      {hasUnread && <View style={styles.dot} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute',
    top: 1,
    right: 3,
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#57C9D0',
  },
})
