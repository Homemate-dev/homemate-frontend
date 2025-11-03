import { api } from '@/libs/api/axios'
import { ChoreNotification } from '@/types/notification'

import { NOTIFICATION_ENDPOINTS } from '../endpoints'

// 알림 목록 조회
export async function getChoreNotifications() {
  const { data } = await api.get<ChoreNotification[]>(NOTIFICATION_ENDPOINTS.CHORE_LIST)
  return data
}
