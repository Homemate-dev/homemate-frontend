import { RegisterChoreResponse, Space } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function postResisterSpaceChore(spaceChoreId: number, space: Space) {
  const { data } = await api.post<RegisterChoreResponse>(
    RECOMMEND_ENDPOINTS.REGISTER_SPACE(spaceChoreId),
    { space }
  )

  return data
}
