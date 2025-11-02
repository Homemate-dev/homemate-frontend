import { ReadNotification } from '@/types/notification'

import { api } from '../axios'
import { NOTIFICATION_ENDPOINTS } from '../endpoints'

export async function patchNoticeReadNotification(notificationId: number) {
  const { data } = await api.patch<ReadNotification>(
    NOTIFICATION_ENDPOINTS.NOTICE_READ(notificationId)
  )

  return data
}
