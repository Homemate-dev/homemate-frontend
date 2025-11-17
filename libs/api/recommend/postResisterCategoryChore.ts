import { RegisterChoreResponse } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function postResisterCategoryChore(categoryChoreId: number, category: string) {
  const { data } = await api.post<RegisterChoreResponse>(
    RECOMMEND_ENDPOINTS.REGISTER_CATEGORY(categoryChoreId),
    { category }
  )

  return data
}
