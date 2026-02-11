import { ChoreItem } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getMonthlyCategoryChores(categoryId: number, subCategory?: string) {
  const url = subCategory
    ? `${RECOMMEND_ENDPOINTS.MONTHLY_CATEGORY_CHORES(categoryId)}?subCategory=${subCategory}`
    : RECOMMEND_ENDPOINTS.MONTHLY_CATEGORY_CHORES(categoryId)

  const { data } = await api.get<ChoreItem[]>(url)
  return data
}
