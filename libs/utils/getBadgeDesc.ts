import { ResponseBadge } from '@/types/badge'

import { getBadgeSection, getBadgeTargetPhrase } from './badgeSectionMap'

export function getBadgeDesc(badge: ResponseBadge, allBadges: ResponseBadge[]) {
  const section = getBadgeSection(badge.badgeType)
  const target = getBadgeTargetPhrase(section)

  const required = badge.requiredCount

  // 같은 섹션의 뱃지들만 모아 단계 순서대로 정렬
  const sectionBadges = allBadges
    .filter((b) => getBadgeSection(b.badgeType) === section)
    .sort((a, b) => a.requiredCount - b.requiredCount)

  // 현재 뱃지 위치 찾기
  const currentIndex = sectionBadges.findIndex((b) => b.badgeType === badge.badgeType)

  // 다음 단계 뱃지 찾기
  const nextBadge = sectionBadges[currentIndex + 1]

  if (badge.acquired) {
    // 이미 달성한 뱃지일 경우
    return `${target} ${required}회 완료했어요! \n ${nextBadge.remainingCount}번 더해서 다음 뱃지를 획득해보세요`
  } else {
    // 획득 뱃지가  section의 마지막 뱃지인 경우
    return `${target}을 ${required}회 완료했어요!\n모든 ${section} 뱃지를 완성했어요! 🎉`
  }
}
