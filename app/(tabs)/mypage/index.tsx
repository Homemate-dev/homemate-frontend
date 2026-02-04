import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import NotificationBell from '@/components/notification/NotificationBell'
import TabSafeScroll from '@/components/TabSafeScroll'
import Toggle from '@/components/Toggle'
import WithdrawConfirmModal from '@/components/withdraw/WithdrawConfirmModal'
import { useAuth } from '@/contexts/AuthContext'
import { registerFCMToken } from '@/libs/firebase/fcm'
import { useAcquiredBadges } from '@/libs/hooks/badge/useAcquiredBadges'
import { useLogout } from '@/libs/hooks/mypage/useLogout'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import { useNotiSetting } from '@/libs/hooks/mypage/useNotiSetting'
import { useNotiTimeSetting } from '@/libs/hooks/mypage/useNotiTimeSetting'
import { toHHmm, toHHmmParts } from '@/libs/utils/time'
import { AlertType } from '@/types/mypage'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function MyPage() {
  const router = useRouter()
  const { token } = useAuth()

  // React Query
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useMyPage()
  const { data: badge = [] } = useAcquiredBadges()
  const { mutate: notiSetting } = useNotiSetting()
  const { mutate: notiTimeSetting } = useNotiTimeSetting()
  const { mutate: logout } = useLogout()

  // 로컬 UI 상태
  const [isMasterAlarm, setIsMasterAlarm] = useState(false)
  const [isChoreAlarm, setIsChoreAlarm] = useState(false)
  const [isNoticeAlarm, setIsNoticeAlarm] = useState(false)

  const [WithdrawOpen, setWithdrawOpen] = useState(false)
  const openWithdraw = () => setWithdrawOpen(true)
  const closeWithdraw = () => setWithdrawOpen(false)

  // 타임 드롭다운 상태
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전')
  const [hour, setHour] = useState(9)
  const [minute, setMinute] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  //  기기 알림 권한 허용 여부 체크
  const [isDeviceNotiDenied, setIsDeviceNotiDenied] = useState(false)

  //회원탈퇴 화면 가기
  const goWithdrawScreen = () => {
    closeWithdraw()
    router.push('/(tabs)/mypage/withdraw')
  }

  // 뱃지 획득 개수
  const AcquireBadgeCount = badge.filter((b) => b.acquired).length ?? 0
  const totalBadge = badge?.length ?? 0
  const progress = totalBadge ? Math.round((AcquireBadgeCount / totalBadge) * 100) : 0

  const NOTIFICATION_URL =
    'https://www.notion.so/Safari-29aaba73bec681948470fed9040bf094?source=copy_link'
  const FAQ_URL = 'https://www.notion.so/FAQ-29aaba73bec680a4b7f9f7431f1d103b?source=copy_link'

  const TERMS_URL =
    'https://classy-group-db3.notion.site/29aaba73bec680159850c0297ddcd13f?source=copy_link'
  const PRIVACY_URL =
    'https://classy-group-db3.notion.site/29aaba73bec6807fbb64c4b38eae9f7a?source=copy_link'

  // 초기 서버 데이터 → 토글/시간 초기화
  useEffect(() => {
    if (!user) return

    setIsMasterAlarm(!!user.masterEnabled)
    setIsChoreAlarm(!!user.choreEnabled)
    setIsNoticeAlarm(!!user.noticeEnabled)

    if (user.notificationTime) {
      const parsed = toHHmmParts(user.notificationTime)
      setAmpm(parsed.ampm)
      setHour(parsed.hour12)
      setMinute(parsed.minute)
    }
  }, [user])

  // 기기 알림 권한 허용 여부 체크
  // 기기 알림 권한 재확인
  useEffect(() => {
    if (Platform.OS !== 'web') return

    let mounted = true

    const checkPermission = async () => {
      try {
        // Notification / SW 없으면 알림 불가로 간주
        if (typeof Notification === 'undefined' || !('serviceWorker' in navigator)) {
          if (!mounted) return
          setIsDeviceNotiDenied(true)
          return
        }
        const permission = Notification.permission

        // 권한이 granted가 아니면 알림 불가
        if (permission !== 'granted') {
          if (!mounted) return
          setIsDeviceNotiDenied(true)
          return
        }

        // granted라도 push 구독이 없으면 실제로 푸시 못 받음 -> 알림 불가로 처리
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()

        if (!mounted) return
        setIsDeviceNotiDenied(!sub)
      } catch {
        if (!mounted) return
        setIsDeviceNotiDenied(false)
      }
    }

    // 최초 1회
    checkPermission()

    // 서비스 복귀 시마다 재확인
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkPermission()
    }
    window.addEventListener('focus', checkPermission)
    window.addEventListener('pageshow', checkPermission)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      mounted = false
      window.removeEventListener('focus', checkPermission)
      window.removeEventListener('pageshow', checkPermission)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  // 드롭다운 열고 닫힐 때 부드러운 애니메이션
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [activeDropdown])

  // 토글 상태 핸들러
  const handleToggle = async (type: AlertType, next: boolean) => {
    // 웹에서 알림 권한이 denied 상태인데 ON을 시도하면 막기
    if (Platform.OS === 'web' && next && isDeviceNotiDenied) {
      alert('기기에서 알림이 차단되어 있어요.\n' + '설정 > 알림에서 홈메이트 알림을 허용해 주세요.')

      // UI는 모두 OFF 상태 유지
      setIsMasterAlarm(false)
      setIsChoreAlarm(false)
      setIsNoticeAlarm(false)
      return
    }

    // 토글 ON 되는 순간 + 웹 환경일 경우 FCM 토큰 등록 시도
    const nextMaster = type === 'master' ? next : isMasterAlarm
    const nextChore = type === 'chore' ? next : isChoreAlarm
    const nextNotice = type === 'notice' ? next : isNoticeAlarm

    const wasAllOff = !isMasterAlarm && !isChoreAlarm && !isNoticeAlarm
    const willAnyOn = nextMaster || nextChore || nextNotice

    if (Platform.OS === 'web' && wasAllOff && willAnyOn) {
      if (typeof Notification !== 'undefined') {
        let permission = Notification.permission as NotificationPermission

        // 아직 한 번도 선택 안했다면 시스템 팝업 요청
        if (permission === 'default') {
          permission = await Notification.requestPermission()
        }

        if (permission === 'granted') {
          try {
            await registerFCMToken(token ?? '')
          } catch (e) {
            console.error('FCM 토큰 등록 실패: ', e)
          }
        } else if (permission === 'denied') {
          alert(
            '기기에서 알림이 차단되었어요.\n' + '설정 > 알림에서 홈메이트 알림을 허용해 주세요.'
          )

          setIsDeviceNotiDenied(true)
          setIsMasterAlarm(false)
          setIsChoreAlarm(false)
          setIsNoticeAlarm(false)
          return
        }
      }
    }

    if (type === 'master') {
      setIsMasterAlarm(next)
      setIsChoreAlarm(next)
      setIsNoticeAlarm(next)
    } else if (type === 'chore') {
      setIsChoreAlarm(next)
    } else if (type === 'notice') {
      setIsNoticeAlarm(next)
    }

    notiSetting({ type, enabled: next })
  }

  const handleConfirm = () => {
    const notificationTime = toHHmm(ampm, hour, minute)

    notiTimeSetting(
      { notificationTime },
      {
        onSuccess: () => {
          setShowConfirm(false)
          setActiveDropdown(null)
        },
      }
    )
  }

  // 로딩/에러 UI
  if (isUserLoading) {
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
    <View style={{ flex: 1 }}>
      <TabSafeScroll
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
                  : require('../../../assets/images/icon/default_profile.png')
              }
              style={styles.profileImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.nickname ?? '닉네임 없음'}</Text>
          </View>
        </View>

        {/* 뱃지 섹션 */}
        <View style={styles.badgeSection}>
          <View style={styles.badgeHeader}>
            <Text style={styles.sectionTitle}>나의 뱃지</Text>

            <Pressable onPress={() => router.replace('/mybadges')} style={styles.badgeCountWrapper}>
              <Text style={styles.badgeCount}>
                {AcquireBadgeCount}개 <Text style={styles.badgeTotal}>/ {totalBadge}개</Text>
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
            </Pressable>
          </View>
          <View style={styles.badgeBarBackground}>
            <View style={[styles.badgeBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* 알림 권한 여부 */}
        {isDeviceNotiDenied && (
          <View style={styles.sectionNoti}>
            <TouchableOpacity
              onPress={() => Linking.openURL(NOTIFICATION_URL)}
              style={styles.touchNoti}
            >
              <View style={styles.notiArea}>
                <Image source={require('@/assets/images/bellOff.png')} style={styles.notiImage} />
                <Text style={styles.notiText}>기기 알림이 꺼져 있어요</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
            </TouchableOpacity>
          </View>
        )}

        {/* 알림 설정 */}
        <View style={styles.sectionWithDropdown}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>알림</Text>
            <Toggle value={isMasterAlarm} onChange={(next) => handleToggle('master', next)} />
          </View>

          <View style={styles.settingChore}>
            <Text style={styles.settingText}>집안일 알림</Text>
            <Toggle value={isChoreAlarm} onChange={(next) => handleToggle('chore', next)} />
          </View>

          <View style={styles.settingNotice}>
            <Text style={styles.settingText}>공지 알림</Text>
            <Toggle value={isNoticeAlarm} onChange={(next) => handleToggle('notice', next)} />
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

            <Text style={styles.alarmNotice}>
              변경한 알림 시간은 이후 등록하는 집안일에만 적용됩니다. {'\n'}
              이미 등록된 집안일의 알림 시간은 변경되지 않습니다.
            </Text>
          </View>
        </View>

        {/* 약관 / 개인정보 처리방침 */}
        <View style={styles.sectionBelow}>
          <TouchableOpacity style={styles.settingBelowTop} onPress={() => Linking.openURL(FAQ_URL)}>
            <Text style={styles.settingText}>FAQ</Text>
            <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingBelowMiddle}
            onPress={() => Linking.openURL(TERMS_URL)}
          >
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

        {/* 로그아웃 & 회원탈퇴 */}
        <View style={styles.logoutArea}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => logout()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>

          <View style={styles.logoutDivider} />

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={openWithdraw}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.logoutText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

        <WithdrawConfirmModal
          visible={WithdrawOpen}
          userName={user?.nickname}
          onClose={closeWithdraw}
          onConfirm={goWithdrawScreen}
        />
      </TabSafeScroll>
    </View>
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
    height: 46,
    marginVertical: 16,
    position: 'relative',
    flexDirection: 'row',
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  notificationBell: { position: 'absolute', right: 0 },

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
    width: 60,
    height: 60,
    borderRadius: 999,
  },
  userInfo: { alignItems: 'flex-start', justifyContent: 'center', gap: 4 },
  userName: { fontSize: 16, color: '#FFFFFF', fontWeight: '700' },
  userid: { fontSize: 12, color: '#FFFFFF' },

  badgeSection: {
    marginTop: hp('3%'),
    backgroundColor: '#FFFFFF',
    padding: hp('2.5%'),
    borderRadius: 12,
  },
  badgeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') },
  badgeCountWrapper: { flexDirection: 'row', alignItems: 'center' },
  badgeCount: { fontSize: 14, color: '#57C9D0', fontWeight: '600' },
  badgeTotal: {
    fontSize: 14,
    color: '#B4B7BC',
    marginRight: hp('1%'),
    fontWeight: '400',
  },
  badgeBarBackground: { height: 8, backgroundColor: '#040F2014', borderRadius: 100 },
  badgeBarFill: { height: '100%', backgroundColor: '#57C9D0', borderRadius: 100 },

  sectionWithDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: hp('2%'),
    elevation: 4,
  },

  sectionNoti: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: hp('2%'),
  },

  notiImage: {
    width: 16,
    height: 16,
    marginRight: 8,
  },

  sectionBelow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  sectionTitle: { fontSize: 18, fontWeight: '700' },

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

  notiArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  notiText: {
    fontSize: 14,
    color: '#686F79',
  },

  touchNoti: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settingBelowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },

  settingBelowMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  settingBelowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },

  settingText: { fontSize: 14, color: '#686F79' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E6E7E9' },

  timeSetting: { marginTop: hp('1.5%') },

  alarmNotice: {
    color: '#9B9FA6',
    fontSize: 12,
    marginTop: 16,
    lineHeight: 18,
  },

  confirmBtn: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 59,
    width: '100%',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  confirmText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  logoutArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,

    marginTop: 50,
    marginBottom: 20,
  },

  logoutBtn: { alignItems: 'center' },
  logoutText: { color: '#9B9FA6', fontSize: 12 },

  logoutDivider: { backgroundColor: '#9B9FA6', width: 1, height: 9 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
