import { api } from '@/libs/api/axios'
import { NoticeNotification } from '@/types/notification'

import { NOTIFICATION_ENDPOINTS } from '../endpoints'

// 알림 목록 조회
export async function getNoticeNotifications() {
  const { data } = await api.get<NoticeNotification[]>(NOTIFICATION_ENDPOINTS.NOTICE_LIST)
  return data
}
