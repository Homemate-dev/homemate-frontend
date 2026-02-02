export const BADGE_SECTION_MAP: Record<string, string> = {
  // 시작
  START_HALF: '시작',

  // 연속
  STREAK_THREE: '루틴 형성',
  STREAK_FIVE: '루틴 형성',
  STREAK_TEN: '루틴 형성',

  // 전체 집안일
  MIRACLE_MORNING: '집안일 완료',
  GOD_LIVE_DINNER: '집안일 완료',
  SEED_CHORE: '집안일 완료',
  MEDIUM_CHORE: '집안일 완료',
  MASTER_CHORE: '집안일 완료',

  // 집안일 등록 (J)
  START_J: '집안일 등록',
  SMALL_J: '집안일 등록',
  LARGE_J: '집안일 등록',
  POWER_J: '집안일 등록',

  // 추천 집안일 등록
  RECOMMEND_EXPLORER: '추천 집안일 등록', // 집안일 탐색꾼
  RECOMMEND_ADVENTURER: '추천 집안일 등록', // 집안일 모험가
  RECOMMEND_COLLECTOR: '추천 집안일 등록', // 집안일 콜렉터

  // 미션 달성
  SEED_MISSION: '미션 달성',
  EXPERT_MISSION: '미션 달성',
  MASTER_MISSION: '미션 달성',

  // 주방
  BEGINNER_KITCHEN: '주방 집안일',
  EXPERT_KITCHEN: '주방 집안일',
  MASTER_KITCHEN: '주방 집안일',

  // 욕실
  BEGINNER_BATHROOM: '욕실 집안일',
  EXPERT_BATHROOM: '욕실 집안일',
  MASTER_BATHROOM: '욕실 집안일',

  // 침실
  BEGINNER_BEDROOM: '침실 집안일',
  EXPERT_BEDROOM: '침실 집안일',
  MASTER_BEDROOM: '침실 집안일',

  // 현관
  BEGINNER_PORCH: '현관 집안일',
  EXPERT_PORCH: '현관 집안일',
  MASTER_PORCH: '현관 집안일',

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

  // 알림
  ALARM_ALTER_START: '알림 설정',
  ACCUMULATIVE_ALARM_START: '알림 설정',
  ACCUMULATIVE_ALARM_FIVE: '알림 설정',
  ACCUMULATIVE_ALARM_TEN: '알림 설정',
}

// 표시 순서
export const SECTION_ORDER = [
  '시작',
  '루틴 형성',
  '집안일 완료',
  '집안일 등록',
  '추천 집안일 등록',
  '미션 달성',
  '주방 집안일',
  '욕실 집안일',
  '침실 집안일',
  '현관 집안일',
  '빨래하기',
  '거울/수전 물때 닦기',
  '소화기 점검',
  '바닥 청소기 돌리기',
  '기상후 침구 정리하기',
  '쓰레기통 비우기',
  '알림 설정',
]

// badgeType → 섹션명 반환 함수
export const getBadgeSection = (badgeType: string): string => BADGE_SECTION_MAP[badgeType] ?? '기타'

// 섹션명 -> 문장 앞부분 표현 함수
const SPACE_SECTIONS = new Set(['주방 집안일', '욕실 집안일', '침실 집안일', '현관 집안일'])
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

  switch (section) {
    case '시작':
      return '집안일을'

    case '루틴 형성':
      return '루틴 형성을'

    case '집안일 완료':
      return '집안일을'

    case '집안일 등록':
      return '집안일 등록을'

    case '추천 집안일 등록':
      return '추천 집안일 등록을'

    case '미션 달성':
      return '미션을'

    case '알림 설정':
      return '알림 설정을'

    default:
      return `${section}을`
  }
}
