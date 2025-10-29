import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function deleteChore(choreInstanceId: number, applyToAll: boolean) {
  const { data } = await api.delete(CHORE_ENDPOINTS.DELETE(choreInstanceId), {
    params: { applyToAll },
  })

  return data
}
