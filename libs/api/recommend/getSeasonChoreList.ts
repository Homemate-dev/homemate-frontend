import { ChoreItem } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getSeasonChoreList() {
  const { data } = await api.get<ChoreItem[]>(RECOMMEND_ENDPOINTS.SEASON_CATEGORY_CHORES)
  return data
}
