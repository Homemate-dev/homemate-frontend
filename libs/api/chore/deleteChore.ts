import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function deleteChore(choreInstanceId: number, applyToAfter: boolean) {
  const { data } = await api.delete(CHORE_ENDPOINTS.DELETE(choreInstanceId), {
    params: { applyToAfter },
  })
  return data
}
