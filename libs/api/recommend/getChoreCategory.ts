import { ChoreCategory } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getChoreCategory() {
  const { data } = await api.get<ChoreCategory[]>(RECOMMEND_ENDPOINTS.CATEGORIES)

  return data
}
