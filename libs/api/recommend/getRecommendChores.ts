// 카테고리 하위 집안일 조회

import { RecommendChores } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getRecommendChores(category: string) {
  const { data } = await api.get<RecommendChores[]>(RECOMMEND_ENDPOINTS.CATEGORY_CHORES(category))

  return data
}
