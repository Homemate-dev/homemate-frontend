import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
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

import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import Toggle from '@/components/Toggle'
import {
  fetchMyPage,
  fetchNotificationTime,
  patchNotificationSetting,
  patchNotificationTime,
  postLogout,
} from '@/libs/api/user'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const [isHouseAlarm, setIsHouseAlarm] = useState(false)
  const [isNoticeAlarm, setIsNoticeAlarm] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전')
  const [hour, setHour] = useState(9)
  const [minute, setMinute] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  const TERMS_URL =
    'https://classy-group-db3.notion.site/29aaba73bec680159850c0297ddcd13f?source=copy_link'
  const PRIVACY_URL =
    'https://classy-group-db3.notion.site/29aaba73bec6807fbb64c4b38eae9f7a?source=copy_link'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const myData = await fetchMyPage()
        const notifTimeData = await fetchNotificationTime()

        setUser(myData)
        setIsNotificationEnabled(myData.masterEnabled)
        setIsHouseAlarm(myData.choreEnabled)
        setIsNoticeAlarm(myData.noticeEnabled)

        // 알림 시간 세팅
        const time = notifTimeData?.notificationTime || myData.notificationTime
        if (time) {
          const [hourStr, minuteStr] = time.split(':')
          const hourNum = parseInt(hourStr, 10)
          const ampmValue = hourNum >= 12 ? '오후' : '오전'
          const convertedHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
          setAmpm(ampmValue)
          setHour(convertedHour)
          setMinute(parseInt(minuteStr, 10))
        }
      } catch (error) {
        console.error('❌ 마이페이지 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [activeDropdown])

  const handleToggleChange = async (type: 'master' | 'chore' | 'notice', value: boolean) => {
    try {
      await patchNotificationSetting(type, value)
      if (type === 'master') setIsNotificationEnabled(value)
      if (type === 'chore') setIsHouseAlarm(value)
      if (type === 'notice') setIsNoticeAlarm(value)
    } catch {
      alert('알림 설정 변경 중 오류가 발생했습니다.')
    }
  }

  const handleConfirm = async () => {
    try {
      await patchNotificationTime(hour, minute, ampm)
      alert('알림 시간이 변경되었습니다')
      setShowConfirm(false)
      setActiveDropdown(null)
    } catch (error) {
      alert('알림 시간 변경 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    try {
      await postLogout()
      await AsyncStorage.removeItem('accessToken')
      await AsyncStorage.removeItem('refreshToken')

      alert('로그아웃 되었습니다.')
      router.replace('/')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 : 90 }}
    >
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#B4B7BC"
          style={styles.headerIcon}
        />
      </View>

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

      {/* 알림 설정 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <Toggle value={isNotificationEnabled} onChange={(v) => handleToggleChange('master', v)} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>집안일 알림</Text>
          <Toggle value={isHouseAlarm} onChange={(v) => handleToggleChange('chore', v)} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>공지 알림</Text>
          <Toggle value={isNoticeAlarm} onChange={(v) => handleToggleChange('notice', v)} />
        </View>

        <View style={styles.divider} />

        {/* 알림 시간 드롭다운 + 확인 버튼 */}
        <View style={styles.timeSetting}>
          <Text style={[styles.settingText, { marginBottom: 8 }]}>알림 시간 설정</Text>
          <TimeDropdown
            ampm={ampm}
            hour={hour}
            minute={minute}
            onChange={(v) => {
              setAmpm(v.ampm)
              setHour(v.hour)
              setMinute(v.minute)
              setShowConfirm(true)
            }}
            activeDropdown={activeDropdown}
            setActiveDropdown={(v) => {
              setActiveDropdown(v)
              if (v) setShowConfirm(true)
            }}
          />
          {showConfirm && (
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 정책 섹션 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL(TERMS_URL)}>
          <Text style={styles.settingText}>이용 약관</Text>
          <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL(PRIVACY_URL)}>
          <Text style={styles.settingText}>개인정보 처리방침</Text>
          <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
        </TouchableOpacity>
      </View>

      {/* 로그아웃 */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    paddingHorizontal: wp('6%'),
    height: hp('100%'),
  },
  headerWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  headerTitle: {
    fontSize: hp('2.4%'),
    fontWeight: '700',
  },
  headerIcon: {
    position: 'absolute',
    right: 0,
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
  confirmBtn: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    paddingVertical: hp('1.5%'),
    width: '100%',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  confirmText: { color: '#FFFFFF', fontSize: hp('2%'), fontWeight: '700' },
  logoutBtn: { alignItems: 'center', marginTop: hp('3%') },
  logoutText: { color: '#9B9FA6', fontSize: hp('1.8%') },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
