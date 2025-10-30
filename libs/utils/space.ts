// libs/utils/space.ts

// 서버 enum
export type SpaceApi = 'KITCHEN' | 'BATHROOM' | 'BEDROOM' | 'PORCH' | 'ETC'

// UI 라벨 (화면 표시용)
export type SpaceUi = '주방' | '욕실' | '침실' | '현관' | '기타'

// 화면 드롭다운 옵션: 항상 '기타'로 표기
export const SPACE_UI_OPTIONS: SpaceUi[] = ['주방', '욕실', '침실', '현관', '기타']

// 서버 enum → UI 라벨
export function toSpaceUi(input?: string | null): SpaceUi | null {
  if (!input) return null

  // enum이 온 경우
  switch (input) {
    case 'KITCHEN':
      return '주방'
    case 'BATHROOM':
      return '욕실'
    case 'BEDROOM':
      return '침실'
    case 'PORCH':
      return '현관'
    case 'ETC':
      return '기타'
  }

  // 혹시 서버/기존 데이터가 한글로 올 수도 있는 경우를 안전 처리
  switch (input) {
    case '주방':
      return '주방'
    case '욕실':
      return '욕실'
    case '침실':
      return '침실'
    case '현관':
      return '현관'
    case '공간-기타':
    case '기타':
      return '기타'
    default:
      return null
  }
}

// UI 라벨 → 서버 enum
export function toSpaceApi(input?: string | null): SpaceApi | null {
  if (!input) return null
  switch (input) {
    case '주방':
      return 'KITCHEN'
    case '욕실':
      return 'BATHROOM'
    case '침실':
      return 'BEDROOM'
    case '현관':
      return 'PORCH'
    // UI는 '기타'로 보이지만 서버에는 ETC로 전달
    case '기타':
    case '공간-기타': // 혹시라도 UI에서 이 값이 넘어오면 동일 처리
      return 'ETC'
    default:
      return null
  }
}
