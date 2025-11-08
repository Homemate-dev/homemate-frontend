import { Recommend } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getRecommend(limitTrending = 5) {
  const { data } = await api.get<Recommend[]>(RECOMMEND_ENDPOINTS.OVERVIEW, {
    params: { limitTrending },
  })

  return data
}
