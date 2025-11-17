import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/contexts/AuthContext'
import { getFirstNotiStatus } from '@/libs/api/mypage/getFirstNotiStatus'
import { FirstAlertStatusResp } from '@/types/mypage'

export function useFirstNotiStatus() {
  const { token } = useAuth()

  return useQuery<FirstAlertStatusResp>({
    queryKey: ['notifications', 'first-status'],
    queryFn: getFirstNotiStatus,
    enabled: !!token,
    retry: 1,
  })
}
