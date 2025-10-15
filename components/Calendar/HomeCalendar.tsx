import { useMemo, useState } from 'react'
import { Image, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
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
  dotDates?: string[]
  onMonthChangeRange?: (start: string, end: string) => void
}

export default function HomeCalendar({ onSelect, dotDates = [], onMonthChangeRange }: Props) {
  // 오늘
  const todayStr = useMemo(() => toYMD(new Date()), [])
  // 선택된 날짜(초기: 오늘)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  // 보이는 달(초기: 오늘이 속한 달의 1일)
  const [currentMonthStr, setCurrentMonthStr] = useState<string>(() => toFirstDayOfMonth(todayStr))

  // 점 표시할 날짜
  const dotSet = useMemo(() => new Set(dotDates), [dotDates])

  // 테마
  const themeObj = useMemo(
    () => ({
      textDayFontSize: 16,
      textDayHeaderFontSize: 14,
      textMonthFontSize: 18,
      textMonthFontWeight: '700',
      monthTextColor: '#0F172A',
      arrowColor: '#57C9D0',
      // 주(week) 줄
      'stylesheet.calendar.main': {
        week: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 0,
        },
      },
      // 헤더 영역
      'stylesheet.calendar.header': {
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        },

        dayHeader: {
          fontSize: 14,
          marginBottom: 16,
          color: '#040F2080',
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
        customStyles: {
          container: { backgroundColor: '#57C9D0', borderRadius: 8 } as ViewStyle,
          text: { color: '#fff', fontWeight: '700' } as TextStyle,
        },
      },
    }
  }, [selectedDate])

  return (
    <View className="rounded-2xl overflow-hidden">
      <Calendar
        key={calendarKey}
        current={currentMonthStr}
        onMonthChange={(d) => {
          const first = `${d.year}-${String(d.month).padStart(2, '0')}-01`
          setCurrentMonthStr(first)

          const last = new Date(d.year, d.month, 0) // 다음달 0일 = 말일
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
        // PNG 화살표
        renderArrow={(direction) =>
          direction === 'left' ? (
            <Image
              source={require('../../assets/images/arrow/left.png')}
              className="w-[14px] h-[14px]"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/arrow/right.png')}
              className="w-[14px] h-[14px]"
              resizeMode="contain"
            />
          )
        }
        // 달력 바깥 여백
        className="p-5"
        // 헤더
        renderHeader={(date) => {
          const y = date.getFullYear()
          const m = date.getMonth() + 1
          return (
            <View className="flex-row items-center justify-between gap-1">
              <Text className="text-lg font-semibold text-[#040F20B2]">{`${y}년 ${m}월`}</Text>
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
        // 데이 셀
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
              className="flex-1 w-full h-full items-center justify-center"
            >
              <View
                className="w-[90%] aspect-square rounded-lg items-center justify-center relative"
                style={marking?.customStyles?.container}
              >
                <Text
                  className="text-base font-normal"
                  style={{
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                    color: fallbackTextColor,
                    ...(marking?.customStyles?.text ?? {}),
                  }}
                >
                  {d?.day}
                </Text>

                {d?.dateString && dotSet.has(d.dateString) && (
                  <View
                    className={`w-[5px] h-[5px] rounded-full absolute bottom-[6px] ${isSelected ? 'bg-white' : 'bg-[#57C9D0]'}`}
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
