import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getRecommendChores } from '@/libs/api/recommend/getRecommendChores'
import { ChoreItem } from '@/types/recommend'

export default function useRecommendChores(category?: string) {
  return useQuery<ChoreItem[]>({
    queryKey: ['recommend', 'category-chores', category],
    queryFn: () => getRecommendChores(category as string),
    enabled: !!category,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
