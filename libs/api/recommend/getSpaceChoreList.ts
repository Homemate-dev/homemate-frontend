import { SpaceChoreList } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getSpaceChoreList(space?: string) {
  const { data } = await api.get<SpaceChoreList[]>(RECOMMEND_ENDPOINTS.SPACE_CHORES, {
    params: space ? { space } : undefined,
  })

  return data
}
