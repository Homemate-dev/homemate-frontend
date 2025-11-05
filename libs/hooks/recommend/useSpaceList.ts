import { useQuery } from '@tanstack/react-query'

import { getSpaceList } from '@/libs/api/recommend/getSpaceList'
import { SpaceList } from '@/types/recommend'

export default function useSpaceList() {
  return useQuery<SpaceList[]>({
    queryKey: ['recommend', 'space'],
    queryFn: getSpaceList,
    refetchOnWindowFocus: false,
  })
}
