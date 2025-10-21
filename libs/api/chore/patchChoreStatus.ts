import { ResponseChoreInstance } from '@/types/chore'

import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function patchChoreStatus(choreInstanceId: number) {
  const { data } = await api.patch<ResponseChoreInstance>(
    CHORE_ENDPOINTS.TOGGLE_COMPLETE(choreInstanceId)
  )

  return data
}
