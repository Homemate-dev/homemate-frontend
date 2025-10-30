import { MaterialIcons } from '@expo/vector-icons'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import { toFirstDayOfMonth, toYMD } from '@/libs/utils/date'

import type { DateData } from 'react-native-calendars'
import type { MarkedDates } from 'react-native-calendars/src/types'

// ----- Locale -----
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
}
LocaleConfig.defaultLocale = 'ko'

// ----- utils -----
const isYMD = (s?: string | null) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s)
const shiftMonth = (ymdFirst: string, delta: number) => {
  const y = Number(ymdFirst.slice(0, 4))
  const m = Number(ymdFirst.slice(5, 7)) - 1
  const d = new Date(y, m + delta, 1)
  const yy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${yy}-${mm}-01`
}

type Props = {
  selectedDate?: string // YYYY-MM-DD
  onSelect?: (dateString: string) => void
}

export default function DatePickerCalendar({ selectedDate, onSelect }: Props) {
  const todayStr = useMemo(() => toYMD(new Date()), [])
  const safeSelected = useMemo(
    () => (isYMD(selectedDate) ? selectedDate! : todayStr),
    [selectedDate, todayStr]
  )

  // 🔹 화면에 보이는 "달"을 우리 쪽에서 100% 제어
  const [visibleMonth, setVisibleMonth] = useState(() => toFirstDayOfMonth(safeSelected))
  useEffect(() => {
    setVisibleMonth(toFirstDayOfMonth(safeSelected))
  }, [safeSelected])

  const markedDates = useMemo<MarkedDates>(
    () => ({
      [safeSelected]: { selected: true, selectedColor: '#57C9D0', selectedTextColor: '#fff' },
    }),
    [safeSelected]
  )

  const themeObj = useMemo(
    () => ({
      textDayFontSize: 16,
      textDayHeaderFontSize: 14,
      textMonthFontSize: 18,
      monthTextColor: '#0F172A',
      arrowColor: '#57C9D0',
      todayTextColor: '#57C9D0',
      selectedDayBackgroundColor: '#57C9D0',
      selectedDayTextColor: '#fff',
      'stylesheet.calendar.main': {
        week: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 0 },
      },
    }),
    []
  )

  return (
    <View style={styles.container}>
      <Calendar
        // ✅ initialDate 절대 넣지 말 것 (내부 상태와 충돌)
        current={visibleMonth}
        markedDates={markedDates}
        hideExtraDays
        enableSwipeMonths
        theme={themeObj as any}
        // 스와이프/스크롤로 달 바뀔 때
        onMonthChange={(d) => {
          const first = `${d.year}-${String(d.month).padStart(2, '0')}-01`
          setVisibleMonth(first)
        }}
        onVisibleMonthsChange={(months) => {
          // 안드로이드에서 onMonthChange가 안 먹는 경우 대비
          if (months?.[0]) {
            const { year, month } = months[0]
            const first = `${year}-${String(month).padStart(2, '0')}-01`
            setVisibleMonth(first)
          }
        }}
        // 화살표를 눌렀을 때도 우리가 직접 상태 변경 + 내부 이동 호출
        onPressArrowLeft={(subtractMonth) => {
          setVisibleMonth((prev) => shiftMonth(prev, -1))
          subtractMonth()
        }}
        onPressArrowRight={(addMonth) => {
          setVisibleMonth((prev) => shiftMonth(prev, 1))
          addMonth()
        }}
        onDayPress={(d: DateData) => onSelect?.(d.dateString)}
        renderArrow={(direction) => (
          <MaterialIcons
            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
            size={22}
            color="#57C9D0"
          />
        )}
        renderHeader={(date) => {
          const y = date.getFullYear()
          const m = date.getMonth() + 1
          return (
            <View style={styles.header}>
              <Text style={styles.headerText}>{`${y}년 ${m}월`}</Text>
            </View>
          )
        }}
        dayComponent={({ date, state, marking, onPress }) => {
          if (!date) return null
          const isToday = date?.dateString === todayStr || state === 'today'
          const textColor = marking?.selected ? '#fff' : isToday ? '#57C9D0' : '#0F172A'
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPress?.(date)}
              style={styles.dayButton}
            >
              <View style={[styles.dayCircle, marking?.selected && { backgroundColor: '#57C9D0' }]}>
                <Text style={[styles.dayText, { color: textColor }]}>{date?.day}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, overflow: 'hidden', paddingBottom: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: { fontSize: 18, fontWeight: '600', color: '#040F20B2' },
  dayButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 16, fontWeight: '400' },
})
