import { ResponseBadge } from '@/types/badge'

import { getBadgeSection, getBadgeTargetPhrase } from './badgeSectionMap'

export function getBadgeDesc(badge: ResponseBadge, allBadges: ResponseBadge[]) {
  const section = getBadgeSection(badge.badgeType)
  const target = getBadgeTargetPhrase(section)
  const required = badge.requiredCount

  // 같은 섹션의 뱃지들을 단계 순서대로 정렬
  const sectionBadges = allBadges
    .filter((b) => getBadgeSection(b.badgeType) === section)
    .sort((a, b) => a.requiredCount - b.requiredCount)

  const currentIndex = sectionBadges.findIndex((b) => b.badgeType === badge.badgeType)
  const nextBadge = currentIndex >= 0 ? sectionBadges[currentIndex + 1] : undefined

  // 1) 다음 단계 뱃지가 없는 경우 = 이 섹션의 마지막 뱃지
  if (!nextBadge) {
    return `${target}을 ${required}회 완료했어요!\n모든 ${section} 뱃지를 완성했어요! 🎉`
  }

  // 2) 다음 단계가 있는 경우 → 남은 횟수 안내
  // remainingCount가 응답에 없으면 여기서 계산 방식 맞춰주면 됨
  const remain = nextBadge.remainingCount ?? 0

  return `${target} ${required}회 완료했어요!\n${remain}번 더해서 다음 뱃지를 획득해보세요`
}
