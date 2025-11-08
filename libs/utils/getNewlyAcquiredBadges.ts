import { ResponseBadge } from '@/types/badge'

// 새로 획득하게된 뱃지 골라내기
export function getNewlyAcquiredBadge(
  prevBadge: ResponseBadge[] | undefined,
  nextBadge: ResponseBadge[] | undefined
) {
  if (!nextBadge) return []

  const prevAcquired = new Set((prevBadge ?? []).filter((b) => b.acquired).map((b) => b.badgeType))

  return nextBadge.filter((b) => b.acquired && !prevAcquired.has(b.badgeType))
}
