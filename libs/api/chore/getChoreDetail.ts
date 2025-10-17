import { responseChoreDetail } from '@/types/chore'

import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function getChoreDetail(choreInstanceId: number) {
  const { data } = await api.get<responseChoreDetail>(CHORE_ENDPOINTS.DETAIL(choreInstanceId))

  return data
}
