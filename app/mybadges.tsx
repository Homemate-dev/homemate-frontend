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

export default function MyBadges() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: badges = [], isLoading, isError } = useAcquiredBadges()

  const selected = badges.find((b) => b.badgeTitle === selectedId) ?? null

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

    return SECTION_ORDER.map((sec) => {
      const arr = map.get(sec) ?? []
      const items = [...arr].sort((x, y) => {
        const rx = Number(x.requiredCount ?? Number.POSITIVE_INFINITY)
        const ry = Number(y.requiredCount ?? Number.POSITIVE_INFINITY)
        return rx - ry
      })
      return { section: sec, items }
    }).filter(({ items }) => items.length > 0)
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
                  <View key={b.badgeTitle} style={styles.badgeCol}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSelectedId(b.badgeTitle)}
                    >
                      <BadgeCard
                        icon={b.badgeImageUrl}
                        size={100}
                        iconSize={80}
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
  headerTitle: { fontSize: 20, fontWeight: '600' },
  sectionWrap: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeCol: { alignItems: 'center' },
  badgeText: { fontSize: 14, marginTop: 8, color: '#4F5763' },
})
