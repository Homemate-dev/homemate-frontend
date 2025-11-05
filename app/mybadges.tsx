import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BadgeCard from '@/components/Badge/BadgeCard'
import BadgeDetail from '@/components/BadgeDetail'
import { useAcquiredBadges } from '@/libs/hooks/badge/useAcquiredBadges'
import { getBadgeSection, SECTION_ORDER } from '@/libs/utils/badgeSectionMap'
import { ResponseBadge } from '@/types/badge'

export type BadgeTier = { name: string; count: number }
export type SectionBadges = { section: string; badges: BadgeTier[] }
export type SpaceBadges = { space: string; badges: BadgeTier[] }
export type ChoreBadges = { chore: string; badges: BadgeTier[] }

// const myBadges: MyBadge[] = [
//   {
//     id: 1,
//     title: '시작이반',
//     current: 1,
//     target: 1,
//     desc: '첫 시작! 시작 미션을 1회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '시작',
//     acquired: true,
//     earnedAt: '2025-10-01',
//   },
//   {
//     id: 100,
//     title: '새싹 살림꾼',
//     current: 45,
//     target: 100,
//     desc: '완료한 집안일 수 누적 100회를 달성하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '전체 집안일',
//     acquired: false,
//   },
//   {
//     id: 101,
//     title: '알뜰 살림꾼',
//     current: 200,
//     target: 200,
//     desc: '완료한 집안일 수 누적 200회를 달성하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '전체 집안일',
//     acquired: true,
//     earnedAt: '2025-09-20',
//   },
//   {
//     id: 102,
//     title: '살림 마스터',
//     current: 260,
//     target: 300,
//     desc: '완료한 집안일 수 누적 300회를 달성하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '전체 집안일',
//     acquired: false,
//   },
//   {
//     id: 200,
//     title: '소문자 J',
//     current: 30,
//     target: 30,
//     desc: '집안일을 총 30회 등록하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '집안일 등록',
//     acquired: true,
//     earnedAt: '2025-08-25',
//   },
//   {
//     id: 201,
//     title: '대문자 J',
//     current: 58,
//     target: 90,
//     desc: '집안일을 총 90회 등록하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '집안일 등록',
//     acquired: false,
//   },
//   {
//     id: 202,
//     title: '파워 J',
//     current: 70,
//     target: 180,
//     desc: '집안일을 총 180회 등록하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '집안일 등록',
//     acquired: false,
//   },
//   {
//     id: 300,
//     title: '미션 새싹',
//     current: 3,
//     target: 3,
//     desc: '미션 달성 횟수 누적 3회를 달성하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '미션 달성',
//     acquired: true,
//     earnedAt: '2025-10-02',
//   },
//   {
//     id: 301,
//     title: '미션 달인',
//     current: 9,
//     target: 18,
//     desc: '미션 달성 횟수 누적 18회를 달성하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '미션 달성',
//     acquired: false,
//   },
//   {
//     id: 302,
//     title: '미션 마스터',
//     current: 15,
//     target: 36,
//     desc: '미션 달성 횟수 누적 36회를 달성하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '미션 달성',
//     acquired: false,
//   },
//   {
//     id: 400,
//     title: '주방 깔끔이',
//     current: 28,
//     target: 30,
//     desc: '주방 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '주방',
//     acquired: false,
//   },
//   {
//     id: 401,
//     title: '주방 반짝이',
//     current: 90,
//     target: 90,
//     desc: '주방 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '주방',
//     acquired: true,
//     earnedAt: '2025-09-12',
//   },
//   {
//     id: 402,
//     title: '주방 번쩍이',
//     current: 120,
//     target: 180,
//     desc: '주방 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '주방',
//     acquired: false,
//   },
//   {
//     id: 500,
//     title: '욕실 깔끔이',
//     current: 30,
//     target: 30,
//     desc: '욕실 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '욕실',
//     acquired: true,
//     earnedAt: '2025-08-14',
//   },
//   {
//     id: 501,
//     title: '욕실 반짝이',
//     current: 62,
//     target: 90,
//     desc: '욕실 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '욕실',
//     acquired: false,
//   },
//   {
//     id: 502,
//     title: '욕실 번쩍이',
//     current: 90,
//     target: 180,
//     desc: '욕실 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '욕실',
//     acquired: false,
//   },
//   {
//     id: 600,
//     title: '침실 깔끔이',
//     current: 22,
//     target: 30,
//     desc: '침실 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '침실',
//     acquired: false,
//   },
//   {
//     id: 601,
//     title: '침실 반짝이',
//     current: 90,
//     target: 90,
//     desc: '침실 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '침실',
//     acquired: true,
//     earnedAt: '2025-10-06',
//   },
//   {
//     id: 602,
//     title: '침실 번쩍이',
//     current: 112,
//     target: 180,
//     desc: '침실 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '침실',
//     acquired: false,
//   },
//   {
//     id: 700,
//     title: '현관 깔끔이',
//     current: 30,
//     target: 30,
//     desc: '현관 공간의 집안일을 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '현관',
//     acquired: true,
//     earnedAt: '2025-09-02',
//   },
//   {
//     id: 701,
//     title: '현관 반짝이',
//     current: 88,
//     target: 90,
//     desc: '현관 공간의 집안일을 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '현관',
//     acquired: false,
//   },
//   {
//     id: 702,
//     title: '현관 번쩍이',
//     current: 0,
//     target: 180,
//     desc: '현관 공간의 집안일을 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '현관',
//     acquired: false,
//   },
//   {
//     id: 800,
//     title: '뽀송 새싹',
//     current: 30,
//     target: 30,
//     desc: '‘빨래하기’를 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '빨래하기',
//     acquired: true,
//     earnedAt: '2025-09-14',
//   },
//   {
//     id: 801,
//     title: '뽀송 달인',
//     current: 55,
//     target: 90,
//     desc: '‘빨래하기’를 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '빨래하기',
//     acquired: false,
//   },
//   {
//     id: 802,
//     title: '뽀송 마스터',
//     current: 100,
//     target: 180,
//     desc: '‘빨래하기’를 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '빨래하기',
//     acquired: false,
//   },
//   {
//     id: 900,
//     title: '물때 지우개',
//     current: 30,
//     target: 30,
//     desc: '‘거울/수전 물때 닦기’를 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '거울/수전 물때 닦기',
//     acquired: true,
//     earnedAt: '2025-09-30',
//   },
//   {
//     id: 901,
//     title: '물때 사냥꾼',
//     current: 80,
//     target: 90,
//     desc: '‘거울/수전 물때 닦기’를 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '거울/수전 물때 닦기',
//     acquired: false,
//   },
//   {
//     id: 902,
//     title: '물때 박멸자',
//     current: 95,
//     target: 180,
//     desc: '‘거울/수전 물때 닦기’를 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '거울/수전 물때 닦기',
//     acquired: false,
//   },
//   {
//     id: 1000,
//     title: '우리집 소방관',
//     current: 2,
//     target: 2,
//     desc: '‘소화기 점검’을 2회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '소화기 점검',
//     acquired: true,
//     earnedAt: '2025-08-05',
//   },
//   {
//     id: 1100,
//     title: '쓱쓱요정',
//     current: 20,
//     target: 30,
//     desc: '‘바닥 청소기 돌리기’를 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '바닥 청소기 돌리기',
//     acquired: false,
//   },
//   {
//     id: 1101,
//     title: '싹싹요정',
//     current: 90,
//     target: 90,
//     desc: '‘바닥 청소기 돌리기’를 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '바닥 청소기 돌리기',
//     acquired: true,
//     earnedAt: '2025-09-22',
//   },
//   {
//     id: 1102,
//     title: '쓱싹요정',
//     current: 100,
//     target: 180,
//     desc: '‘바닥 청소기 돌리기’를 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '바닥 청소기 돌리기',
//     acquired: false,
//   },
//   {
//     id: 1200,
//     title: '상쾌한모닝',
//     current: 30,
//     target: 30,
//     desc: '‘기상후 침구 정리하기’를 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '기상후 침구 정리하기',
//     acquired: true,
//     earnedAt: '2025-09-10',
//   },
//   {
//     id: 1201,
//     title: '개운한모닝',
//     current: 88,
//     target: 90,
//     desc: '‘기상후 침구 정리하기’를 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '기상후 침구 정리하기',
//     acquired: false,
//   },
//   {
//     id: 1202,
//     title: '미라클모닝',
//     current: 120,
//     target: 180,
//     desc: '‘기상후 침구 정리하기’를 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '기상후 침구 정리하기',
//     acquired: false,
//   },
//   {
//     id: 1300,
//     title: '쓰레기 텅',
//     current: 30,
//     target: 30,
//     desc: '‘쓰레기통 비우기’를 총 30회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '쓰레기통 비우기',
//     acquired: true,
//     earnedAt: '2025-10-04',
//   },
//   {
//     id: 1301,
//     title: '쓰레기 텅텅',
//     current: 85,
//     target: 90,
//     desc: '‘쓰레기통 비우기’를 총 90회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '쓰레기통 비우기',
//     acquired: false,
//   },
//   {
//     id: 1302,
//     title: '텅텅 비움이',
//     current: 110,
//     target: 180,
//     desc: '‘쓰레기통 비우기’를 총 180회 완료하면 받을 수 있어요.',
//     icon: require('@/assets/images/chore-home.png'),
//     section: '쓰레기통 비우기',
//     acquired: false,
//   },
// ]

export default function MyBadges() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: badges = [], isLoading, isError } = useAcquiredBadges()

  const selected = badges.find((b) => b.id === selectedId) ?? null

  // 섹션별 그룹매핑
  const groupedBySection = useMemo(() => {
    const map = new Map<string, ResponseBadge[]>()

    for (const sec of SECTION_ORDER) map.set(sec, []) // '시작' → [] 해당 타입의 key-value로 뱃지 배열 만들기

    // 해당 section에 해당하는 뱃지 배열에 넣기
    for (const b of badges) {
      const sec = getBadgeSection(b.badgeType)

      if (!map.has(sec)) map.set(sec, [])
      map.get(sec)!.push(b)
    }

    return SECTION_ORDER.map((sec) => ({ section: sec, items: map.get(sec) ?? [] })).filter(
      ({ items }) => items.length > 0
    )
  }, [badges])

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="chevron-left" size={24} color="#686F79" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>나의 뱃지</Text>
        </View>

        {isLoading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator />
          </View>
        )}

        {isError && !isLoading && <Text style={styles.errorText}>뱃지를 불러오지 못했어요.</Text>}

        {groupedBySection.map(({ section, items }) => (
          <View key={section} style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>{section}</Text>
            <View style={styles.rowBetween}>
              {items.map((b) => {
                const acquired = b.acquired ?? b.currentCount >= b.requiredCount
                return (
                  <View key={b.id} style={styles.badgeCol}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedId(b.id)}>
                      <BadgeCard
                        icon={{ uri: b.imageBadgeUrl }}
                        size={100}
                        iconSize={100}
                        acquired={acquired}
                      />
                    </TouchableOpacity>
                    <Text style={styles.badgeText}>
                      {b.acquired === true ? b.badgeTitle : '???'}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {selected && <BadgeDetail badge={selected} onClose={() => setSelectedId(null)} />}
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#F8F8FA' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingBox: { paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#D64545' },
  backBtn: { position: 'absolute', left: 0 },
  headerTitle: { fontFamily: 'Pretendard', fontSize: 20, fontWeight: '600' },
  sectionWrap: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Pretendard', fontSize: 16, fontWeight: '600', marginBottom: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeCol: { alignItems: 'center' },
  badgeText: { fontFamily: 'Pretendard', fontSize: 14, marginTop: 8, color: '#4F5763' },
})
