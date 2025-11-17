import { useQuery } from '@tanstack/react-query'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { ResponseBadge } from '@/types/badge'

export function useAcquiredBadges() {
  return useQuery<ResponseBadge[]>({
    queryKey: ['badge', 'acquired'],
    queryFn: getAcquiredBadges,
  })
}
