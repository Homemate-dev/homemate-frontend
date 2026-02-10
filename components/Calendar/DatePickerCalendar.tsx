import { useEffect, useMemo, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
  isOpen?: boolean
}

export default function DatePickerCalendar({ selectedDate, onSelect, isOpen }: Props) {
  const todayStr = useMemo(() => toYMD(new Date()), [])
  const safeSelected = useMemo(
    () => (isYMD(selectedDate) ? selectedDate! : todayStr),
    [selectedDate, todayStr]
  )

  const [visibleMonth, setVisibleMonth] = useState(() => toFirstDayOfMonth(safeSelected))
  const isTodaySelected = safeSelected === todayStr

  // 모달이 열릴 때마다, 선택된 날짜의 달로 이동 + 선택 유지
  useEffect(() => {
    if (isOpen) {
      setVisibleMonth(toFirstDayOfMonth(safeSelected))
    }
  }, [isOpen, safeSelected])

  const markedDates = useMemo<MarkedDates>(
    () => ({
      [safeSelected]: { selected: true, selectedColor: '#57C9D0', selectedTextColor: '#fff' },
    }),
    [safeSelected]
  )

  const themeObj = useMemo(
    () => ({
      textDayFontSize: 14,
      textDayHeaderFontSize: 14,
      textMonthFontSize: 16,
      textMonthFontWeight: '600',
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

  const goToday = () => {
    setVisibleMonth(toFirstDayOfMonth(todayStr)) // 오늘이 포함된 달로 이동
    onSelect?.(todayStr) // 선택 날짜도 오늘로 갱신
  }

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendarFull}
        // initialDate 절대 넣지 말 것 (내부 상태와 충돌)
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
        renderArrow={(direction) =>
          direction === 'left' ? (
            <Image
              source={require('../../assets/images/arrow/left.svg')}
              style={{ width: 14, height: 14 }}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/arrow/right.svg')}
              style={{ width: 14, height: 14 }}
              resizeMode="contain"
            />
          )
        }
        renderHeader={(date) => {
          const y = date.getFullYear()
          const m = date.getMonth() + 1
          return (
            <View style={styles.header}>
              <Text style={styles.headerText}>{`${y}년 ${m}월`}</Text>
              {!isTodaySelected && (
                <TouchableOpacity onPress={goToday} activeOpacity={0.8} style={styles.todayBtn}>
                  <Text style={styles.todayBtnText}>오늘</Text>
                </TouchableOpacity>
              )}
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
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: { fontSize: 18, fontWeight: '600', color: '#040F20B2' },
  dayButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  todayBtn: {
    borderWidth: 1,
    borderColor: '#E6E7E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  todayBtnText: { color: '#81878F', fontSize: 12 },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarFull: {
    width: 320,
  },

  dayText: { fontSize: 14, fontWeight: 400 },
})
