import { ResponseChore, UpdateChoreDTO } from '@/types/chore'

import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function updateChore(choreId: number, dto: UpdateChoreDTO) {
  const { data } = await api.put<ResponseChore>(CHORE_ENDPOINTS.UPDATE(choreId), dto)

  return data
}
