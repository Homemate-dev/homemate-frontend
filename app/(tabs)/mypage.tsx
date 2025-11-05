import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import NotificationBell from '@/components/notification/NotificationBell'
import Toggle from '@/components/Toggle'
import {
  fetchNotificationTime,
  patchNotificationSetting,
  patchNotificationTime,
  postLogout,
} from '@/libs/api/user'
import { useMyPage } from '@/libs/hooks/mypage/user' // ✅ 훅 사용

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function MyPage() {
  const router = useRouter()
  const qc = useQueryClient()

  // ✅ React Query
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useMyPage()
  const { data: notifTimeData, isLoading: isTimeLoading } = useQuery({
    queryKey: ['user', 'notificationTime'],
    queryFn: fetchNotificationTime,
  })

  // 로컬 UI 상태
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

  // 서버 데이터 수신 → 토글/시간 초기화
  useEffect(() => {
    if (!user) return
    setIsNotificationEnabled(!!user.masterEnabled)
    setIsHouseAlarm(!!user.choreEnabled)
    setIsNoticeAlarm(!!user.noticeEnabled)
  }, [user])

  useEffect(() => {
    const time = notifTimeData?.notificationTime || user?.notificationTime // 우선순위: 단일 time API > 마이페이지의 기본값
    if (!time) return
    const [hourStr, minuteStr] = time.split(':')
    const hourNum = parseInt(hourStr, 10)
    const ampmValue: '오전' | '오후' = hourNum >= 12 ? '오후' : '오전'
    const convertedHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    setAmpm(ampmValue)
    setHour(convertedHour)
    setMinute(parseInt(minuteStr, 10))
  }, [notifTimeData, user])

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [activeDropdown])

  const handleToggleChange = async (type: 'master' | 'chore' | 'notice', value: boolean) => {
    try {
      await patchNotificationSetting(type, value)
      // 로컬 즉시 반영
      if (type === 'master') setIsNotificationEnabled(value)
      if (type === 'chore') setIsHouseAlarm(value)
      if (type === 'notice') setIsNoticeAlarm(value)
      // 서버 최신화
      qc.invalidateQueries({ queryKey: ['user', 'me'] })
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
      // 시간 재조회
      qc.invalidateQueries({ queryKey: ['user', 'notificationTime'] })
    } catch (error) {
      console.error('알림 시간 변경 실패:', error)
      alert('알림 시간 변경 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    try {
      await postLogout()
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken'])
      alert('로그아웃 되었습니다.')
      router.replace('/(auth)')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  // ✅ 로딩/에러 UI
  if (isUserLoading || isTimeLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57C9D0" />
        <Text style={{ color: '#57C9D0', marginTop: 10 }}>불러오는 중...</Text>
      </View>
    )
  }

  if (isUserError || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>유저 정보를 불러올 수 없습니다.</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { overflow: 'visible' }]}
      contentContainerStyle={{
        paddingBottom: Platform.OS === 'android' ? 100 : 90,
        overflow: 'visible',
      }}
    >
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.notificationBell}>
          <NotificationBell />
        </View>
      </View>

      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <View style={styles.profileArea}>
          <Image
            source={
              user.profileImageUrl
                ? { uri: user.profileImageUrl }
                : require('../../assets/images/icon/default_profile.png')
            }
            style={styles.profileImage}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.nickname ?? '닉네임 없음'}</Text>
          <Text style={styles.userid}>@{user.id}</Text>
        </View>
      </View>

      {/* 뱃지 */}
      <View style={styles.badgeSection}>
        <View style={styles.badgeHeader}>
          <Text style={styles.sectionTitle}>나의 뱃지</Text>

          <Pressable onPress={() => router.push('/mybadges')} style={styles.badgeCountWrapper}>
            <Text style={styles.badgeCount}>
              0개 <Text style={styles.badgeTotal}>/ 0개</Text>
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
          </Pressable>
        </View>
        <View style={styles.badgeBarBackground}>
          <View style={[styles.badgeBarFill, { width: '0%' }]} />
        </View>
      </View>

      {/* 알림 설정 */}
      <View style={styles.sectionWithDropdown}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>알림</Text>
          <Toggle value={isNotificationEnabled} onChange={(v) => handleToggleChange('master', v)} />
        </View>

        <View style={styles.settingChore}>
          <Text style={styles.settingText}>집안일 알림</Text>
          <Toggle value={isHouseAlarm} onChange={(v) => handleToggleChange('chore', v)} />
        </View>

        <View style={styles.settingNotice}>
          <Text style={styles.settingText}>공지 알림</Text>
          <Toggle value={isNoticeAlarm} onChange={(v) => handleToggleChange('notice', v)} />
        </View>

        <View style={styles.divider} />

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

      {/* 정책 + 로그아웃 */}
      <View style={styles.sectionBelow}>
        <TouchableOpacity style={styles.settingBelowTop} onPress={() => Linking.openURL(TERMS_URL)}>
          <Text style={styles.settingText}>이용 약관</Text>
          <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.settingBelowBottom}
          onPress={() => Linking.openURL(PRIVACY_URL)}
        >
          <Text style={styles.settingText}>개인정보 처리방침</Text>
          <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
        </TouchableOpacity>
      </View>

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
    paddingHorizontal: 20,
    height: hp('100%'),
  },
  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
    position: 'relative',
    flexDirection: 'row',
  },
  headerTitle: { fontFamily: 'Pretendard', fontSize: 20, fontWeight: '700' },
  notificationBell: { position: 'absolute', right: 0 },

  headerIcon: { position: 'absolute', right: 0 },
  profileCard: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileArea: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: '#79D4D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  userInfo: { alignItems: 'flex-start', justifyContent: 'center', gap: 4 },
  userName: { fontFamily: 'Pretendard', fontSize: 16, color: '#FFFFFF', fontWeight: '700' },
  userid: { fontFamily: 'Pretendard', fontSize: 12, color: '#FFFFFF' },
  badgeSection: {
    marginTop: hp('3%'),
    backgroundColor: '#FFFFFF',
    padding: hp('2.5%'),
    borderRadius: 12,
  },
  badgeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') },
  badgeCountWrapper: { flexDirection: 'row', alignItems: 'center' },
  badgeCount: { fontFamily: 'Pretendard', fontSize: 14, color: '#57C9D0', fontWeight: '600' },
  badgeTotal: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    color: '#B4B7BC',
    marginRight: hp('1%'),
    fontWeight: 400,
  },
  badgeBarBackground: { height: 8, backgroundColor: '#040F2014', borderRadius: 100 },
  badgeBarFill: { height: '100%', backgroundColor: '#57C9D0', borderRadius: 100 },
  sectionWithDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: hp('2%'),
    elevation: 4,
  },
  sectionBelow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: hp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E7E9',
    paddingBottom: hp('2%'),
  },
  sectionTitle: { fontFamily: 'Pretendard', fontSize: 18, fontWeight: '700' },
  settingChore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  settingNotice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },

  settingBelowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  settingBelowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },

  settingText: { fontFamily: 'Pretendard', fontSize: 14, color: '#686F79' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E6E7E9' },
  timeSetting: { marginTop: hp('1.5%') },
  confirmBtn: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 59,
    width: '100%',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  confirmText: { fontFamily: 'Pretendard', color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  logoutBtn: { alignItems: 'center', marginTop: hp('3%') },
  logoutText: { fontFamily: 'Pretendard', color: '#9B9FA6', fontSize: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
