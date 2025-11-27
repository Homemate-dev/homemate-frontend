import { useQuery } from '@tanstack/react-query'

import { getChoreNotifications } from '@/libs/api/notification/getChoreNotifications'
import { ChoreNotification } from '@/types/notification'

export function useChoreNotifications() {
  return useQuery<ChoreNotification[]>({
    queryKey: ['notifications', 'chore'],
    queryFn: getChoreNotifications,
    staleTime: 10000, // 데이터가 10초 동안은 신선하게 유지됨
    refetchOnWindowFocus: false, // 화면 전환 시 자동 새로고침 방지
  })
}
