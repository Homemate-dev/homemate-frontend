import { useQuery } from '@tanstack/react-query'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'

export function useAcquiredBadges() {
  return useQuery({
    queryKey: ['badge', 'acquired'],
    queryFn: getAcquiredBadges,
  })
}
