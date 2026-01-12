import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getRecommendChores } from '@/libs/api/recommend/getRecommendChores'
import { RecommendChores } from '@/types/recommend'

export default function useRecommendChores(category?: string) {
  return useQuery<RecommendChores[]>({
    queryKey: ['recommend', 'category-chores', category],
    queryFn: () => getRecommendChores(category as string),
    enabled: !!category,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
