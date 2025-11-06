import { AlertType, UpdateAlertResp } from '@/types/mypage'

import { api } from '../axios'
import { MYPAGE_ENDPOINTS } from '../endpoints'

// 알림 설정 변경
export async function patchNotiSetting(type: AlertType, enabled: boolean) {
  const { data } = await api.patch<UpdateAlertResp>(MYPAGE_ENDPOINTS.UPDATE_ALERT(type), {
    enabled,
  })
  return data
}
