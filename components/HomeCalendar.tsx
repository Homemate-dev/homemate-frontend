import { MaterialIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
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
  onSelect?: (dateString: string) => void // 선택 날짜 부모로 올려줄 콜백
}

export default function HomeCalendar({ onSelect }: Props) {
  // 오늘
  const todayStr = useMemo(() => toYMD(new Date()), [])
  // 선택된 날짜(초기: 오늘)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  // 보이는 달(초기: 오늘이 속한 달의 1일)
  const [currentMonthStr, setCurrentMonthStr] = useState<string>(() => toFirstDayOfMonth(todayStr))

  // 테마
  const themeObj = useMemo(
    () => ({
      textDayFontSize: 14,
      textDayHeaderFontSize: 14,
      textMonthFontSize: 16,
      textMonthFontWeight: '700',
      monthTextColor: '#0F172A',
      arrowColor: '#57C9D0',
      'stylesheet.calendar.main': {
        week: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 2,
        },
      },
    }),
    []
  )

  const calendarKey = useMemo(
    () => `calendar-${JSON.stringify(themeObj)}-${currentMonthStr}`,
    [themeObj, currentMonthStr]
  )

  // 오늘 버튼
  const goToday = () => {
    setSelectedDate(todayStr) // 오늘 선택
    onSelect?.(todayStr)
    setCurrentMonthStr(toFirstDayOfMonth(todayStr)) // 오늘의 달로 이동
  }

  // 오늘 버튼 노출: 선택된 날짜가 있고, 오늘이 아닐 때만
  const showTodayBtn = selectedDate !== '' && selectedDate !== todayStr

  // 마킹: 선택된 날짜만 커스텀 스타일
  const markedDates = useMemo<MarkedDates>(() => {
    if (!selectedDate) return {}
    return {
      [selectedDate]: {
        // TS가 customStyles를 모를 수 있어서 any/캐스팅 처리
        customStyles: {
          container: { backgroundColor: '#57C9D0', borderRadius: 8 } as ViewStyle,
          text: { color: '#fff', fontWeight: '700' } as TextStyle,
        },
      },
    }
  }, [selectedDate])

  return (
    <View style={{ borderRadius: 12 }}>
      <View style={{ borderRadius: 12, overflow: 'hidden' }}>
        <Calendar
          key={calendarKey}
          current={currentMonthStr}
          onMonthChange={(d) => {
            const first = `${d.year}-${String(d.month).padStart(2, '0')}-01`
            setCurrentMonthStr(first)
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
              <MaterialIcons name="chevron-left" size={28} color="#57C9D0" />
            ) : (
              <MaterialIcons name="chevron-right" size={28} color="#57C9D0" />
            )
          }
          renderHeader={(date) => {
            const y = date.getFullYear()
            const m = date.getMonth() + 1
            return (
              <View className="flex-row items-center justify-between px-5 py-3 gap-1">
                <Text className="text-[16px] font-semibold text-[#040F20B2]">{`${y}년 ${m}월`}</Text>
                {showTodayBtn && (
                  <TouchableOpacity
                    className="border border-[#57C9D0] rounded-md px-1 py-[2px]"
                    onPress={goToday}
                    activeOpacity={0.8}
                  >
                    <Text className="text-[#57C9D0]">오늘</Text>
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

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPress?.(date)}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={[
                    {
                      width: '90%',
                      aspectRatio: 1,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    marking?.customStyles?.container,
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: 14,
                        includeFontPadding: false,
                        textAlignVertical: 'center',
                        color: fallbackTextColor,
                        fontWeight: '400',
                      },
                      marking?.customStyles?.text,
                    ]}
                  >
                    {d?.day}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}
