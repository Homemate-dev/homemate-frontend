import { useMemo, useState } from 'react'
import { Image, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'

import { toFirstDayOfMonth, toYMD } from '@/libs/utils/date'

// ── 한국어 로케일
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

type Props = {
  onSelect?: (dateString: string) => void
  dotDates?: string[]
  onMonthChangeRange?: (start: string, end: string) => void
}

export default function HomeCalendar({ onSelect, dotDates = [], onMonthChangeRange }: Props) {
  const todayStr = useMemo(() => toYMD(new Date()), [])
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const [currentMonthStr, setCurrentMonthStr] = useState<string>(() => toFirstDayOfMonth(todayStr))

  const dotSet = useMemo(() => new Set(dotDates), [dotDates])

  const themeObj = useMemo(
    () => ({
      // ---- 기본 텍스트 스타일 ----
      textDayFontSize: 14,
      textDayFontFamily: 'Pretendard',
      textDayHeaderFontSize: 14,
      textDayHeaderFontFamily: 'Pretendard',
      textMonthFontSize: 16,
      textMonthFontFamily: 'Pretendard',
      textMonthFontWeight: '600',

      // ---- 색상 ----
      monthTextColor: '#0F172A',
      arrowColor: '#57C9D0',

      // ---- 캘린더 구조 커스텀 ----
      'stylesheet.calendar.main': {
        container: { padding: 20, backgroundColor: '#FFFFFF' },
        week: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 0 },
      },
      'stylesheet.calendar.header': {
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          paddingHorizontal: 6,
        },
        dayHeader: { fontFamily: 'Pretendard', fontSize: 16, marginBottom: 8, color: '#040F2080' },
      },
    }),
    []
  )

  const calendarKey = useMemo(
    () => `calendar-${JSON.stringify(themeObj)}-${currentMonthStr}`,
    [themeObj, currentMonthStr]
  )

  const goToday = () => {
    setSelectedDate(todayStr)
    onSelect?.(todayStr)
    setCurrentMonthStr(toFirstDayOfMonth(todayStr))
  }

  const showTodayBtn = selectedDate !== '' && selectedDate !== todayStr

  const markedDates = useMemo<MarkedDates>(() => {
    if (!selectedDate) return {}
    return {
      [selectedDate]: {
        customStyles: {
          container: { backgroundColor: '#57C9D0', borderRadius: 8 } as ViewStyle,
          text: { color: '#fff', fontWeight: '700' } as TextStyle,
        },
      },
    }
  }, [selectedDate])

  return (
    <View style={styles.container}>
      <Calendar
        key={calendarKey}
        current={currentMonthStr}
        onMonthChange={(d) => {
          const first = `${d.year}-${String(d.month).padStart(2, '0')}-01`
          setCurrentMonthStr(first)
          const last = new Date(d.year, d.month, 0)
          const pad = (n: number) => String(n).padStart(2, '0')
          const end = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`
          onMonthChangeRange?.(first, end)
        }}
        onDayPress={(d) => {
          onSelect?.(d.dateString)
          setSelectedDate(d.dateString)
        }}
        markingType="custom"
        markedDates={markedDates}
        theme={themeObj as any}
        enableSwipeMonths
        hideExtraDays
        renderArrow={(direction) =>
          direction === 'left' ? (
            <Image
              source={require('../../assets/images/arrow/left.png')}
              style={{ width: 14, height: 14 }}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/arrow/right.png')}
              style={{ width: 14, height: 14 }}
              resizeMode="contain"
            />
          )
        }
        renderHeader={(date) => {
          const y = date.getFullYear()
          const m = date.getMonth() + 1
          return (
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{`${y}년 ${m}월`}</Text>
              {showTodayBtn && (
                <TouchableOpacity onPress={goToday} activeOpacity={0.8} style={styles.todayBtn}>
                  <Text style={styles.todayBtnText}>오늘</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }}
        dayComponent={({ date, state, marking, onPress }) => {
          const d = date
          const isToday = d?.dateString === todayStr || state === 'today'
          const baseColor = '#040F20'
          const todayColor = '#57C9D0'
          const fallbackTextColor = isToday ? todayColor : baseColor
          const isSelected = d?.dateString === selectedDate

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPress?.(date)}
              style={styles.dayBtn}
            >
              <View style={[styles.dayCell, marking?.customStyles?.container]}>
                <Text
                  style={[
                    styles.dayLabel,
                    { color: fallbackTextColor },
                    (marking?.customStyles?.text as TextStyle) ?? {},
                  ]}
                >
                  {d?.day}
                </Text>

                {d?.dateString && dotSet.has(d.dateString) && (
                  <View
                    style={[styles.dot, { backgroundColor: isSelected ? '#FFFFFF' : '#57C9D0' }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, overflow: 'hidden' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  headerTitle: { fontFamily: 'pretendard', fontSize: 18, fontWeight: '600', color: '#040F20B2' },
  todayBtn: {
    borderWidth: 1,
    borderColor: '#E6E7E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 5,
  },
  todayBtnText: { fontFamily: 'pretendard', color: '#81878F', fontSize: 12 },
  dayBtn: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayLabel: {
    fontFamily: 'pretendard',
    fontSize: 14,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  dot: { width: 5, height: 5, borderRadius: 9999, position: 'absolute', bottom: 6 },
})
