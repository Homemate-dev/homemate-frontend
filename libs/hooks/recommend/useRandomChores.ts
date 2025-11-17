import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getRandomChores } from '@/libs/api/recommend/getRandomChores'

export default function useRandomChores() {
  return useQuery({
    queryKey: ['recommend', 'random'],
    queryFn: getRandomChores,
    staleTime: 0,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
