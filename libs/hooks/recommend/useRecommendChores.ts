import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getRecommendChores } from '@/libs/api/recommend/getRecommendChores'
import { CategoryApi } from '@/libs/utils/category'
import { RecommendChores } from '@/types/recommend'

export default function useRecommendChores(category?: string) {
  return useQuery<RecommendChores[]>({
    queryKey: ['recommend', 'category-chores', category ?? ''],
    queryFn: () => getRecommendChores(category as CategoryApi),
    enabled: !!category,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
