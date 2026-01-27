import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getSeasonChoreList } from '@/libs/api/recommend/getSeasonChoreList'
import { ChoreItem } from '@/types/recommend'

export default function useSeasonChores() {
  return useQuery<ChoreItem[]>({
    queryKey: ['recommend', 'season-chores'],
    queryFn: getSeasonChoreList,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
