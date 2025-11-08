import { SpaceList } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getSpaceList() {
  const { data } = await api.get<SpaceList[]>(RECOMMEND_ENDPOINTS.SPACES)

  return data
}
