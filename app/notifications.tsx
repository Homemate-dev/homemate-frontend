import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Notification = {
  id: number
  title: string
  message: string
  time: string
  read?: boolean
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'chore' | 'notice'>('chore')

  // ✅ 집안일 알림
  const [choreNotifications, setChoreNotifications] = useState<Notification[]>([
    // { id: 1, title: '집안일', message: '청소기를 돌릴 시간이에요', time: '10분 전', read: false },
    // { id: 2, title: '집안일', message: '화분에 물 주기', time: '1시간 전', read: true },
  ])

  // ✅ 공지 알림
  const [noticeNotifications, setNoticeNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: '공지',
      message: '앱 업데이트 공지가 있습니다.',
      time: '2시간 전',
      read: false,
    },
    { id: 2, title: '공지', message: '10월 25일(금) 서버 점검 예정', time: '1일 전', read: true },
  ])

  // ✅ 탭별 데이터
  const notifications = activeTab === 'chore' ? choreNotifications : noticeNotifications
  const setNotifications = activeTab === 'chore' ? setChoreNotifications : setNoticeNotifications
  const unreadCount = notifications.filter((n) => !n.read).length
  const hasData = notifications.length > 0

  // ✅ 클릭 시 읽음 처리
  const handlePressNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    )
  }

  // ✅ RN Web 전용 overflow patch (개발용)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style')
      style.innerHTML = `
        .css-view-g5y9jx, [class*="r-overflow"] {
          overflow: visible !important;
          position: static !important;
        }
      `
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  // ✅ 알림 카드 렌더
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
      <Text style={styles.header}>알림</Text>

      {/* ✅ 탭 버튼 */}
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

      {/* ✅ 본문 */}
      <View style={styles.contentArea}>
        {hasData ? (
          <>
            <Text style={styles.unreadText}>
              읽지 않은 알림 <Text style={styles.unreadNumber}>{unreadCount}</Text>
            </Text>

            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              style={{
                overflow: 'visible',
                position: Platform.OS === 'web' ? 'static' : 'relative',
              }}
              contentContainerStyle={{
                paddingBottom: 20,
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
  /** 전체 컨테이너 */
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /** 헤더 */
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },

  /** 탭 버튼 */
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
    backgroundColor: '#E2F9FA', // 밝은 하늘색
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
    color: '#00ADB5', // 민트색 포인트
  },
  tabTextInactive: {
    color: '#999999',
  },

  /** 본문 */
  contentArea: {
    flex: 1,
    overflow: 'visible',
    position: Platform.OS === 'web' ? 'static' : 'relative',
  },

  /** 읽지 않은 알림 */
  unreadText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 10,
  },
  unreadNumber: {
    fontWeight: '600',
    color: '#00ADB5',
  },

  /** 알림 카드 */
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

  /** 빈 상태 */
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 15,
    marginTop: 8,
  },
})
