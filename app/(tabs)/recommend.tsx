import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
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
import { useToast } from '@/contexts/ToastContext'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import useRecommend from '@/libs/hooks/recommend/useRecommend'
import useRecommendChores from '@/libs/hooks/recommend/useRecommendChores'
import { useRegisterCategory } from '@/libs/hooks/recommend/useRegisterCategory'
import { useRegisterSpace } from '@/libs/hooks/recommend/useRegisterSpace'
import useSpaceChoreList from '@/libs/hooks/recommend/useSpaceChoreList'
import useSpaceList from '@/libs/hooks/recommend/useSpaceList'
import { CategoryApi } from '@/libs/utils/category'
import { trackEvent } from '@/libs/utils/ga4'
import { styleFromRepeatColor, toRepeat } from '@/libs/utils/repeat'
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
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | undefined>(undefined)
  const [selectedCategoryEnum, setSelectedCategoryEnum] = useState<string | undefined>(undefined)

  const [activeSpace, setActiveSpace] = useState<SpaceApi>('KITCHEN')
  const [selectedSpace, setSelectedSpace] = useState<SpaceApi | undefined>('KITCHEN')

  const [submitting, setSubmitting] = useState(false)

  const toast = useToast()

  // ----- api 훅 -----
  const { data: user } = useMyPage()
  const { data: overview = [], isLoading: overLoading, isError: overError } = useRecommend()
  // const { data: categories = [], isLoading: catLoading, isError: catError } = useChoreCategory()
  const { data: categoryChores = [], isLoading: choreLoading } = useRecommendChores(
    isOpen ? (selectedCategoryEnum as CategoryApi | undefined) : undefined
  )

  const { data: spaceList = [], isLoading: spaLoading } = useSpaceList()
  const {
    data: spaceChores = [],
    isLoading: spaChoreLoading,
    isError: spaChoreError,
  } = useSpaceChoreList(selectedSpace)

  const { mutate: spaRegister } = useRegisterSpace()
  const cateRegister = useRegisterCategory()

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

  const categoryRows = useMemo(() => chunkBy(overview, 4), [overview]) // ← 한 줄에 4개
  const choreRows = useMemo(() => chunkBy(spaceChores, 5), [spaceChores])

  // 카테고리 집안일 등록 핸들러
  const handleSubmit = async (selectedIds: number[]) => {
    if (!selectedIds.length || !selectedCategoryEnum) return
    setSubmitting(true)

    // 선택한 집안일들 추려오기
    const selectedChores = categoryChores.filter((chore: any) =>
      selectedIds.includes(chore.choreId)
    )

    // GA4 태깅
    selectedChores.forEach((chore: any) => {
      trackEvent('task_created', {
        user_id: user?.id,
        task_type: 'CATEGORY',
        title: chore.title,
        cycle: chore.frequency,
      })
    })

    setIsOpen(false)

    try {
      await Promise.all(
        selectedIds.map((categoryChoreId) =>
          cateRegister.mutateAsync({ categoryChoreId, category: selectedCategoryEnum })
        )
      )

      if (selectedCategoryName) {
        toast.show({
          message: selectedCategoryName,
          onPress: () => {
            router.replace('/(tabs)/home')
          },
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

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
                          key={c.category}
                          style={styles.card}
                          onPress={() => {
                            setSelectedCategoryEnum(c.category)
                            setSelectedCategoryName(c.name)
                            setIsOpen(true)
                          }}
                        >
                          <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle} numberOfLines={2}>
                              {c.category === 'MISSIONS' ? '⭐ ' : ''}
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
                title={selectedCategoryName ?? ''}
                chores={categoryChores}
                loading={choreLoading}
                onSubmit={handleSubmit}
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

              {spaChoreError && (
                <Text style={{ color: '#FF4838' }}>공간별 집안일 불러오기에 실패했습니다.</Text>
              )}

              {choreRows.map((row, rIdx) => (
                <View key={`row-${rIdx}`} style={styles.choreRow}>
                  {row.map((c, i) => {
                    const { repeatType, repeatInterval } = toRepeat(c.frequency)
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
                            onPress={() => {
                              // GA4 태깅
                              trackEvent('task_created', {
                                user_id: user?.id,
                                task_type: 'SPACE',
                                title: c.title,
                                cycle: repeat.label,
                              })
                              spaRegister({ spaceChoreId: c.choreId, space: activeSpace })
                            }}
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
    position: 'relative',
    flexDirection: 'row',
    height: 46,
    marginVertical: 16,
  },
  headerText: { fontWeight: 600, fontSize: 20 },
  notificationBell: { position: 'absolute', right: 0 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

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
    fontSize: 16,
    fontWeight: 600,
    color: '#46A1A6',
    flexShrink: 1,
  },
  cardSub: {
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

    fontWeight: 600,
  },

  spaceText: { color: '#9B9FA6', fontSize: 14 },

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
  chore: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 23,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 12,
  },

  choreTitle: {
    fontSize: 14,
  },

  mb0: {
    marginBottom: 0,
  },

  divider: { borderBottomWidth: 0.5, borderBottomColor: '#E6E7E9', marginBottom: 8.5 },
  loadingRow: { paddingVertical: 12 },
})
