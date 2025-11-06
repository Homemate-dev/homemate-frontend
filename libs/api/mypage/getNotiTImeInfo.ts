import { ResponseNotificationTime } from '@/types/mypage'

import { api } from '../axios'
import { MYPAGE_ENDPOINTS } from '../endpoints'

// 알림 시간 조회
export async function getNotiTImeInfo() {
  const { data } = await api.get<ResponseNotificationTime>(MYPAGE_ENDPOINTS.GET_ALERT_TIME)
  return data
}
