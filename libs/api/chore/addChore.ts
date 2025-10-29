import { CreateChoreDTO, ResponseChore } from '@/types/chore'

import { CHORE_ENDPOINTS } from '../endpoints'
import { api } from './../axios'

// 집안일 생성
export async function createChore(dto: CreateChoreDTO) {
  const { data } = await api.post<ResponseChore>(CHORE_ENDPOINTS.CREATE, dto)
  return data
}
