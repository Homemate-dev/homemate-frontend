import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Checkbox from '@/components/Checkbox'
import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import TabSafeScroll from '@/components/TabSafeScroll'
import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { api, setAccessToken } from '@/libs/api/axios'
import { useChoreByDate } from '@/libs/hooks/chore/useChoreByDate'
import { useChoreCalendar } from '@/libs/hooks/chore/useChoreCalendar'
import { usePatchChoreStatus } from '@/libs/hooks/chore/usePatchChoreStatus'
import { formatKoreanDate, getMonthRange } from '@/libs/utils/date'

import HomeCalendar from '../../components/Calendar/HomeCalendar'

export default function HomeScreen() {
  const router = useRouter()
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오후')
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const res = await api.post('/auth/dev/token/3')
      const token = res.data.accessToken
      setAccessToken(token)

      const statusRes = await api.get('/users/me/notification-settings/first-setup-status')
      const { firstSetupCompleted, notificationTime } = statusRes.data

      if (!firstSetupCompleted) {
        if (notificationTime) {
          const [hourStr, minuteStr] = notificationTime.split(':')
          const hourNum = parseInt(hourStr, 10)
          const ampmValue = hourNum >= 12 ? '오후' : '오전'
          const convertedHour = hourNum > 12 ? hourNum - 12 : hourNum

          setAmpm(ampmValue)
          setHour(convertedHour)
          setMinute(parseInt(minuteStr, 10))
        }

        setShowSetupModal(true)
      }
    }

    init()
  }, [])

  const handleAllowNotification = async () => {
    try {
      const convertedHour = ampm === '오후' && hour < 12 ? hour + 12 : hour
      const formattedTime = `${String(convertedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

      await api.post('/users/me/notification-settings/first-setup', {
        notificationTime: formattedTime,
        masterEnabled: true,
        choreEnabled: true,
        noticeEnabled: true,
      })

      setShowSetupModal(false)
      alert('알림 설정이 완료되었습니다!')
      router.replace('/')
    } catch (err) {
      console.error('최초 알림 설정 실패:', err)
    }
  }

  const androidTop = Platform.OS === 'android' ? 50 : 0

  const todayStr = useMemo(() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
      t.getDate()
    ).padStart(2, '0')}`
  }, [])

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [range, setRange] = useState(() => getMonthRange(selectedDate))
  const { data: dotDates = [] } = useChoreCalendar(range.start, range.end)
  const { data: choresList = [], isLoading, isError } = useChoreByDate(selectedDate)
  const { mutate: choreStatus } = usePatchChoreStatus(selectedDate)

  const progress = useMemo(() => {
    const total = choresList.length
    if (!total) return 0
    const done = choresList.filter((c) => c.status === 'COMPLETED').length
    return Math.round((done / total) * 100)
  }, [choresList])

  const styleFromRepeatColor = (cls: string | undefined) => {
    if (!cls) return {}
    const bgMatch = cls.match(/bg-\[#([0-9A-Fa-f]{6})\]/)
    const textMatch = cls.match(/text-\[#([0-9A-Fa-f]{6})\]/)
    const style: any = {}
    if (bgMatch) style.backgroundColor = `#${bgMatch[1]}`
    if (textMatch) style.color = `#${textMatch[1]}`
    return style
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F8F8FA" />
      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/images/logo/logo.png')}
            style={{ width: 125, height: 24 }}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Image
              source={require('../../assets/images/notification.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentWrap}>
          <View style={styles.homeCard}>
            <View style={styles.rowBetween}>
              <View style={styles.colGap2}>
                <Text style={styles.helloTitle}>안녕하세요, 사용자님!</Text>
                <Text style={styles.baseText}>
                  오늘의 집안일을 <Text style={styles.progressNum}>{progress}%</Text> 완료했어요.
                </Text>
              </View>
              <Image
                source={require('../../assets/images/card/card-img.png')}
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%`, borderRadius: 9999 }]} />
            </View>
          </View>

          <HomeCalendar
            onSelect={setSelectedDate}
            dotDates={dotDates}
            onMonthChangeRange={(start, end) => setRange({ start, end })}
          />

          <View style={styles.flex}>
            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeaderTitle}>{formatKoreanDate(selectedDate)}</Text>
              <Text style={styles.listHeaderSub}>집안일</Text>
            </View>

            <View style={styles.listBox}>
              {isLoading && <Text>집안일 내역을 불러오는 중입니다.</Text>}
              {isError && <Text>집안일 내역 불러오기에 실패했습니다.</Text>}
              {!isLoading && !isError && choresList.length === 0 ? (
                <Text style={styles.itemTitle}>사용자님의 하루 집안일을 계획해보세요</Text>
              ) : (
                choresList.map((item, index) => {
                  const key = getRepeatKey(item.repeatType, item.repeatInterval)
                  const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']

                  return (
                    <View
                      key={item.id}
                      style={[styles.itemRow, index !== choresList.length - 1 && styles.mb12]}
                    >
                      <View style={styles.itemLeftRow}>
                        <Text
                          style={[
                            styles.badgeText,
                            item.status === 'COMPLETED'
                              ? styles.badgeDone
                              : styleFromRepeatColor(repeat.color),
                          ]}
                        >
                          {repeat.label}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            router.push({
                              pathname: '/add-chore',
                              params: {
                                mode: 'edit',
                                instanceId: String(item.id),
                                choreId: String(item.choreId),
                                selectedDate,
                              },
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.itemTitle,
                              item.status === 'COMPLETED'
                                ? styles.itemTitleDone
                                : styles.itemTitleActive,
                            ]}
                          >
                            {item.titleSnapshot}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Checkbox
                        checked={item.status === 'COMPLETED'}
                        onChange={() => choreStatus(item.id)}
                        size={20}
                      />
                    </View>
                  )
                })
              )}
            </View>
          </View>
        </View>
      </TabSafeScroll>

      {/* 알림 최초 설정 모달 */}
      <Modal visible={showSetupModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'visible',
            }}
          >
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>알림을 언제 보내드릴까요?</Text>
              <Text style={styles.modalDesc}>
                가입 시 한 번만 설정하면, {'\n'}
                새로운 일정도 자동으로 그 시간에 알려드려요.
              </Text>

              <TimeDropdown
                ampm={ampm}
                hour={hour}
                minute={minute}
                onChange={(v) => {
                  setAmpm(v.ampm)
                  setHour(v.hour)
                  setMinute(v.minute)
                }}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />

              <Text style={styles.modalDesc}>
                알림 설정 및 시간은 {'\n'}
                <Text style={styles.highlightText}>마이페이지</Text>에서 수정할 수 있어요.
              </Text>

              <TouchableOpacity onPress={handleAllowNotification} style={styles.allowBtn}>
                <Text style={styles.allowText}>알림 허용하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FA' },
  headerRow: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentWrap: { flexDirection: 'column', gap: 16 },
  homeCard: {
    backgroundColor: '#DDF4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  colGap2: { flexDirection: 'column', gap: 8 },
  helloTitle: { fontWeight: '600', fontSize: 20 },
  baseText: { fontSize: 16 },
  progressNum: { fontWeight: '700', color: '#46A1A6' },
  progressBar: {
    marginTop: 12,
    marginBottom: 8,
    height: 6,
    width: '100%',
    borderRadius: 9999,
    backgroundColor: '#F5FCFC',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#57C9D0' },
  flex: { flex: 1 },
  listHeaderRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  listHeaderTitle: { fontSize: 20, fontWeight: '700' },
  listHeaderSub: { fontSize: 18 },
  listBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mb12: { marginBottom: 12 },
  itemLeftRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  badgeText: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, fontSize: 14 },
  badgeDone: { backgroundColor: '#CDCFD2', color: '#9B9FA6' },
  itemTitle: { fontSize: 16 },
  itemTitleActive: { color: '#000000' },
  itemTitleDone: { color: '#9CA3AF', textDecorationLine: 'line-through' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    overflow: 'visible',
    maxHeight: '80%',
    zIndex: 999,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalDesc: { fontSize: 14, textAlign: 'center', marginVertical: 24 },
  allowBtn: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
  },
  allowText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  highlightText: { color: '#46A1A6' },
})
