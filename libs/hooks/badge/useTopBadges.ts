import { useQuery } from '@tanstack/react-query'

import { getTopBadges } from '@/libs/api/badge/getTopBadges'

export function useTopBadges() {
  return useQuery({
    queryKey: ['badge', 'top', 'three'],
    queryFn: getTopBadges,
  })
}
