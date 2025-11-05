import { useQuery } from '@tanstack/react-query'

import { getRandomChoreInfo } from '@/libs/api/recommend/getRandomChoreInfo'
import { RandomChoreList } from '@/types/recommend'

export default function useRandomChoreInfo(spaceChoreId: number) {
  return useQuery<RandomChoreList>({
    queryKey: ['recommend', 'random', spaceChoreId],
    queryFn: () => getRandomChoreInfo(spaceChoreId),
    enabled: typeof spaceChoreId === 'number',
    refetchOnWindowFocus: false,
  })
}
