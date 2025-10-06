import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'

import Checkbox from '@/components/Checkbox'
import TabSafeScroll from '@/components/TabSafeScroll'
import { formatKoreanDate } from '@/libs/utils/date'

import HomeCalendar from '../../components/HomeCalendar'

type ChoreItem = {
  id: number
  choreId: number
  dueDate: string
  status: 'PENDING' | 'COMPLETED'
  completedAt: string | null
  chore: {
    title: string
    notification_yn: boolean
  }
}

export const dummyChoreList: ChoreItem[] = [
  {
    id: 1,
    choreId: 1,
    dueDate: '2025-10-02',
    status: 'PENDING',
    completedAt: null,
    chore: {
      title: '옷장 제습제 교체하기',
      notification_yn: true,
    },
  },

  {
    id: 2,
    choreId: 2,
    dueDate: '2025-10-05',
    status: 'COMPLETED',
    completedAt: '2025-10-05T11:40:00',
    chore: {
      title: '화분 물주기',
      notification_yn: false,
    },
  },
  {
    id: 3,
    choreId: 3,
    dueDate: '2025-10-05',
    status: 'PENDING',
    completedAt: null,
    chore: {
      title: '욕실 청소하기',
      notification_yn: true,
    },
  },
  {
    id: 4,
    choreId: 4,
    dueDate: '2025-10-05',
    status: 'PENDING',
    completedAt: null,
    chore: {
      title: '냉장고 정리하기',
      notification_yn: false,
    },
  },
  {
    id: 5,
    choreId: 5,
    dueDate: '2025-10-05',
    status: 'COMPLETED',
    completedAt: '2025-10-05T14:00:00',
    chore: {
      title: '거실 정리하기',
      notification_yn: true,
    },
  },

  {
    id: 6,
    choreId: 6,
    dueDate: '2025-10-07',
    status: 'PENDING',
    completedAt: null,
    chore: {
      title: '창문 닦기',
      notification_yn: true,
    },
  },
]

export default function HomeScreen() {
  const androidTop = Platform.OS === 'android' ? 50 : 0
  const router = useRouter()

  const todayStr = useMemo(() => {
    const t = new Date()
    const yyyy = t.getFullYear()
    const mm = String(t.getMonth() + 1).padStart(2, '0')
    const dd = String(t.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  const [selectedDate, setSelectedDate] = useState<string>(todayStr)

  const [chores, setChores] = useState<ChoreItem[]>(dummyChoreList)

  // 선택 날짜의 집안일만 필터
  const choresOfDay = useMemo(
    () => chores.filter((c) => c.dueDate === selectedDate),
    [chores, selectedDate]
  )

  const toggleChore = (id: number) => {
    setChores((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
              completedAt: item.status === 'PENDING' ? new Date().toISOString() : null,
            }
          : item
      )
    )
  }
  // 선택 날짜 기준 진행률
  const progress = useMemo(() => {
    const total = choresOfDay.length
    if (!total) return 0
    const done = choresOfDay.filter((c) => c.status === 'COMPLETED').length
    return Math.round((done / total) * 100)
  }, [choresOfDay])

  return (
    <>
      {/* StatusBar 색상 지정 */}
      <StatusBar backgroundColor="#F8F8FA" />

      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        {/* 헤더 */}
        <View className="py-4 flex-row items-center justify-between">
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

        <View className="flex gap-4">
          {/* 홈카드 */}
          <View className="bg-[#DDF4F6] px-5 py-3 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="flex gap-2">
                <Text className="font-semibold text-[18px]">안녕하세요, 사용자님!</Text>
                <Text className="text-[14px]">
                  오늘의 집안일을 <Text className="font-bold text-[#46A1A6]">{progress}%</Text>{' '}
                  완료했어요.
                </Text>
              </View>

              <Image
                source={require('../../assets/images/card/card-img.png')}
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
            </View>

            {/* 진행 바 */}
            <View className="mt-3 mb-2 h-[6px] w-full rounded-full bg-[#F5FCFC] overflow-hidden">
              <View
                className="h-full rounded-full bg-[#57C9D0]"
                style={{ width: `${progress}%`, borderRadius: 9999 }}
              />
            </View>
          </View>

          {/* 캘린더 */}
          <View className="">
            <HomeCalendar onSelect={setSelectedDate} />
          </View>
          {/* 할일 내역 */}
          <View className="flex">
            <View className="flex-row gap-2 items-center mb-3">
              <Text className="text-[18px] font-bold">{formatKoreanDate(selectedDate)}</Text>
              <Text className="text-[16px]">집안일</Text>
            </View>

            <View className="bg-white rounded-2xl p-5">
              {choresOfDay.length === 0 ? (
                <Text className="text-base">사용자님의 하루 집안일을 계획해보세요</Text>
              ) : (
                choresOfDay.map((item, idx) => (
                  <View key={item.id} className="flex-row items-center justify-between mb-3">
                    <View className="flex-row gap-3 items-center">
                      <Text
                        className={`rounded-[6px] px-2 py-1 text-xs ${
                          item.status === 'COMPLETED'
                            ? 'bg-[#CDCFD2] text-[#9B9FA6] '
                            : 'bg-[#DDF4F6] text-[#46A1A6] '
                        }  `}
                      >
                        매일
                      </Text>
                      <Text
                        className={`text-base ${
                          item.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-black'
                        }`}
                      >
                        {item.chore.title}
                      </Text>
                    </View>
                    <Checkbox
                      checked={item.status === 'COMPLETED'}
                      onChange={() => toggleChore(item.id)}
                      size={20}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </TabSafeScroll>
    </>
  )
}
