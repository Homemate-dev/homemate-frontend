import { useQuery } from '@tanstack/react-query'

import { getChoreByDate } from '@/libs/api/chore/getChoreByDate'
import { responseChoreByDate } from '@/types/chore'

export function useChoreByDate(date: string) {
  return useQuery<responseChoreByDate[]>({
    queryKey: ['chore', 'byDate', date],
    queryFn: () => getChoreByDate(date),
    enabled: !!date,
    staleTime: 0,
  })
}
