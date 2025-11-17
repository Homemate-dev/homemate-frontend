import { useQuery } from '@tanstack/react-query'

import { getChoreCategory } from '@/libs/api/recommend/getChoreCategory'
import { ChoreCategory } from '@/types/recommend'

export default function useChoreCategory() {
  return useQuery<ChoreCategory[]>({
    queryKey: ['recommend', 'categories'],
    queryFn: getChoreCategory,
    refetchOnWindowFocus: false,
  })
}
