import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getSpaceChoreList } from '@/libs/api/recommend/getSpaceChoreList'
import { SpaceChoreList } from '@/types/recommend'

export default function useSpaceChoreList(space?: string) {
  return useQuery<SpaceChoreList[]>({
    queryKey: ['recommend', 'category-chores', space],
    queryFn: () => getSpaceChoreList(space),

    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
