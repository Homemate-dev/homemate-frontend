import { useQuery } from '@tanstack/react-query'

import { getNoticeNotifications } from '@/libs/api/notification/getNoticeNotifications'
import { NoticeNotification } from '@/types/notification'

export function useNoticeNotifications() {
  return useQuery<NoticeNotification[]>({
    queryKey: ['notifications', 'notice'],
    queryFn: getNoticeNotifications,
    staleTime: 10000, // 데이터가 10초 동안은 신선하게 유지됨
    refetchOnWindowFocus: false, // 화면 전환 시 자동 새로고침 방지
  })
}
