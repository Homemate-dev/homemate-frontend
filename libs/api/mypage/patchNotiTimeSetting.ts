import { ResponseNotificationTime } from '../../../types/mypage'
import { api } from '../axios'
import { MYPAGE_ENDPOINTS } from './../endpoints'

export const patchNotiTimeSetting = async (notificationTime: string) => {
  const { data } = await api.patch<ResponseNotificationTime>(MYPAGE_ENDPOINTS.UPDATE_ALERT_TIME, {
    notificationTime,
  })
  return data
}
