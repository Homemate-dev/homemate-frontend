import { FirstAlertTimeResp } from '@/types/mypage'

import { api } from '../axios'
import { MYPAGE_ENDPOINTS } from '../endpoints'

// 최초 알림 시간 설정
export async function postFirstNotiSetting(notificationTime: string) {
  const { data } = await api.post<FirstAlertTimeResp>(MYPAGE_ENDPOINTS.SET_INITIAL_ALERT, {
    notificationTime,
  })

  return data
}
