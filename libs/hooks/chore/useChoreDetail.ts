import { useQuery } from '@tanstack/react-query'

import { getChoreDetail } from '@/libs/api/chore/getChoreDetail'
import { responseChoreDetail } from '@/types/chore'

export function useChoreDetail(choreInstanceId: number) {
  return useQuery<responseChoreDetail>({
    queryKey: ['chore', 'detail', choreInstanceId],
    queryFn: () => getChoreDetail(choreInstanceId),
    enabled: !!choreInstanceId, // 0이면 호출 안됨
    staleTime: 0,
  })
}
