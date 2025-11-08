import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useChoreNotifications } from '@/libs/hooks/notification/useChoreNotifications'
import { usePatchChoreReadNotification } from '@/libs/hooks/notification/useChoreReadNotification'
import { useNoticeNotifications } from '@/libs/hooks/notification/useNoticeNotifications'

// 화면 렌더 전용 타입
type UiNotification = {
  id: number
  title: string
  message: string
  time: string
  isRead: boolean
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'chore' | 'notice'>('chore')

  // 상대 시간 포맷
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return ''
    // 혹시 YYYY-MM-DD:HH:mm:ssZ 같이 들어오면 T로 교정
    const date = new Date(dateString.replace(/^(\d{4}-\d{2}-\d{2}):/, '$1T'))
    const now = new Date()
    const diff = (now.getTime() - date.getTime()) / 1000
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`
    if (diff < 2419200) return `${Math.floor(diff / 604800)}주 전`
    return date.toLocaleDateString('ko-KR')
  }

  // 탭별 목록 훅 (활성 탭 기준으로 isLoading만 사용)
  const { data: choreData = [], isLoading: isChoreLoading } = useChoreNotifications()

  const { data: noticeData = [], isLoading: isNoticeLoading } = useNoticeNotifications()

  const choreUnread = useMemo(() => choreData.filter((n: any) => !n.isREad).length, [choreData])
  const noticeUnread = useMemo(() => noticeData.filter((n: any) => !n.isREad).length, [noticeData])

  const raw = activeTab === 'chore' ? choreData : noticeData
  const isLoading = activeTab === 'chore' ? isChoreLoading : isNoticeLoading

  // API → UI 매핑
  const notifications: UiNotification[] = useMemo(
    () =>
      raw.map((item: any) => ({
        id: item.id,
        title: item.title || '알림',
        message: item.message || '',
        time: formatRelativeTime(item.scheduledAt ?? item.createdAt),
        isRead: !!item.isRead,
      })),
    [raw]
  )

  const visibleNotifications = notifications.slice(0, 30)
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const hasData = visibleNotifications.length > 0

  // 읽음 처리 훅
  const patchChoreRead = usePatchChoreReadNotification()
  const patchNoticeRead = usePatchChoreReadNotification()

  const handlePressNotification = (id: number) => {
    if (activeTab === 'chore') patchChoreRead.mutate(id)
    else patchNoticeRead.mutate(id)
  }

  const renderItem = ({ item }: { item: UiNotification }) => (
    <TouchableOpacity
      onPress={() => handlePressNotification(item.id)}
      activeOpacity={0.8}
      style={[styles.card, item.isRead && styles.cardRead]}
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
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Image
            source={require('@/assets/images/arrow/chevron-left.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.header}>알림</Text>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={activeTab === 'chore' ? styles.tabActive : styles.tabChoreButton}
          onPress={() => setActiveTab('chore')}
        >
          <Text style={activeTab === 'chore' ? styles.tabTextActive : styles.tabChoreText}>
            집안일
          </Text>

          {activeTab !== 'chore' && choreUnread > 0 && <View style={styles.dot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={activeTab === 'notice' ? styles.tabActive : styles.tabNoticeButton}
          onPress={() => setActiveTab('notice')}
        >
          <Text style={activeTab === 'notice' ? styles.tabTextActive : styles.tabNoticeText}>
            공지
          </Text>

          {activeTab !== 'notice' && noticeUnread > 0 && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      <View style={styles.contentArea}>
        {isLoading ? (
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
              showsVerticalScrollIndicator
              contentContainerStyle={{ paddingBottom: 30, overflow: 'visible' }}
            />
          </>
        ) : (
          <View style={styles.emptyWrapper}>
            <Image
              source={require('@/assets/images/no-alert.png')}
              style={{ width: 72, height: 72 }}
            />
            <Text style={styles.emptyText}>아직 알림이 없어요</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FA', paddingHorizontal: 20, paddingTop: 24 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  header: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerBack: { position: 'absolute', left: 0 },

  dot: {
    position: 'absolute',
    top: -4,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#57C9D0',
  },

  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tabChoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E7E9',
  },
  tabNoticeButton: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E7E9',
    height: 32,
  },
  tabActive: {
    backgroundColor: '#79D4D9',
    borderWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  tabChoreText: { fontSize: 14, color: '#9B9FA6' },
  tabNoticeText: { fontSize: 14, color: '#9B9FA6' },
  tabTextActive: { color: '#FFFFFF' },

  contentArea: { flex: 1 },
  unreadText: { fontSize: 14, color: '#686F79', marginBottom: 8 },
  unreadNumber: { fontWeight: '600', color: '#00ADB5' },

  card: {
    backgroundColor: '#F5FCFC',
    borderWidth: 1,
    borderColor: '#BCEAEC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardRead: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },

  cardTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1D2736',
    marginBottom: 4,
  },
  cardMessage: { fontSize: 14, color: '#686F79' },
  cardTime: {
    fontSize: 12,
    color: '#9B9FA6',
    textAlign: 'right',
    marginTop: 6,
  },
  emptyWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: {
    color: '#B4B7BC',

    fontSize: 16,
    marginTop: 8,
    fontWeight: 600,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
