import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getSeasonChoreList } from '@/libs/api/recommend/getSeasonChoreList'
import { RecommendChores } from '@/types/recommend'

export default function useSeasonChores() {
  return useQuery<RecommendChores[]>({
    queryKey: ['recommend', 'season-chores'],
    queryFn: getSeasonChoreList,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
