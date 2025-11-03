import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
          <MaterialIcons name="chevron-left" size={28} color="#686F79" />
        </TouchableOpacity>
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
            <Ionicons name="alert-circle-outline" size={50} color="#CCCCCC" />
            <Text style={styles.emptyText}>아직 알림이 없어요</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 24 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  header: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerBack: { position: 'absolute', left: 0 },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.2,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: '#E2F9FA', borderColor: '#57D0D7' },
  tabInactive: { backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' },
  tabText: { fontSize: 15, fontWeight: '600' },
  tabTextActive: { color: '#00ADB5' },
  tabTextInactive: { color: '#999999' },
  contentArea: { flex: 1 },
  unreadText: { fontSize: 13, color: '#666666', marginBottom: 10 },
  unreadNumber: { fontWeight: '600', color: '#00ADB5' },
  card: {
    backgroundColor: '#F8FEFF',
    borderWidth: 1,
    borderColor: '#BCEAEC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cardRead: { backgroundColor: '#F3F3F3', borderColor: '#E0E0E0' },
  cardTitle: { fontWeight: '700', fontSize: 15, color: '#1A1A1A', marginBottom: 4 },
  cardMessage: { fontSize: 14, color: '#555555' },
  cardTime: { fontSize: 12, color: '#999999', textAlign: 'right', marginTop: 6 },
  emptyWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAAAAA', fontSize: 15, marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
