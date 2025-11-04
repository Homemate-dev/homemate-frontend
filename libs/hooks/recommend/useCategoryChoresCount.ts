import { useEffect, useState } from 'react'

import { getRecommendChores } from '@/libs/api/recommend/getRecommendChores'
import { toCategoryApi } from '@/libs/utils/category'
import { ChoreCategory } from '@/types/recommend'

export default function useCategoryChoresCount(categories: ChoreCategory[]) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!categories || categories.length === 0) return

    const fetchCounts = async () => {
      setLoading(true)

      try {
        const results: Record<string, number> = {}

        for (const c of categories) {
          const apiName = toCategoryApi(c.category)

          if (!apiName) continue

          const chores = await getRecommendChores(apiName)

          results[c.category] = chores.length
        }

        setCounts(results)
      } catch (e) {
        console.error('카테고리별 집안일 개수 불러오기 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchCounts()
  }, [categories])

  return { counts, loading }
}
