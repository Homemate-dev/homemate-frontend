import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BadgeCard from '@/components/BadgeCard'
import BadgeDetail from '@/components/BadgeDetail'

export type BadgeTier = { name: string; count: number }
export type SectionBadges = { section: string; badges: BadgeTier[] }
export type SpaceBadges = { space: string; badges: BadgeTier[] }
export type ChoreBadges = { chore: string; badges: BadgeTier[] }

export type MyBadge = {
  id: number
  title: string
  current: number
  target: number
  desc: string
  icon: ImageSourcePropType
  section: string
  chore?: string
  earned: boolean
  earnedAt?: string
}

const myBadges: MyBadge[] = [
  // ─────────────── 시작 ───────────────
  {
    id: 1,
    title: '시작이반',
    current: 1,
    target: 1,
    desc: '첫 시작! 시작 미션을 1회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '시작',
    earned: true,
    earnedAt: '2025-10-01',
  },

  // ─────────────── 전체 집안일 ───────────────
  {
    id: 100,
    title: '새싹 살림꾼',
    current: 45,
    target: 100,
    desc: '완료한 집안일 수 누적 100회를 달성하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '전체 집안일',
    earned: false,
  },
  {
    id: 101,
    title: '알뜰 살림꾼',
    current: 200,
    target: 200,
    desc: '완료한 집안일 수 누적 200회를 달성하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '전체 집안일',
    earned: true,
    earnedAt: '2025-09-20',
  },
  {
    id: 102,
    title: '살림 마스터',
    current: 260,
    target: 300,
    desc: '완료한 집안일 수 누적 300회를 달성하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '전체 집안일',
    earned: false,
  },

  // ─────────────── 집안일 등록 ───────────────
  {
    id: 200,
    title: '소문자 J',
    current: 30,
    target: 30,
    desc: '집안일을 총 30회 등록하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '집안일 등록',
    earned: true,
    earnedAt: '2025-08-25',
  },
  {
    id: 201,
    title: '대문자 J',
    current: 58,
    target: 90,
    desc: '집안일을 총 90회 등록하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '집안일 등록',
    earned: false,
  },
  {
    id: 202,
    title: '파워 J',
    current: 70,
    target: 180,
    desc: '집안일을 총 180회 등록하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '집안일 등록',
    earned: false,
  },

  // ─────────────── 미션 달성 ───────────────
  {
    id: 300,
    title: '미션 새싹',
    current: 3,
    target: 3,
    desc: '미션 달성 횟수 누적 3회를 달성하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '미션 달성',
    earned: true,
    earnedAt: '2025-10-02',
  },
  {
    id: 301,
    title: '미션 달인',
    current: 9,
    target: 18,
    desc: '미션 달성 횟수 누적 18회를 달성하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '미션 달성',
    earned: false,
  },
  {
    id: 302,
    title: '미션 마스터',
    current: 15,
    target: 36,
    desc: '미션 달성 횟수 누적 36회를 달성하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '미션 달성',
    earned: false,
  },

  // ─────────────── 주방 ───────────────
  {
    id: 400,
    title: '주방 깔끔이',
    current: 28,
    target: 30,
    desc: '주방 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '주방',
    earned: false,
  },
  {
    id: 401,
    title: '주방 반짝이',
    current: 90,
    target: 90,
    desc: '주방 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '주방',
    earned: true,
    earnedAt: '2025-09-12',
  },
  {
    id: 402,
    title: '주방 번쩍이',
    current: 120,
    target: 180,
    desc: '주방 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '주방',
    earned: false,
  },

  // ─────────────── 욕실 ───────────────
  {
    id: 500,
    title: '욕실 깔끔이',
    current: 30,
    target: 30,
    desc: '욕실 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '욕실',
    earned: true,
    earnedAt: '2025-08-14',
  },
  {
    id: 501,
    title: '욕실 반짝이',
    current: 62,
    target: 90,
    desc: '욕실 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '욕실',
    earned: false,
  },
  {
    id: 502,
    title: '욕실 번쩍이',
    current: 90,
    target: 180,
    desc: '욕실 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '욕실',
    earned: false,
  },

  // ─────────────── 침실 ───────────────
  {
    id: 600,
    title: '침실 깔끔이',
    current: 22,
    target: 30,
    desc: '침실 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '침실',
    earned: false,
  },
  {
    id: 601,
    title: '침실 반짝이',
    current: 90,
    target: 90,
    desc: '침실 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '침실',
    earned: true,
    earnedAt: '2025-10-06',
  },
  {
    id: 602,
    title: '침실 번쩍이',
    current: 112,
    target: 180,
    desc: '침실 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '침실',
    earned: false,
  },

  // ─────────────── 현관 ───────────────
  {
    id: 700,
    title: '현관 깔끔이',
    current: 30,
    target: 30,
    desc: '현관 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '현관',
    earned: true,
    earnedAt: '2025-09-02',
  },
  {
    id: 701,
    title: '현관 반짝이',
    current: 88,
    target: 90,
    desc: '현관 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '현관',
    earned: false,
  },
  {
    id: 702,
    title: '현관 번쩍이',
    current: 0,
    target: 180,
    desc: '현관 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '현관',
    earned: false,
  },

  // ─────────────── 빨래하기 ───────────────
  {
    id: 800,
    title: '뽀송 새싹',
    current: 30,
    target: 30,
    desc: '‘빨래하기’를 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '빨래하기',
    earned: true,
    earnedAt: '2025-09-14',
  },
  {
    id: 801,
    title: '뽀송 달인',
    current: 55,
    target: 90,
    desc: '‘빨래하기’를 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '빨래하기',
    earned: false,
  },
  {
    id: 802,
    title: '뽀송 마스터',
    current: 100,
    target: 180,
    desc: '‘빨래하기’를 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '빨래하기',
    earned: false,
  },

  // ─────────────── 거울/수전 물때 닦기 ───────────────
  {
    id: 900,
    title: '물때 지우개',
    current: 30,
    target: 30,
    desc: '‘거울/수전 물때 닦기’를 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '거울/수전 물때 닦기',
    earned: true,
    earnedAt: '2025-09-30',
  },
  {
    id: 901,
    title: '물때 사냥꾼',
    current: 80,
    target: 90,
    desc: '‘거울/수전 물때 닦기’를 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '거울/수전 물때 닦기',
    earned: false,
  },
  {
    id: 902,
    title: '물때 박멸자',
    current: 95,
    target: 180,
    desc: '‘거울/수전 물때 닦기’를 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '거울/수전 물때 닦기',
    earned: false,
  },

  // ─────────────── 소화기 점검 ───────────────
  {
    id: 1000,
    title: '우리집 소방관',
    current: 2,
    target: 2,
    desc: '‘소화기 점검’을 2회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '소화기 점검',
    earned: true,
    earnedAt: '2025-08-05',
  },

  // ─────────────── 바닥 청소기 돌리기 ───────────────
  {
    id: 1100,
    title: '쓱쓱요정',
    current: 20,
    target: 30,
    desc: '‘바닥 청소기 돌리기’를 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '바닥 청소기 돌리기',
    earned: false,
  },
  {
    id: 1101,
    title: '싹싹요정',
    current: 90,
    target: 90,
    desc: '‘바닥 청소기 돌리기’를 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '바닥 청소기 돌리기',
    earned: true,
    earnedAt: '2025-09-22',
  },
  {
    id: 1102,
    title: '쓱싹요정',
    current: 100,
    target: 180,
    desc: '‘바닥 청소기 돌리기’를 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '바닥 청소기 돌리기',
    earned: false,
  },

  // ─────────────── 기상후 침구 정리하기 ───────────────
  {
    id: 1200,
    title: '상쾌한모닝',
    current: 30,
    target: 30,
    desc: '‘기상후 침구 정리하기’를 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '기상후 침구 정리하기',
    earned: true,
    earnedAt: '2025-09-10',
  },
  {
    id: 1201,
    title: '개운한모닝',
    current: 88,
    target: 90,
    desc: '‘기상후 침구 정리하기’를 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '기상후 침구 정리하기',
    earned: false,
  },
  {
    id: 1202,
    title: '미라클모닝',
    current: 120,
    target: 180,
    desc: '‘기상후 침구 정리하기’를 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '기상후 침구 정리하기',
    earned: false,
  },

  // ─────────────── 쓰레기통 비우기 ───────────────
  {
    id: 1300,
    title: '쓰레기 텅',
    current: 30,
    target: 30,
    desc: '‘쓰레기통 비우기’를 총 30회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '쓰레기통 비우기',
    earned: true,
    earnedAt: '2025-10-04',
  },
  {
    id: 1301,
    title: '쓰레기 텅텅',
    current: 85,
    target: 90,
    desc: '‘쓰레기통 비우기’를 총 90회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '쓰레기통 비우기',
    earned: false,
  },
  {
    id: 1302,
    title: '텅텅 비움이',
    current: 110,
    target: 180,
    desc: '‘쓰레기통 비우기’를 총 180회 완료하면 받을 수 있어요.',
    icon: require('@/assets/images/chore-home.png'),
    section: '쓰레기통 비우기',
    earned: false,
  },
]

const SECTION_ORDER = [
  '시작',
  '전체 집안일',
  '집안일 등록',
  '미션 달성',
  '주방',
  '욕실',
  '침실',
  '현관',
  // 집안일별 (세부 chore 그룹)
  '빨래하기',
  '거울/수전 물때 닦기',
  '소화기 점검',
  '바닥 청소기 돌리기',
  '기상후 침구 정리하기',
  '쓰레기통 비우기',
]

export default function Mission() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = myBadges.find((badge) => badge.id === selectedId)

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />

      <ScrollView className="bg-[#F8F8FA] px-5 pt-6">
        {/* 헤더 */}
        <View className="flex-row items-center justify-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="absolute left-0">
            <MaterialIcons name="chevron-left" size={24} color="#686F79" />
          </TouchableOpacity>
          <Text className="text-[22px] font-semibold">나의 뱃지</Text>
        </View>

        {/* 뱃지 */}
        {SECTION_ORDER.map((sec) => {
          const items: MyBadge[] = myBadges.filter((b) => b.section === sec)

          if (items.length === 0) return null

          return (
            <View key={sec} className="mb-6">
              <Text className="text-lg font-semibold mb-[18px]">{sec}</Text>

              <View className="flex-row justify-between">
                {items.map((b) => (
                  <View key={b.id} className="items-center">
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedId(b.id)}>
                      <BadgeCard
                        icon={b.icon}
                        size={100}
                        iconSize={100}
                        earned={b.current === b.target}
                      />
                    </TouchableOpacity>

                    <Text className="text-base mt-2">{b.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          )
        })}
      </ScrollView>

      {selected && (
        <BadgeDetail badge={selected} variant="mine" onClose={() => setSelectedId(null)} />
      )}
    </>
  )
}
