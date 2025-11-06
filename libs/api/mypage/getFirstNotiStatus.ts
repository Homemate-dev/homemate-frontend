import { FirstAlertStatusResp } from '@/types/mypage'

import { api } from '../axios'
import { MYPAGE_ENDPOINTS } from '../endpoints'

// 최초 알림 시간 설정 여부 조회 (소셜 로그인 직후 확인용)
export async function getFirstNotiStatus() {
  const { data } = await api.get<FirstAlertStatusResp>(MYPAGE_ENDPOINTS.GET_ALERT_STATUS)
  return data
}
