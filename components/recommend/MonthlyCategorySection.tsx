import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { MONTHLY_CATEGORIES } from '@/constants/recommendCategory'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import useMonthlyCategoryChores from '@/libs/hooks/recommend/useMonthlyCategoryChores'
import { useRegisterSpace } from '@/libs/hooks/recommend/useRegisterSpace'
import { trackEvent } from '@/libs/utils/ga4'
import { groupMonthlyChoresByCategoryName } from '@/libs/utils/groupByCategoryName'

import SpaceChoreListCard from './SpaceChoreListCard'

function chunkBy<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

function MonthlyBlock({ categoryId }: { categoryId: number }) {
  const { data: user } = useMyPage()

  const {
    data: monthlyChores = [],
    isLoading: choreLoading,
    isError: choreError,
  } = useMonthlyCategoryChores(categoryId)

  const { mutate: spaRegister } = useRegisterSpace()

  const grouped = useMemo(() => groupMonthlyChoresByCategoryName(monthlyChores), [monthlyChores])

  return (
    <>
      {grouped.map((chore) => {
        const pages = chunkBy(chore.choresList.slice(0, 6), 3)
        return (
          <View style={styles.section} key={`${categoryId}-${chore.categoryName}`}>
            {/* 헤더 */}
            <Text style={styles.sectionTitle}>{chore.categoryName}</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollChore}
              horizontal
            >
              {pages.map((page, pageIdx) => (
                <SpaceChoreListCard
                  key={`${categoryId}-${chore.categoryName}-${pageIdx}`}
                  choresList={page}
                  limit={3}
                  isLoading={choreLoading}
                  isError={choreError}
                  width={300}
                  onAdd={(c, cycleLabel) => {
                    trackEvent('task_created', {
                      user_id: user?.id,
                      task_type: 'SPACE',
                      title: c.title,
                      cycle: cycleLabel,
                    })

                    spaRegister({ spaceChoreId: c.choreId, space: c.spaceName })
                  }}
                />
              ))}
            </ScrollView>
          </View>
        )
      })}
    </>
  )
}

export default function MonthlyCategorySection() {
  return (
    <View style={styles.container}>
      {MONTHLY_CATEGORIES.map((c) => (
        <MonthlyBlock key={c.id} categoryId={c.id} />
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

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
})
