import { useQuery } from '@tanstack/react-query'

import { getMyPage } from '@/libs/api/mypage/getMyPage'
import { MyPageResponse } from '@/types/mypage'

export function useMyPage() {
  return useQuery<MyPageResponse>({
    queryKey: ['user', 'me'],
    queryFn: getMyPage,
  })
}
