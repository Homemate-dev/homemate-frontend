// 드롭다운 라벨 → API 필드 변환
export function toRepeatFields(label: string | null) {
  if (!label || label === '한번') return { repeatType: 'NONE' as const, repeatInterval: 0 }
  if (label === '매일') return { repeatType: 'DAILY' as const, repeatInterval: 1 }
  if (label === '1주마다') return { repeatType: 'WEEKLY' as const, repeatInterval: 1 }
  if (label === '2주마다') return { repeatType: 'WEEKLY' as const, repeatInterval: 2 }
  if (label === '매달') return { repeatType: 'MONTHLY' as const, repeatInterval: 1 }
  if (label === '3개월마다') return { repeatType: 'MONTHLY' as const, repeatInterval: 3 }
  if (label === '6개월마다') return { repeatType: 'MONTHLY' as const, repeatInterval: 6 }
  return { repeatType: 'NONE' as const, repeatInterval: 0 }
}

export function toRepeat(label: string | null) {
  if (!label || label === '한번') return { repeatType: 'NONE' as const, repeatInterval: 0 }
  if (label === '매일') return { repeatType: 'DAILY' as const, repeatInterval: 1 }
  if (label === '1주') return { repeatType: 'WEEKLY' as const, repeatInterval: 1 }
  if (label === '2주') return { repeatType: 'WEEKLY' as const, repeatInterval: 2 }
  if (label === '매달') return { repeatType: 'MONTHLY' as const, repeatInterval: 1 }
  if (label === '3개월') return { repeatType: 'MONTHLY' as const, repeatInterval: 3 }
  if (label === '6개월') return { repeatType: 'MONTHLY' as const, repeatInterval: 6 }
  if (label === '1년') return { repeatType: 'YEARLY' as const, repeatInterval: 1 }
  return { repeatType: 'NONE' as const, repeatInterval: 0 }
}

// API 필드 → 드롭다운 라벨 변환
export function toRepeatLabel(type: string, interval: number) {
  if (type === 'NONE') return '한번'
  if (type === 'DAILY' && interval === 1) return '매일'
  if (type === 'WEEKLY' && interval === 1) return '1주마다'
  if (type === 'WEEKLY' && interval === 2) return '2주마다'
  if (type === 'MONTHLY' && interval === 1) return '매달'
  if (type === 'MONTHLY' && interval === 3) return '3개월마다'
  if (type === 'MONTHLY' && interval === 6) return '6개월마다'
  return '-'
}

export function styleFromRepeatColor(cls: string | undefined) {
  if (!cls) return {}
  const bgMatch = cls.match(/bg-\[#([0-9A-Fa-f]{6})\]/)
  const textMatch = cls.match(/text-\[#([0-9A-Fa-f]{6})\]/)
  const style: any = {}
  if (bgMatch) style.backgroundColor = `#${bgMatch[1]}`
  if (textMatch) style.color = `#${textMatch[1]}`
  return style
}
