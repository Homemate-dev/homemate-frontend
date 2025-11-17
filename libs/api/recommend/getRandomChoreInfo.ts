import { RandomChoreList } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getRandomChoreInfo(spaceChoreId: number) {
  const { data } = await api.get<RandomChoreList>(RECOMMEND_ENDPOINTS.RANDOM_CHORES(spaceChoreId))

  return data
}
