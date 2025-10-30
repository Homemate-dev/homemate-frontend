import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BadgeCard from '@/components/Badge/BadgeCard'
import BadgeDetail from '@/components/BadgeDetail'
import TabSafeScroll from '@/components/TabSafeScroll'
import { useMonthlyMissions } from '@/libs/hooks/mission/useMonthlyMissions'
import { inferUnitFromTitle } from '@/libs/utils/mission'

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
  const { data: missions, isLoading, isError } = useMonthlyMissions()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = mockBadges.find((badge) => badge.id === selectedId)
  const progress = (cur: number, tgt: number) =>
    tgt ? Math.min(100, Math.round((cur * 100) / tgt)) : 0

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>미션</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이 달의 미션</Text>

            <View style={styles.missionBox}>
              {isLoading && (
                <View style={styles.loadingBox}>
                  <ActivityIndicator />
                </View>
              )}

              {isError && !isLoading && (
                <Text style={styles.errorText}>이달의 미션을 불러오지 못했어요.</Text>
              )}

              {!isLoading && !isError && (missions?.length ?? 0) === 0 && (
                <Text style={styles.noMissionText}>아직 등록된 이달의 미션이 없어요.</Text>
              )}

              {!isLoading &&
                !isError &&
                missions?.map((m, idx) => (
                  <View key={m.id} style={idx !== missions.length - 1 && styles.mb12}>
                    <View style={styles.missionRow}>
                      <Text style={styles.missionTitle}>{m.title}</Text>
                      <Text style={styles.missionCountText}>
                        <Text style={styles.missionCurrent}>
                          {m.currentCount}
                          {inferUnitFromTitle(m.title)}{' '}
                        </Text>
                        / {m.targetCount}
                        {inferUnitFromTitle(m.title)}
                      </Text>
                    </View>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${progress(m.currentCount, m.targetCount)}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.tipRow}>
              <Text style={styles.star}>⭐</Text>
              <View style={styles.tipInner}>
                <Text style={styles.tipText}>추천 카테고리에서 추가해보세요!</Text>
                <Image
                  source={require('../../assets/images/arrow/right-inactive.png')}
                  style={styles.tipArrow}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>곧 획득하는 뱃지</Text>
            <View style={styles.badgeBox}>
              <View style={styles.badgeRow}>
                {mockBadges.map((b) => (
                  <View key={b.id} style={styles.badgeItem}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedId(b.id)}>
                      <BadgeCard
                        icon={require('@/assets/images/chore-home.png')}
                        size={84}
                        iconSize={82}
                      />
                    </TouchableOpacity>
                    <Text style={styles.badgeTitle}>{b.title}</Text>
                    <Text style={styles.badgeCount}>
                      <Text style={styles.badgeCurrent}>{b.current}회</Text> / {b.target}회
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/mybadges')} style={styles.moreBtn}>
              <Text style={styles.moreText}>뱃지 더보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TabSafeScroll>
      {selected && <BadgeDetail badge={selected} onClose={() => setSelectedId(null)} />}
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F8FA' },
  header: { alignItems: 'center', marginVertical: 16 },
  headerText: { fontSize: 20, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  missionBox: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 10 },
  loadingBox: { paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#D64545' },
  noMissionText: { color: '#686F79' },
  mb12: { marginBottom: 12 },
  missionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  missionTitle: { fontSize: 14 },
  missionCountText: { fontSize: 14, color: '#B4B7BC' },
  missionCurrent: { fontWeight: '600', color: '#57C9D0' },
  progressBar: {
    marginTop: 12,
    marginBottom: 8,
    height: 8,
    width: '100%',
    borderRadius: 9999,
    backgroundColor: '#040F2014',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 9999, backgroundColor: '#57C9D0' },
  tipRow: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 4 },
  tipInner: { flexDirection: 'row', alignItems: 'center' },
  tipText: { fontSize: 12, color: '#686F79' },
  tipArrow: { width: 16, height: 16 },
  badgeBox: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 12 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeItem: { alignItems: 'center' },
  badgeTitle: { fontSize: 14, color: '#4F5763', marginTop: 8 },
  badgeCount: { fontSize: 14, color: '#B4B7BC', marginTop: 8 },
  badgeCurrent: { color: '#57C9D0', fontWeight: '600' },
  moreBtn: {
    height: 52,
    backgroundColor: '#DDF4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  moreText: { color: '#46A1A6', fontSize: 16, fontWeight: '600' },
})
