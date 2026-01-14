import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getMonthlyCategoryChores } from '@/libs/api/recommend/getMonthlyCategoryChores'
import { ChoreItem } from '@/types/recommend'

export default function useMonthlyCategoryChores(categoryId?: number, subCategory?: string) {
  return useQuery<ChoreItem[]>({
    queryKey: ['recommend', 'monthly-chores', categoryId, subCategory],
    queryFn: () => getMonthlyCategoryChores(categoryId as number, subCategory),
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
