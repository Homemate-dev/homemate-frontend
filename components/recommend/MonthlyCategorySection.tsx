import { router } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { useToast } from '@/contexts/ToastContext'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import useMonthlyCategoryChores from '@/libs/hooks/recommend/useMonthlyCategoryChores'
import useMonthlyNameList from '@/libs/hooks/recommend/useMonthlyNameList'
import { useRegisterCategory } from '@/libs/hooks/recommend/useRegisterCategory'
import { trackEvent } from '@/libs/utils/ga4'
import { ChoreItem } from '@/types/recommend'

import SpaceChoreListCard from './SpaceChoreListCard'

function chunkBy<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

function MonthlyBlock({ categoryId, categoryName }: { categoryId: number; categoryName: string }) {
  const toast = useToast()
  const { data: user } = useMyPage()

  const {
    data: monthlyChores = [],
    isLoading: choreLoading,
    isError: choreError,
  } = useMonthlyCategoryChores(categoryId)

  const cateRegister = useRegisterCategory()

  const pages = useMemo(() => chunkBy(monthlyChores, 3), [monthlyChores])

  const handleAdd = async (item: ChoreItem) => {
    if (!item?.choreId) return

    trackEvent('task_created', {
      user_id: user?.id,
      task_type: 'CATEGORY',
      title: item.title,
      category_id: categoryId,
      category_name: categoryName,
    })

    try {
      await cateRegister.mutateAsync({
        categoryChoreId: item.choreId,
        category: categoryName,
      })

      toast.show({
        message: item.title,
        onPress: () => {
          router.replace('/(tabs)/home')
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{categoryName}</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollChore}
        horizontal
      >
        {pages.map((page, pageIdx) => (
          <SpaceChoreListCard
            key={`${categoryId}-${pageIdx}`}
            choresList={page}
            limit={3}
            isLoading={choreLoading}
            isError={choreError}
            width={300}
            onAdd={handleAdd}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default function MonthlyCategorySection() {
  const { data: monthlyListName = [] } = useMonthlyNameList()

  return (
    <View style={styles.container}>
      {monthlyListName.map((c) => (
        <MonthlyBlock
          key={c.categoriesId}
          categoryId={c.categoriesId}
          categoryName={c.categoryName}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  scrollChore: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
})
