import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import RecommendChoreModal from '@/components/RecommendChoreModal'
import { FIXED_NAME_TO_ENUM, isSeasonCategory } from '@/constants/recommendCategory'
import { useToast } from '@/contexts/ToastContext'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import useRecommend from '@/libs/hooks/recommend/useRecommend'
import useRecommendChores from '@/libs/hooks/recommend/useRecommendChores'
import { useRegisterCategory } from '@/libs/hooks/recommend/useRegisterCategory'
import useSeasonChores from '@/libs/hooks/recommend/useSeasonChores'
import { trackEvent } from '@/libs/utils/ga4'

type SelectedTarget =
  | { type: 'FIXED'; category: string; name: string }
  | { type: 'SEASON'; category: string; name: string }

export default function CategoryOverviewSection() {
  const toast = useToast()

  // ----- 상태관리 -----
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null)

  const [_submitting, setSubmitting] = useState(false)

  // ----- api 훅 -----

  const { data: user } = useMyPage()
  const { data: overview = [], isLoading: overLoading, isError: overError } = useRecommend()

  const fixedCategory = selectedTarget?.type === 'FIXED' ? selectedTarget.category : undefined
  const { data: fixedChores = [], isLoading: fixedLoading } = useRecommendChores(fixedCategory)
  const { data: seasonChores = [], isLoading: seasonLoading } = useSeasonChores()

  const cateRegister = useRegisterCategory()

  const modalChores = selectedTarget?.type === 'SEASON' ? seasonChores : fixedChores
  const modalLoading = selectedTarget?.type === 'SEASON' ? seasonLoading : fixedLoading

  // 카테고리 집안일 등록 핸들러
  const handleSubmit = async (selectedIds: number[]) => {
    if (!selectedIds.length || !selectedTarget) return
    if (selectedTarget.type !== 'FIXED') return

    const selectedCategoryEnum = selectedTarget.category
    const selectedCategoryName = selectedTarget.name

    setSubmitting(true)

    // GA4 태깅
    trackEvent('reco_category_cta_click', {
      user_id: user?.id,
      category_id: selectedCategoryEnum,
      category_name: selectedCategoryName,
    })

    setIsOpen(false)

    try {
      await Promise.all(
        selectedIds.map((categoryChoreId) => {
          // 선택한 집안일 찾기
          const chore = fixedChores.find((item) => item.choreId === categoryChoreId)

          // GA4 태깅
          trackEvent('task_created', {
            user_id: user?.id,
            task_type: 'CATEGORY',
            title: chore?.title,
            cycle: chore?.frequency,
            category_id: selectedCategoryEnum,
            category_name: selectedCategoryName,
          })

          return cateRegister.mutateAsync({ categoryChoreId, category: selectedCategoryEnum })
        })
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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>이번달 집안일 카테고리</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {overLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
          </View>
        ) : (
          overview.map((row, idx) => {
            return (
              <View key={`${row.name}-${idx}`}>
                <Pressable
                  style={styles.card}
                  onPress={() => {
                    const name = row.name ?? ''
                    const isSeason = isSeasonCategory(name)

                    const fixedEnum = row.category ?? FIXED_NAME_TO_ENUM[name]

                    trackEvent('reco_category_click', {
                      user_id: user?.id,
                      category_id: isSeason ? name : fixedEnum,
                      category_name: row.name,
                    })

                    if (isSeason) {
                      setSelectedTarget({ type: 'SEASON', category: name, name })
                      setIsOpen(true)
                      return
                    }

                    if (!fixedEnum) {
                      toast.show({ message: '카테고리 정보가 없어요.' })
                      return
                    }

                    setSelectedTarget({ type: 'FIXED', category: fixedEnum, name })
                    setIsOpen(true)
                  }}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {row.category === 'MISSIONS' ? '⭐ ' : ''}
                      {row.name}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={18}
                      color="#B4B7BC"
                      style={styles.chevron}
                    />
                  </View>

                  <Text style={styles.cardSub}>{row.count}개의 집안일</Text>
                </Pressable>
              </View>
            )
          })
        )}

        {overError && (
          <Text style={{ color: '#FF4838' }}>집안일 카테고리 불러오기에 실패했습니다.</Text>
        )}
      </ScrollView>

      <RecommendChoreModal
        visible={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelectedTarget(null)
        }}
        title={selectedTarget?.name ?? ''}
        chores={modalChores}
        loading={modalLoading}
        onSubmit={handleSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

  scrollContainer: {
    flexDirection: 'row',
    columnGap: 12,
  },

  loadingRow: { paddingVertical: 12 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
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

  chevron: {
    marginTop: 2,
  },
})
