import { useQuery } from '@tanstack/react-query'

import { getChoreByDate } from '@/libs/api/chore/getChoreByDate'
import { responseChoreByDate } from '@/types/chore'

function normalizeStatus(s?: string): 'COMPLETED' | 'PENDING' {
  if (!s) return 'PENDING'
  const v = String(s).trim().toUpperCase()
  if (v === 'COMPLETE') return 'COMPLETED'
  if (v === 'INCOMPLETE' || v === 'NOT_COMPLETED') return 'PENDING'
  return v as 'COMPLETED' | 'PENDING'
}

export function useChoreByDate(date: string) {
  return useQuery<responseChoreByDate[]>({
    queryKey: ['chore', 'byDate', date],
    queryFn: () => getChoreByDate(date),
    enabled: !!date,

    // 이전 데이터 유지 → 새로 클릭해도 잠깐 비는 구간 안 만듦
    placeholderData: (previousData) => previousData,

    // 자동 리패치/포커스 리패치 방지
    staleTime: 60 * 1000, // 60s 동안 신선 → 바로 리패치 안 함
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,

    // 서버에서 오는 상태/ID를 UI 기준으로 정규화
    select: (arr) =>
      arr.map((it) => ({
        ...it,
        id: Number(it.id),
        status: normalizeStatus((it as any).status ?? (it as any).choreStatus),
      })),
  })
}
