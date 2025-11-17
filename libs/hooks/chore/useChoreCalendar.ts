import { useQuery } from '@tanstack/react-query'

import { getChoreCalendar } from '@/libs/api/chore/getChoreCalendar'

export function useChoreCalendar(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['chore', 'calendar', startDate, endDate],
    queryFn: () => getChoreCalendar(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 0,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev, // 새 키로 로딩 중에도 이전 데이터 유지(깜빡임 방지)
  })
}
