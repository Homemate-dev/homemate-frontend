import { CreateChoreDTO, ResponseChore } from '@/types/chore'

import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

// 집안일 생성
export async function postCreateChore(dto: CreateChoreDTO) {
  const { data } = await api.post<ResponseChore>(CHORE_ENDPOINTS.CREATE, dto)
  return data
}
