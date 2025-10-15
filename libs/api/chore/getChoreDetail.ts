import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function getChoreDetail(choreInstanceId: number) {
  const { data } = await api.get(CHORE_ENDPOINTS.DETAIL(choreInstanceId))

  return data
}
