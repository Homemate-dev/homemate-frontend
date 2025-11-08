// 카테고리 하위 집안일 조회

import { SpaceChoreList } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getSpaceChoreList(space: string) {
  const { data } = await api.get<SpaceChoreList[]>(RECOMMEND_ENDPOINTS.SPACE_CHORES(space))

  return data
}
