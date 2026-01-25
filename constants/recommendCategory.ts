// 계절 카테고리 enum
export const SEASON_CATEGORIES = ['WINTER', 'SPRING', 'SUMMER', 'FALL'] as const

export const SEASON_LABEL_MAP: Record<string, string> = {
  WINTER: '겨울철 집안일',
  SPRING: '봄철 집안일',
  SUMMER: '여름철 집안일',
  FALL: '가을철 집안일',
  AUTUMN: '가을철 집안일',
}

// 고정 카테고리로 취급할 enum
export const FIXED_CATEGORIES = [
  'MISSIONS',
  'AFTER_WORK_THIRTY_MINUTES',
  'IMMEDIATELY_THREE_MINUTES',
  'TEN_MINUTES_CLEANING',
] as const

export function isSeasonCategory(category: string): boolean {
  return SEASON_CATEGORIES.includes(category as any)
}

export const FIXED_NAME_TO_ENUM: Record<string, (typeof FIXED_CATEGORIES)[number]> = {
  '미션 달성 집안일': 'MISSIONS',
  '퇴근 후 30분 집안일': 'AFTER_WORK_THIRTY_MINUTES',
  '당장 할 수 있는 3분컷 집안일': 'IMMEDIATELY_THREE_MINUTES',
  '10분 루틴 집안일': 'TEN_MINUTES_CLEANING',
}

export const MONTHLY_CATEGORIES = [
  { id: 1, title: '새해맞이 체인지업' },
  { id: 2, title: '슬기로운 집콕 생활' },
  { id: 3, title: '안전한 겨울나기' },
  { id: 4, title: '새해 집들이 준비하기' },
] as const
