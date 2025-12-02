import { ResponseBadge } from '@/types/badge'

export function getNewlyAcquiredBadgeByTime(
  prevBadge: ResponseBadge[] | undefined,
  nextBadge: ResponseBadge[] | undefined
) {
  if (!nextBadge) return

  // 1. 이전에 이미 획득한 뱃지들 중, acquiredAt 있는 것만 추리기
  const prevAcquiredWithTime = (prevBadge ?? []).filter((b) => b.acquired && b.acquiredAt)

  // 2. 이전 배지가 하나도 없거나, acquiredAt 있는 애가 없으면
  //    → "기존 배지들을 한 번에 다 새로 얻은 것"처럼 보이기 때문에
  //       여기서는 "새로 획득한 배지 없음"으로 처리 (최초 1회 보호용)
  if (prevAcquiredWithTime.length === 0) {
    return []
  }

  // 3. 이전까지 획득한 배지들 중, 가장 최신 acquiredAt 찾기
  const baselineDate = prevAcquiredWithTime.reduce<Date | null>((latest, cur) => {
    const curTime = new Date(cur.acquiredAt!)

    if (!latest) return curTime
    return curTime > latest ? curTime : latest
  }, null)

  if (!baselineDate) {
    return []
  }

  const baselineMs = baselineDate.getTime()

  // 4. 새 목록(nextBadge) 중, baseline 이후에 획득된 배지들만 필터링
  const newlyAcquired = nextBadge.filter((b) => {
    if (!b.acquired || !b.acquiredAt) return false

    const acquiredMs = new Date(b.acquiredAt).getTime()

    if (Number.isNaN(acquiredMs)) return false

    return acquiredMs > baselineMs
  })

  // 5. 오래된 순으로 정렬해서 모달 뜨게 하고 싶으면 정렬
  newlyAcquired.sort((a, b) => {
    return new Date(a.acquiredAt!).getTime() - new Date(b.acquiredAt!).getTime()
  })

  return newlyAcquired
}
