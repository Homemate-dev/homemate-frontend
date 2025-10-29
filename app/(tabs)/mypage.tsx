import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import Toggle from '@/components/Toggle'
import { api, setAccessToken } from '@/libs/api/axios'
import { fetchMyPage } from '@/libs/api/user'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function MyPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const [isHouseAlarm, setIsHouseAlarm] = useState(false)
  const [isNoticeAlarm, setIsNoticeAlarm] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const issueDevTokenAndFetch = async () => {
      try {
        const res = await api.post('/auth/dev/token/1')
        const token = res.data.accessToken
        setAccessToken(token)

        const myData = await fetchMyPage()
        setUser(myData)

        setIsNotificationEnabled(myData.masterEnabled)
        setIsHouseAlarm(myData.choreEnabled)
        setIsNoticeAlarm(myData.noticeEnabled)
      } catch (error) {
        console.error('마이페이지 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    issueDevTokenAndFetch()
  }, [])

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [activeDropdown])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57C9D0" />
        <Text style={{ color: '#57C9D0', marginTop: 10 }}>불러오는 중...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>유저 정보를 불러올 수 없습니다.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>마이페이지</Text>

      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Image
          source={
            user.profileImgUrl
              ? { uri: user.profileImgUrl }
              : require('../../assets/images/icon/default_profile.png')
          }
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>{user.nickname ?? '닉네임 없음'}</Text>
        </View>
      </View>

    
      {/* 뱃지 영역 */}
      <View style={styles.badgeSection}>
        <View style={styles.badgeHeader}>
          <Text style={styles.sectionTitle}>나의 뱃지</Text>
          <View style={styles.badgeCountWrapper}>
            <Text style={styles.badgeCount}>0개</Text>
            <Text style={styles.badgeTotal}> / 0개</Text>
            <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
          </View>
        </View>
        <View style={styles.badgeBarBackground}>
          <View style={[styles.badgeBarFill, { width: '0%' }]} />
        </View>
      </View>

      {/* 알림 설정 (데이터만 반영) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <Toggle value={isNotificationEnabled} onChange={setIsNotificationEnabled} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>집안일 알림</Text>
          <Toggle value={isHouseAlarm} onChange={setIsHouseAlarm} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>공지 알림</Text>
          <Toggle value={isNoticeAlarm} onChange={setIsNoticeAlarm} />
        </View>

        <View style={styles.divider} />

        <View style={styles.timeSetting}>
          <Text style={styles.settingText}>
            알림 시간: <Text style={{ color: '#57C9D0' }}>{user.notificationTime}</Text>
          </Text>
        </View>
      </View>

      {/* 정책 섹션 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingText}>이용 약관</Text>
          <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingText}>개인정보 처리방침</Text>
          <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
        </TouchableOpacity>
      </View>

      {/* 로그아웃 */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    paddingHorizontal: wp('6%'),
  },
  header: {
    fontSize: hp('2.4%'),
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  profileCard: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp('2%'),
    gap: wp('4%'),
  },
  profileImage: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: 999,
    backgroundColor: '#C8EDEE',
  },
  userName: { fontSize: hp('2.4%'), color: '#FFFFFF', fontWeight: '700' },
  userProvider: { fontSize: hp('1.6%'), color: '#D7FAFA' },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: hp('2%'),
    padding: hp('2%'),
  },
  infoText: { fontSize: hp('1.8%'), color: '#666', marginBottom: hp('0.5%') },

  badgeSection: {
    marginTop: hp('3%'),
    backgroundColor: '#FFFFFF',
    padding: hp('2.5%'),
    borderRadius: 12,
  },
  badgeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') },
  badgeCountWrapper: { flexDirection: 'row', alignItems: 'center' },
  badgeCount: { fontSize: hp('1.8%'), color: '#57C9D0', fontWeight: '600' },
  badgeTotal: { fontSize: hp('1.8%'), color: '#A1A1A1', marginRight: hp('1%') },
  badgeBarBackground: { height: hp('1%'), backgroundColor: '#E4E4E4', borderRadius: 100 },
  badgeBarFill: { height: '100%', backgroundColor: '#57C9D0', borderRadius: 100 },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E6E7E9',
    paddingBottom: hp('2%'),
  },
  sectionTitle: { fontSize: hp('2.2%'), fontWeight: '700' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
  },
  settingText: { fontSize: hp('1.8%'), color: '#686F79' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E6E7E9' },
  timeSetting: { marginTop: hp('1.5%'), alignItems: 'center' },
  logoutBtn: { alignItems: 'center', marginTop: hp('3%') },
  logoutText: { color: '#9B9FA6', fontSize: hp('1.8%') },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
