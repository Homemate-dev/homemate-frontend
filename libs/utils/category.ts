// libs/utils/category.ts

// 서버 enum (카테고리)
export type CategoryApi =
  | 'WINTER'
  | 'WEEKEND_WHOLE_ROUTINE'
  | 'HOTEL_BATHROOM'
  | 'SAFETY_CHECK'
  | 'APPLIANCE_MAINTENANCE'
  | 'TEN_MINUTES_CLEANING'
  | 'MISSIONS'
  | 'ETC'

// UI 라벨
export type CategoryUi =
  | '겨울철 대청소'
  | '주말 대청소 루틴'
  | '호텔 화장실 따라잡기'
  | '안전 점검의 날'
  | '가전제품 관리하기'
  | '하루 10분 청소하기'
  | '미션 달성 집안일'
  | '카테고리-기타'

// enum -> UI 라벨
export function toCategoryUi(input?: string | null): CategoryUi | null {
  if (!input) return null
  switch (input) {
    case 'WINTER':
      return '겨울철 대청소'
    case 'WEEKEND_WHOLE_ROUTINE':
      return '주말 대청소 루틴'
    case 'HOTEL_BATHROOM':
      return '호텔 화장실 따라잡기'
    case 'SAFETY_CHECK':
      return '안전 점검의 날'
    case 'APPLIANCE_MAINTENANCE':
      return '가전제품 관리하기'
    case 'TEN_MINUTES_CLEANING':
      return '하루 10분 청소하기'
    case 'MISSIONS':
      return '미션 달성 집안일'
    case 'ETC':
      return '카테고리-기타'
    default:
      return null
  }
}

// UI 라벨 -> enum
export function toCategoryApi(input?: string | null): CategoryApi | null {
  if (!input) return null
  switch (input.trim()) {
    case '겨울철 대청소':
      return 'WINTER'
    case '주말 대청소 루틴':
      return 'WEEKEND_WHOLE_ROUTINE'
    case '호텔 화장실 따라잡기':
      return 'HOTEL_BATHROOM'
    case '안전 점검의 날':
      return 'SAFETY_CHECK'
    case '가전제품 관리하기':
      return 'APPLIANCE_MAINTENANCE'
    case '하루 10분 청소하기':
      return 'TEN_MINUTES_CLEANING'
    case '미션 달성 집안일':
      return 'MISSIONS'
    case '카테고리-기타':
      return 'ETC'
    default:
      return null
  }
}
