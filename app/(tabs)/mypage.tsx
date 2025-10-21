import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import {
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

import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import Toggle from '@/components/Toggle'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function MyPage() {
  const user = {
    name: '이름',
    username: '@아이디',
    badgeCount: 5,
    badgeTotal: 35,
    profileImage: require('../../assets/images/profile/profile-default.png'),
  }

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const [isHouseAlarm, setIsHouseAlarm] = useState(true)
  const [isNoticeAlarm, setIsNoticeAlarm] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [activeDropdown])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>마이페이지</Text>

      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Image source={user.profileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userId}>{user.username}</Text>
        </View>
      </View>

      {/* 뱃지 영역 */}
      <View style={styles.badgeSection}>
        <View style={styles.badgeHeader}>
          <Text style={styles.sectionTitle}>나의 뱃지</Text>
          <View style={styles.badgeCountWrapper}>
            <Text style={styles.badgeCount}>{user.badgeCount}개</Text>
            <Text style={styles.badgeTotal}> / {user.badgeTotal}개</Text>
            <Ionicons name="chevron-forward" size={18} color="#B4B7BC" />
          </View>
        </View>
        <View style={styles.badgeBarBackground}>
          <View
            style={[
              styles.badgeBarFill,
              { width: `${(user.badgeCount / user.badgeTotal) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* 알림 설정 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>알림</Text>
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

        {/* 알림시간 설정 */}
        <View style={[styles.timeSetting, activeDropdown && { height: hp('35%') }]}>
          <Text style={styles.settingText}>알림시간 설정</Text>
          <TimeDropdown
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            styles={styles}
          />
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
    overflow: 'visible',
  },
  header: {
    fontSize: hp('2.2%'),
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
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: 999,
    backgroundColor: '#C8EDEE',
  },
  userName: { fontSize: hp('2.2%'), color: '#FFFFFF', fontWeight: '600' },
  userId: { fontSize: hp('1.6%'), color: '#FFFFFF', marginTop: hp('0.5%') },
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
  sectionTitle: { fontSize: hp('2.2%'), fontWeight: '700' },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
    zIndex: 1,
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
  divider: { borderBottomWidth: 1, borderBottomColor: '#E6E7E9' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
  },
  settingText: { fontSize: hp('1.8%'), color: '#686F79' },

  timeSetting: {
    marginTop: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },

  logoutBtn: { alignItems: 'center', marginTop: hp('2%') },
  logoutText: { color: '#9B9FA6', fontSize: hp('1.8%') },

  timeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: hp('1.5%'),
    width: '100%',
  },
  timeBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },

  timeUnit: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  unitLabel: {
    fontSize: hp('1.8%'),
    marginLeft: 6,
    color: '#000',
  },

  dropdownBox: {
    backgroundColor: '#EBF9F9',
    borderRadius: 8,
    width: wp('20%'),
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },

  dropdownText: {
    color: '#46A1A6',
    fontSize: hp('1.9%'),
    fontWeight: '500',
  },

  dropdownGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },

  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#57C9D0',
    borderRadius: 8,
    width: wp('20%'),
    height: hp('20%'),
    marginHorizontal: 6,
    flexGrow: 0,
    flexShrink: 0,
  },

  dropdownItem: {
    textAlign: 'center',
    paddingVertical: 6,
    fontSize: hp('1.8%'),
    color: '#46A1A6',
    fontWeight: '500',
  },
  timeList: {
    width: '100%',
    marginTop: hp('1.5%'),
  },
  timeLists: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },
  confirmButton: {
    marginTop: hp('1.5%'),
    backgroundColor: '#57C9D0',
    borderRadius: 8,
    paddingVertical: hp('1%'),
    width: '100%',
    alignSelf: 'center',
  },

  confirmText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
})
