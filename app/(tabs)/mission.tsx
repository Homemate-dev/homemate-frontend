import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BadgeCard from '@/components/Badge/BadgeCard'
import BadgeDetail from '@/components/BadgeDetail'
import NotificationBell from '@/components/notification/NotificationBell'
import TabSafeScroll from '@/components/TabSafeScroll'
import { useTopBadges } from '@/libs/hooks/badge/useTopBadges'
import { useMonthlyMissions } from '@/libs/hooks/mission/useMonthlyMissions'
import { ResponseBadge } from '@/types/badge'

export default function Mission() {
  const androidTop = Platform.OS === 'android' ? 50 : 0

  const { data: missions, isLoading, isError } = useMonthlyMissions()
  const { data: TopBadges, isLoading: badgeLoading, isError: badgeError } = useTopBadges()

  const [selected, setSelected] = useState<ResponseBadge | null>(null)

  const progress = (cur: number, tgt: number) =>
    tgt ? Math.min(100, Math.round((cur * 100) / tgt)) : 0

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>미션</Text>
            <View style={styles.notificationBell}>
              <NotificationBell />
            </View>
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
                      <Text style={styles.missionTitle}>
                        {m.existsInRecommend ? '⭐ ' : ''}
                        {m.title}
                      </Text>
                      <Text style={styles.missionCountText}>
                        <Text style={styles.missionCurrent}>{m.currentCount}회 </Text>/{' '}
                        {m.targetCount}회
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

            <Pressable style={styles.tipRow} onPress={() => router.push('/recommend')}>
              <Text style={styles.star}>⭐</Text>
              <View style={styles.tipInner}>
                <Text style={styles.tipText}>추천 카테고리에서 추가해보세요!</Text>
                <Image
                  source={require('../../assets/images/arrow/right-inactive.png')}
                  style={styles.tipArrow}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          </View>

          <View>
            <Text style={styles.sectionTitle}>곧 획득하는 뱃지</Text>
            <View style={styles.badgeBox}>
              <View style={styles.badgeRow}>
                {badgeLoading && (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator />
                  </View>
                )}

                {badgeError && !badgeLoading && (
                  <Text style={styles.errorText}>뱃지를 불러오지 못했어요.</Text>
                )}

                {TopBadges?.map((b) => (
                  <View key={b.badgeTitle} style={styles.badgeItem}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setSelected(b)}>
                      <BadgeCard
                        icon={{ uri: b.badgeImageUrl }}
                        size={84}
                        iconSize={82}
                        acquired={b.currentCount === b.requiredCount}
                      />
                    </TouchableOpacity>
                    <Text style={styles.badgeTitle}>
                      {b.acquired === true ? b.badgeTitle : '???'}
                    </Text>
                    <Text style={styles.badgeCount}>
                      <Text style={styles.badgeCurrent}>{b.currentCount}회</Text> /{' '}
                      {b.requiredCount}회
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
      {selected && <BadgeDetail badge={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F8FA' },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
    flexDirection: 'row',
    height: 46,
  },
  headerText: { fontFamily: 'Pretendard', fontSize: 20, fontWeight: '600' },
  notificationBell: { position: 'absolute', right: 0 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Pretendard', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  missionBox: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 10 },
  loadingBox: { paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#D64545' },
  noMissionText: { color: '#686F79' },
  mb12: { marginBottom: 12 },
  missionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  missionTitle: { fontFamily: 'Pretendard', fontSize: 14 },
  missionCountText: { fontFamily: 'Pretendard', fontSize: 14, color: '#B4B7BC' },
  missionCurrent: { fontFamily: 'Pretendard', fontWeight: '600', color: '#57C9D0' },
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
  tipText: { fontFamily: 'Pretendard', fontSize: 12, color: '#686F79' },
  tipArrow: { width: 16, height: 16 },
  badgeBox: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 12 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeItem: { alignItems: 'center' },
  badgeTitle: { fontFamily: 'Pretendard', fontSize: 14, color: '#4F5763', marginTop: 8 },
  badgeCount: { fontFamily: 'Pretendard', fontSize: 14, color: '#B4B7BC', marginTop: 8 },
  badgeCurrent: { fontFamily: 'Pretendard', color: '#57C9D0', fontWeight: '600' },
  moreBtn: {
    height: 52,
    backgroundColor: '#DDF4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  moreText: { color: '#46A1A6', fontFamily: 'Pretendard', fontSize: 16, fontWeight: '600' },
})
