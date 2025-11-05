import { useQuery } from '@tanstack/react-query'

import { getTopBadges } from '@/libs/api/badge/getTopBadges'
import { ResponseBadge } from '@/types/badge'

export function useTopBadges() {
  return useQuery<ResponseBadge[]>({
    queryKey: ['badge', 'top', 'three'],
    queryFn: getTopBadges,
  })
}
