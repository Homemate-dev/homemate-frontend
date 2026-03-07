import { useQuery } from '@tanstack/react-query'

import { getMonthlyNameList } from '@/libs/api/recommend/getMonthlyNameList'
import { MonthlyNameList } from '@/types/recommend'

export default function useMonthlyNameList() {
  return useQuery<MonthlyNameList[]>({
    queryKey: ['MonthlyNameList'],
    queryFn: getMonthlyNameList,
  })
}
