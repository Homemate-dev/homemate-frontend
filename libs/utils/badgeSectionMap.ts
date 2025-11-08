export const BADGE_SECTION_MAP: Record<string, string> = {
  // 시작
  START_HALF: '시작',

  // 전체 집안일
  SEED_CHORE: '전체 집안일',
  MEDIUM_CHORE: '전체 집안일',
  MASTER_CHORE: '전체 집안일',

  // 집안일 등록
  SMALL_J: '집안일 등록',
  LARGE_J: '집안일 등록',
  POWER_J: '집안일 등록',

  // 미션 달성
  SEED_MISSION: '미션 달성',
  EXPERT_MISSION: '미션 달성',
  MASTER_MISSION: '미션 달성',

  // 주방
  BEGINNER_KITCHEN: '주방',
  EXPERT_KITCHEN: '주방',
  MASTER_KITCHEN: '주방',

  // 욕실
  BEGINNER_BATHROOM: '욕실',
  EXPERT_BATHROOM: '욕실',
  MASTER_BATHROOM: '욕실',

  // 현관
  BEGINNER_PORCH: '현관',
  EXPERT_PORCH: '현관',
  MASTER_PORCH: '현관',

  // 빨래하기
  SEED_LAUNDRY: '빨래하기',
  EXPERT_LAUNDRY: '빨래하기',
  MASTER_LAUNDRY: '빨래하기',

  // 거울/수전 물때 닦기
  WATER_SPOTS_ERASER: '거울/수전 물때 닦기',
  WATER_SPOTS_HUNTER: '거울/수전 물때 닦기',
  WATER_SPOTS_DESTROYER: '거울/수전 물때 닦기',

  // 소화기 점검
  CHECK_FIRE_EXHAUSTER: '소화기 점검',

  // 바닥 청소기 돌리기
  BEGINNER_FAIRY: '바닥 청소기 돌리기',
  EXPERT_FAIRY: '바닥 청소기 돌리기',
  MASTER_FAIRY: '바닥 청소기 돌리기',

  // 기상후 침구 정리하기
  BEGINNER_MORNING: '기상후 침구 정리하기',
  EXPERT_MORNING: '기상후 침구 정리하기',
  MASTER_MORNING: '기상후 침구 정리하기',

  // 쓰레기통 비우기
  BEGINNER_TRASH_BIN: '쓰레기통 비우기',
  EXPERT_TRASH_BIN: '쓰레기통 비우기',
  MASTER_TRASH_BIN: '쓰레기통 비우기',
}

// 표시 순서
export const SECTION_ORDER = [
  '시작',
  '전체 집안일',
  '집안일 등록',
  '미션 달성',
  '주방',
  '욕실',
  '침실',
  '현관',
  '빨래하기',
  '거울/수전 물때 닦기',
  '소화기 점검',
  '바닥 청소기 돌리기',
  '기상후 침구 정리하기',
  '쓰레기통 비우기',
]

// badgeType → 섹션명 반환 함수
export const getBadgeSection = (badgeType: string): string => BADGE_SECTION_MAP[badgeType] ?? '기타'

// 섹션명 -> 문장 앞부분 표현 함수
const SPACE_SECTIONS = new Set(['주방', '욕실', '침실', '현관'])
const CHORE_SECTIONS = new Set([
  '빨래하기',
  '거울/수전 물때 닦기',
  '소화기 점검',
  '바닥 청소기 돌리기',
  '기상후 침구 정리하기',
  '쓰레기통 비우기',
])

export function getBadgeTargetPhrase(section: string) {
  if (SPACE_SECTIONS.has(section)) {
    return `${section} 공간 청소를`
  }

  if (CHORE_SECTIONS.has(section)) {
    return `${section}를`
  }

  // 나머지
  switch (section) {
    case '전체 집안일':
      return '집안일'

    case '집안일 등록':
      return '집안일 등록을'

    case '미션 달성':
      return '미션 달성을'

    case '시작':
      return '집안일을'
    default:
      return `${section}를`
  }
}
