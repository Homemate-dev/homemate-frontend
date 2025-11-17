import { useQuery } from '@tanstack/react-query'

import { getMonthlyMissions } from '@/libs/api/mission/getMonthlyMissions'
import { MonthlyMission } from '@/types/mission'

export function useMonthlyMissions() {
  return useQuery<MonthlyMission[]>({
    queryKey: ['mission', 'monthly'],
    queryFn: getMonthlyMissions,
    staleTime: 0,
    retry: 1,
  })
}
