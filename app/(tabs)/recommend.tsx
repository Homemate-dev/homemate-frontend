import { MaterialIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import NotificationBell from '@/components/notification/NotificationBell'
import RecommendChoreModal from '@/components/RecommendChoreModal'
import TabSafeScroll from '@/components/TabSafeScroll'
import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import useRecommend from '@/libs/hooks/recommend/useRecommend'
import useRecommendChores from '@/libs/hooks/recommend/useRecommendChores'
import { useResisterSpace } from '@/libs/hooks/recommend/useResisterSpace'
import useSpaceChoreList from '@/libs/hooks/recommend/useSpaceChoreList'
import useSpaceList from '@/libs/hooks/recommend/useSpaceList'
import { toCategoryApi } from '@/libs/utils/category'
import { styleFromRepeatColor, toRepeatFields } from '@/libs/utils/repeat'
import { SpaceApi, SpaceUi, toSpaceUi } from '@/libs/utils/space'

// 3개씩 묶어서 "한 행(row)" 만들기
function chunkBy<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function Recommend() {
  const androidTop = Platform.OS === 'android' ? 50 : 0
  // ----- 상태관리 -----
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [activeSpace, setActiveSpace] = useState<SpaceApi>('KITCHEN')
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>('KITCHEN')

  const categoryEnum = toCategoryApi(selectedCategory) ?? undefined

  // ----- api 훅 -----
  const { data: overview = [], isLoading: overLoading, isError: overError } = useRecommend()
  // const { data: categories = [], isLoading: catLoading, isError: catError } = useChoreCategory()
  const { data: categoryChores = [], isLoading: choreLoading } = useRecommendChores(categoryEnum)

  const { data: spaceList = [], isLoading: spaLoading } = useSpaceList()
  const {
    data: spaceChores = [],
    isLoading: spaChoreLoading,
    isError: spaChoreError,
  } = useSpaceChoreList(selectedSpace)

  const { mutate } = useResisterSpace()

  const uiSpaces = useMemo((): { code: SpaceApi; label: SpaceUi }[] => {
    const list = (spaceList ?? []).map(({ space }) => ({
      code: space as SpaceApi,
      label: toSpaceUi(space)!,
    }))

    return list.length
      ? list
      : (['KITCHEN', 'BATHROOM', 'BEDROOM', 'PORCH', 'ETC'] as SpaceApi[]).map((code) => ({
          code,
          label: toSpaceUi(code)!,
        }))
  }, [spaceList])

  const categoryRows = useMemo(() => chunkBy(overview, 3), [overview]) // ← 한 줄에 3개
  const choreRows = useMemo(() => chunkBy(spaceChores, 5), [spaceChores])

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.screenHeader}>
            <Text style={styles.headerText}>추천</Text>
            <View style={styles.notificationBell}>
              <NotificationBell />
            </View>
          </View>

          {/* 이번달 집안일 카테고리 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이번달 집안일 카테고리</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              horizontal
            >
              {overLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator />
                </View>
              ) : (
                categoryRows.map((row, rIdx) => (
                  <View key={`row-${rIdx}`} style={styles.row}>
                    {row.map((c) => {
                      return (
                        <Pressable
                          key={c.code}
                          style={styles.card}
                          onPress={() => {
                            setSelectedCategory(c.name)
                            setIsOpen(true)
                          }}
                        >
                          <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle} numberOfLines={2}>
                              {c.name}
                            </Text>
                            <MaterialIcons name="chevron-right" size={18} color="#B4B7BC" />
                          </View>

                          <Text style={styles.cardSub}>{c.count}개의 집안일</Text>
                        </Pressable>
                      )
                    })}
                  </View>
                ))
              )}

              {overError && (
                <Text style={{ color: '#FF4838' }}>집안일 카테고리 불러오기에 실패했습니다.</Text>
              )}

              <RecommendChoreModal
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                title={selectedCategory ?? ''}
                chores={categoryChores}
                loading={choreLoading}
              />
            </ScrollView>
          </View>

          {/* 공간별 집안일 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공간별 집안일</Text>

            <View style={styles.spaceList}>
              {spaLoading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator />
                </View>
              )}

              {uiSpaces.map(({ code, label }) => {
                const isActive = activeSpace === code
                return (
                  <Pressable
                    key={code}
                    style={[styles.space, isActive && styles.spaceActive]}
                    onPress={() => {
                      setActiveSpace(code)
                      setSelectedSpace(code)
                    }}
                    hitSlop={6}
                  >
                    <Text style={[styles.spaceText, isActive && styles.spaceTextActive]}>
                      {label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollChore}
              horizontal
            >
              {spaChoreLoading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator />
                </View>
              )}

              {spaChoreError && <Text>집안일 내역 불러오기에 실패했습니다.</Text>}

              {choreRows.map((row, rIdx) => (
                <View key={`row-${rIdx}`} style={styles.choreRow}>
                  {row.map((c, i) => {
                    const { repeatType, repeatInterval } = toRepeatFields(c.frequency)
                    const key = getRepeatKey(repeatType, repeatInterval)
                    const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']

                    return (
                      <>
                        <View
                          key={c.choreId}
                          style={[styles.choreList, i === row.length - 1 && styles.mb0]}
                        >
                          <View style={styles.chore}>
                            <View style={[styles.badge, styleFromRepeatColor(repeat.color)]}>
                              <Text style={[styles.badgeText, styleFromRepeatColor(repeat.color)]}>
                                {repeat.label}
                              </Text>
                            </View>
                            <Text style={styles.choreTitle}>{c.title}</Text>
                          </View>

                          <Pressable
                            onPress={() => mutate({ spaceChoreId: c.choreId, space: activeSpace })}
                            hitSlop={8}
                          >
                            <Image
                              source={require('../../assets/images/plus-square.png')}
                              resizeMode="contain"
                              style={{ width: 20, height: 20 }}
                            />
                          </Pressable>
                        </View>

                        {i !== row.length - 1 && <View style={styles.divider} />}
                      </>
                    )
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </TabSafeScroll>
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F8FA' },

  screenHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
    flexDirection: 'row',
    height: 62,
  },
  headerText: { fontFamily: 'Pretendard', fontWeight: 600, fontSize: 20 },
  notificationBell: { position: 'absolute', right: 0 },

  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Pretendard', fontSize: 18, fontWeight: '700', marginBottom: 12 },

  scrollContainer: {
    flexDirection: 'column',
    rowGap: 12,
  },

  row: {
    flexDirection: 'row',
    columnGap: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  placeholder: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  cardTitle: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: 600,
    color: '#46A1A6',
    flexShrink: 1,
  },
  cardSub: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    color: '#4F5763',
  },

  // 공간 탭
  spaceList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  space: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E7E9',
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  spaceActive: {
    backgroundColor: '#79D4D9',
    borderWidth: 0,
  },

  spaceTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
    fontWeight: 600,
  },

  spaceText: { color: '#9B9FA6', fontFamily: 'Pretendard', fontSize: 14 },

  scrollChore: {
    flexDirection: 'row',
    gap: 12,
  },
  choreList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8.5,
  },
  choreRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 300,
  },
  chore: { flexDirection: 'row', gap: 12 },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 23,
    borderRadius: 6,
  },

  badgeText: {
    fontFamily: 'Pretendard',
    fontSize: 12,
  },

  choreTitle: {
    fontFamily: 'Pretendard',
    fontSize: 14,
  },

  mb0: {
    marginBottom: 0,
  },

  divider: { borderBottomWidth: 0.5, borderBottomColor: '#E6E7E9', marginBottom: 8.5 },
  loadingRow: { paddingVertical: 12 },
})
