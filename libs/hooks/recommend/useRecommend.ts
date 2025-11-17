import { useQuery } from '@tanstack/react-query'

import { getRecommend } from '@/libs/api/recommend/getRecommend'
import { Recommend } from '@/types/recommend'

export default function useRecommend(limitTrending = 5) {
  return useQuery<Recommend[]>({
    queryKey: ['recommend', 'categories', { limitTrending }],
    queryFn: () => getRecommend(limitTrending),
    refetchOnWindowFocus: false,
  })
}
