import { MaterialIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'

import { toFirstDayOfMonth, toYMD } from '@/libs/utils/date'

// 한국어 로케일 설정
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
  selectedDate?: string
  onSelect?: (dateString: string) => void
}

export default function DatePickerCalendar({ selectedDate, onSelect }: Props) {
  const todayStr = useMemo(() => toYMD(new Date()), [])
  const [currentMonthStr, setCurrentMonthStr] = useState(() =>
    toFirstDayOfMonth(selectedDate ?? todayStr)
  )

  const markedDates = useMemo<MarkedDates>(() => {
    if (!selectedDate) return {}
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: '#57C9D0',
        selectedTextColor: '#fff',
      },
    }
  }, [selectedDate])

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
        week: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 0,
        },
      },
    }),
    []
  )

  const calendarKey = useMemo(
    () => `calendar-${JSON.stringify(themeObj)}-${currentMonthStr}`,
    [themeObj, currentMonthStr]
  )

  return (
    <View style={styles.container}>
      <Calendar
        key={calendarKey}
        current={currentMonthStr}
        onMonthChange={(d) => {
          const first = `${d.year}-${String(d.month).padStart(2, '0')}-01`
          setCurrentMonthStr(first)
        }}
        onDayPress={(d) => onSelect?.(d.dateString)}
        markedDates={markedDates}
        hideExtraDays
        enableSwipeMonths
        theme={themeObj as any}
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
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040F20B2',
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '400',
  },
})
