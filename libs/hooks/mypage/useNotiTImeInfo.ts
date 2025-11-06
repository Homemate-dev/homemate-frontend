import { useQuery } from '@tanstack/react-query'

import { getNotiTImeInfo } from '@/libs/api/mypage/getNotiTImeInfo'
import { ResponseNotificationTime } from '@/types/mypage'

export function useNotiTImeInfo() {
  return useQuery<ResponseNotificationTime>({
    queryKey: ['mypage', 'notification-time'],
    queryFn: getNotiTImeInfo,
  })
}
