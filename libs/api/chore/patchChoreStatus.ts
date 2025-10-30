import { ToggleResp } from '@/types/chore'

import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function patchChoreStatus(choreInstanceId: number): Promise<ToggleResp> {
  const { data } = await api.patch<ToggleResp>(CHORE_ENDPOINTS.TOGGLE_COMPLETE(choreInstanceId))

  return data
}
