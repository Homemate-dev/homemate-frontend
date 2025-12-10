import { ResponseBadge } from '@/types/badge'

export function getNewlyAcquiredBadgeByTime(
  prevBadge: ResponseBadge[] | undefined,
  nextBadge: ResponseBadge[] | undefined
) {
  if (!nextBadge) return

  // 이전/현재 목록에서 "획득 완료(acquired) + 획득 시간(acquiredAt) 존재"하는 뱃지만 추림
  const nextAcquired = nextBadge.filter((b) => b.acquired && b.acquiredAt)

  if (!prevBadge) {
    return []
  }

  const prevAcquired = (prevBadge ?? []).filter((b) => b.acquired && b.acquiredAt)
  // 이전에 획득한 뱃지가 없던 상태라면 → 이번에 획득한 애들 전부 새로 획득한 걸로 처리
  if (prevAcquired.length === 0) {
    return [...nextAcquired].sort(
      (a, b) => new Date(a.acquiredAt!).getTime() - new Date(b.acquiredAt!).getTime()
    )
  }

  // 이전까지 획득한 뱃지들 중 "가장 최근 획득 시간"을 baseline으로 사용
  const baselineMs = prevAcquired.reduce(
    (latestMs, cur) => {
      const curMs = new Date(cur.acquiredAt!).getTime()

      if (Number.isNaN(curMs)) return latestMs
      if (latestMs === null) return curMs

      return curMs > latestMs ? curMs : latestMs
    },
    null as number | null
  )

  if (baselineMs === null) return []

  // baseline 이후에 새로 획득한 뱃지만 필더링
  const newlyAcquired = nextAcquired.filter((b) => {
    const acquiredMs = new Date(b.acquiredAt!).getTime()

    if (Number.isNaN(acquiredMs)) return false

    return acquiredMs > baselineMs
  })

  // 오래된 순으로 보여주기
  newlyAcquired.sort(
    (a, b) => new Date(a.acquiredAt!).getTime() - new Date(b.acquiredAt!).getTime()
  )

  return newlyAcquired
}
