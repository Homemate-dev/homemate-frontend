import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import CustomSwitch from '@/components/CustomSwitch'

export default function MyPageScreen() {
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp('10%') }}>
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
          <CustomSwitch value={isNotificationEnabled} onValueChange={setIsNotificationEnabled} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>집안일 알림</Text>
          <CustomSwitch value={isHouseAlarm} onValueChange={setIsHouseAlarm} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>공지 알림</Text>
          <CustomSwitch value={isNoticeAlarm} onValueChange={setIsNoticeAlarm} />
        </View>

        <View style={styles.divider} />

        <View style={styles.timeSetting}>
          <Text style={styles.settingText}>알림시간 설정</Text>
          <View style={styles.timeSelectBox}>
            <TouchableOpacity style={styles.timeBtn}>
              <Text style={styles.timeBtnText}>오후</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeBtn}>
              <Text style={styles.timeBtnText}>9</Text>
            </TouchableOpacity>
            시
            <TouchableOpacity style={styles.timeBtn}>
              <Text style={styles.timeBtnText}>10</Text>
            </TouchableOpacity>
            분
          </View>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FA', paddingHorizontal: wp('6%') },
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
  userName: {
    fontSize: hp('2.2%'),
    color: '#FFFFFF',
    fontWeight: '600',
  },
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
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontWeight: '700',
  },
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
    gap: wp('2.5%'),
    fontSize: hp('1.8%'),
    color: '#686F79',
  },
  timeSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    gap: wp('2.5%'),
  },
  timeBtn: {
    backgroundColor: '#E4F8F9',
    borderRadius: 6,
    width: wp('16%'),
    height: hp('4.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBtnText: {
    color: '#57C9D0',
    fontWeight: '600',
    fontSize: hp('1.8%'),
  },
  logoutBtn: { alignItems: 'center', marginTop: hp('2%') },
  logoutText: { color: '#9B9FA6', fontSize: hp('1.8%') },
})
