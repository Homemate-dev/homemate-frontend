import { RandomChore } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getRandomChores(): Promise<RandomChore[]> {
  const { data } = await api.get<RandomChore[]>(RECOMMEND_ENDPOINTS.RANDOM)

  return data
}
