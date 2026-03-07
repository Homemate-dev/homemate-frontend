import { MonthlyNameList } from '@/types/recommend'

import { api } from '../axios'
import { RECOMMEND_ENDPOINTS } from '../endpoints'

export async function getMonthlyNameList(): Promise<MonthlyNameList[]> {
  const { data } = await api.get<MonthlyNameList[]>(RECOMMEND_ENDPOINTS.MONTHLY_NAME_LIST)
  return data
}
