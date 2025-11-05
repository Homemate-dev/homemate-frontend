import { ResponseChore } from '@/types/chore'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function postResisterCategoryChore(categoryChoreId: number) {
  const { data } = await api.post<ResponseChore>(
    RECOMMEND_ENDPOINTS.REGISTER_CATEGORY(categoryChoreId)
  )

  return data
}
