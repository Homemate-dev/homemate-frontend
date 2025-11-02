import { ReadNotification } from '@/types/notification'

import { api } from '../axios'
import { NOTIFICATION_ENDPOINTS } from '../endpoints'

export async function patchChoreReadNotification(notificationId: number) {
  const { data } = await api.patch<ReadNotification>(
    NOTIFICATION_ENDPOINTS.CHORE_READ(notificationId)
  )

  return data
}
