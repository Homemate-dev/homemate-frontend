import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { api, setAccessToken } from '@/libs/api/axios'
import { fetchNotifications, patchReadNotification } from '@/libs/api/notification'

type Notification = {
  id: number
  title: string
  message: string
  time: string
  read?: boolean
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'chore' | 'notice'>('chore')
  const [choreNotifications, setChoreNotifications] = useState<Notification[]>([])
  const [noticeNotifications, setNoticeNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const notifications = activeTab === 'chore' ? choreNotifications : noticeNotifications
  const setNotifications = activeTab === 'chore' ? setChoreNotifications : setNoticeNotifications
  const visibleNotifications = notifications.slice(0, 30)
  const unreadCount = notifications.filter((n) => !n.read).length
  const hasData = visibleNotifications.length > 0

  // 시간 포맷
  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = (now.getTime() - date.getTime()) / 1000
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`
    if (diff < 2419200) return `${Math.floor(diff / 604800)}주 전`
    return date.toLocaleDateString('ko-KR')
  }

  // 읽음 처리
  const handlePressNotification = async (id: number) => {
    try {
      await patchReadNotification(activeTab, id)
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      )
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error)
    }
  }

  // 알림 목록 조회
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        const res = await api.post('/auth/dev/token/1')
        const token = res.data.accessToken
        await setAccessToken(token)

        const data = await fetchNotifications(activeTab)
        const formatted = data.map((item: any) => ({
          id: item.id,
          title: item.title || '알림',
          message: item.message || '',
          time: formatRelativeTime(item.scheduledAt),
          read: item.isRead ?? false,
        }))

        if (activeTab === 'chore') setChoreNotifications(formatted)
        else setNoticeNotifications(formatted)
      } catch (error: any) {
        console.error('알림 조회 실패:', error.response?.data || error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [activeTab])

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handlePressNotification(item.id)}
      activeOpacity={0.8}
      style={[styles.card, item.read && styles.cardRead]}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMessage} numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={styles.cardTime}>{item.time}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>알림</Text>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chore' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('chore')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'chore' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            집안일
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'notice' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('notice')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'notice' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            공지
          </Text>
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      <View style={styles.contentArea}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#57C9D0" />
          </View>
        ) : hasData ? (
          <>
            <Text style={styles.unreadText}>
              읽지 않은 알림 <Text style={styles.unreadNumber}>{unreadCount}</Text>
            </Text>
            <FlatList
              data={visibleNotifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{
                paddingBottom: 30,
                overflow: 'visible',
              }}
            />
          </>
        ) : (
          <View style={styles.emptyWrapper}>
            <Ionicons name="alert-circle-outline" size={50} color="#CCCCCC" />
            <Text style={styles.emptyText}>아직 알림이 없어요</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.2,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#E2F9FA',
    borderColor: '#57D0D7',
  },
  tabInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#00ADB5',
  },
  tabTextInactive: {
    color: '#999999',
  },
  contentArea: {
    flex: 1,
  },
  unreadText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 10,
  },
  unreadNumber: {
    fontWeight: '600',
    color: '#00ADB5',
  },
  card: {
    backgroundColor: '#F8FEFF',
    borderWidth: 1,
    borderColor: '#BCEAEC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cardRead: {
    backgroundColor: '#F3F3F3',
    borderColor: '#E0E0E0',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 14,
    color: '#555555',
  },
  cardTime: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 6,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 15,
    marginTop: 8,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
