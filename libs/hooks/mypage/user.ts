import { useQuery } from '@tanstack/react-query'

import { fetchMyPage } from '@/libs/api/user'
import { MyPageResponse } from '@/types/user'

export function useMyPage() {
  return useQuery<MyPageResponse>({
    queryKey: ['user', 'me'],
    queryFn: fetchMyPage,
  })
}
