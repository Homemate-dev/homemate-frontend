import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'

import Checkbox from '@/components/Checkbox'
import TabSafeScroll from '@/components/TabSafeScroll'
import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { useAuth } from '@/contexts/AuthContext'
import { useChoreByDate } from '@/libs/hooks/chore/useChoreByDate'
import { useChoreCalendar } from '@/libs/hooks/chore/useChoreCalendar'
import { usePatchChoreStatus } from '@/libs/hooks/chore/usePatchChoreStatus'
import { formatKoreanDate, getMonthRange } from '@/libs/utils/date'

import HomeCalendar from '../../components/Calendar/HomeCalendar'

export default function HomeScreen() {
  const router = useRouter()
  const { login } = useAuth()
  const androidTop = Platform.OS === 'android' ? 50 : 0

  const extra = Constants.expoConfig?.extra ?? {}
  const KAKAO_REDIRECT_URI = extra.KAKAO_REDIRECT_URI ?? ''
  const KAKAO_CODE_VERIFIER = extra.KAKAO_CODE_VERIFIER ?? ''

  const fetchKakaoToken = async (code: string) => {
    try {
      const response = await fetch(`https://homemate.io.kr/api/auth/login/kakao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorizationCode: code,
          redirectUri: KAKAO_REDIRECT_URI,
          codeVerifier: KAKAO_CODE_VERIFIER,
        }),
      })

      const data = await response.json()

      if (data.accessToken) {
        await login(data.accessToken)
        window.history.replaceState({}, document.title, '/')
      } else {
        console.warn('accessToken이 응답에 없습니다:', data)
      }
    } catch (error) {
      console.error('카카오 로그인 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    if (Platform.OS === 'web') {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        fetchKakaoToken(code)
      }
    }
  }, [])

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

  return (
    <View className="flex-1 bg-[#F8F8FA]">
      <StatusBar style="dark" backgroundColor="#F8F8FA" />

      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
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
                <Text className="font-semibold text-xl">안녕하세요, 사용자님!</Text>
                <Text className="text-base">
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

            <View className="mt-3 mb-2 h-[6px] w-full rounded-full bg-[#F5FCFC] overflow-hidden">
              <View
                className="h-full rounded-full bg-[#57C9D0]"
                style={{ width: `${progress}%`, borderRadius: 9999 }}
              />
            </View>
          </View>

          {/* 캘린더 */}
          <HomeCalendar
            onSelect={setSelectedDate}
            dotDates={dotDates}
            onMonthChangeRange={(start, end) => setRange({ start, end })}
          />

          {/* 할 일 목록 */}
          <View className="flex">
            <View className="flex-row gap-2 items-center mb-3">
              <Text className="text-xl font-bold">{formatKoreanDate(selectedDate)}</Text>
              <Text className="text-lg">집안일</Text>
            </View>

            <View className="bg-white rounded-2xl p-5">
              {isLoading && <Text>집안일 내역을 불러오는 중입니다.</Text>}
              {isError && <Text>집안일 내역 불러오기에 실패했습니다.</Text>}
              {!isLoading && !isError && choresList.length === 0 ? (
                <Text>사용자님의 하루 집안일을 계획해보세요</Text>
              ) : (
                choresList.map((item, index) => {
                  const key = getRepeatKey(item.repeatType, item.repeatInterval)
                  const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']

                  return (
                    <View
                      key={item.id}
                      className={`flex-row items-center justify-between ${
                        choresList.length === 1 || index === choresList.length - 1 ? '' : 'mb-3'
                      }`}
                    >
                      <View className="flex-row gap-3 items-center">
                        <Text
                          className={`rounded-[6px] px-2 py-[2px] text-sm ${
                            item.status === 'COMPLETED'
                              ? 'bg-[#CDCFD2] text-[#9B9FA6]'
                              : repeat.color
                          }`}
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
                            className={`text-base ${
                              item.status === 'COMPLETED'
                                ? 'text-gray-400 line-through'
                                : 'text-black'
                            }`}
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
    </View>
  )
}
