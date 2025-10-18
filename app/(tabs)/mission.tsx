import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BadgeCard from '@/components/Badge/BadgeCard'
import BadgeDetail from '@/components/BadgeDetail'
import TabSafeScroll from '@/components/TabSafeScroll'
import { useMonthlyMissions } from '@/libs/hooks/mission/useMonthlyMissions'

const mockBadges = [
  {
    id: 1,
    title: '미션 7회 달성',
    current: 6,
    target: 7,
    desc: '7개의 미션을 완료하면 받을 수 있는 도전 뱃지예요.',
    icon: require('@/assets/images/chore-home.png'),
  },
  {
    id: 2,
    title: '욕실 깔끔이',
    current: 28,
    target: 30,
    desc: '욕실 청소 미션을 30회 완수하면 획득할 수 있는 청결의 상징 뱃지예요.',
    icon: require('@/assets/images/chore-home.png'),
  },
  {
    id: 3,
    title: '침실 반짝이',
    current: 89,
    target: 90,
    desc: '침실 정리 미션을 90회 달성하면 얻을 수 있는 정리왕 뱃지예요.',
    icon: require('@/assets/images/chore-home.png'),
  },
]

export default function Mission() {
  const androidTop = Platform.OS === 'android' ? 50 : 0

  // 이달의 미션 api
  const { data: missions, isLoading, isError } = useMonthlyMissions()

  // 뱃지 상세 보기
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = mockBadges.find((badge) => badge.id === selectedId)

  // 미션 진행률
  const progress = (cur: number, tgt: number) =>
    tgt ? Math.min(100, Math.round((cur * 100) / tgt)) : 0

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        <View className="bg-[#F8F8FA]">
          {/* 헤더 */}
          <View className="items-center my-4">
            <Text className="text-2xl font-semibold ">미션</Text>
          </View>

          {/* 이달의 미션 */}

          <View className="flex mb-6">
            <Text className="text-xl font-bold mb-[10px]">이 달의 미션</Text>

            <View className="bg-white p-5 rounded-xl mb-[10px]">
              {isLoading && (
                <View className="py-6 items-center justify-center">
                  <ActivityIndicator />
                </View>
              )}

              {isError && !isLoading && (
                <Text className="text-[#D64545]">이달의 미션을 불러오지 못했어요.</Text>
              )}

              {!isLoading && !isError && (missions?.length ?? 0) === 0 && (
                <Text className="text-[#686F79]">아직 등록된 이달의 미션이 없어요.</Text>
              )}

              {!isLoading &&
                !isError &&
                missions?.map((m, idx) => (
                  <View
                    key={m.id}
                    className={`${missions.length === 1 || idx === missions.length - 1 ? '' : 'mb-3'}`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base">{m.title}</Text>
                      <Text className="text-base text-[#B4B7BC]">
                        <Text className="font-semibold text-[#57C9D0]">{m.currentCount}개 </Text>/{' '}
                        {m.targetCount}개
                      </Text>
                    </View>

                    <View className="mt-3 mb-2 h-[8px] w-full rounded-full bg-[#040F2014] overflow-hidden">
                      <View
                        className="h-full rounded-full bg-[#57C9D0]"
                        style={{
                          width: `${progress(m.currentCount, m.targetCount)}%`,
                          borderRadius: 9999,
                        }}
                      />
                    </View>
                  </View>
                ))}
            </View>

            <View className="flex-row">
              <Text className="mr-1">⭐</Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-[#686F79]">추천 카테고리에서 추가해보세요!</Text>
                <Image
                  source={require('../../assets/images/arrow/right-inactive.png')}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* 곧 획듣하는 뱃지 */}
          <View>
            <Text className="text-xl font-bold mb-[10px]">곧 획득하는 뱃지</Text>
            <View className="bg-white p-5 rounded-xl mb-[12px]">
              <View className="flex-row justify-between">
                {mockBadges.map((b) => (
                  <View key={b.id} className="items-center">
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedId(b.id)}>
                      <BadgeCard
                        icon={require('@/assets/images/chore-home.png')}
                        size={84}
                        iconSize={82}
                      />
                    </TouchableOpacity>
                    <Text className="text-base text-[#4F5763] mt-2">{b.title}</Text>
                    <Text className="text-base text-[#B4B7BC] mt-2">
                      <Text className="text-[#57C9D0] font-semibold">{b.current}회</Text> /{' '}
                      {b.target}회
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/mybadges')}
              className="h-[52px] bg-[#DDF4F6] items-center justify-center rounded-xl"
            >
              <Text className="text-[#46A1A6] text-lg font-semibold">뱃지 더보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TabSafeScroll>
      {selected && (
        <BadgeDetail badge={selected} variant="mission" onClose={() => setSelectedId(null)} />
      )}
    </>
  )
}
