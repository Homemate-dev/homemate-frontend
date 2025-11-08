export const REPEAT_STYLE = {
  'DAILY-1': { label: '매일', color: 'bg-[#DDF4F6] text-[#46A1A6]' },
  'WEEKLY-1': { label: '1주', color: 'bg-[#F6EDFF] text-[#8A5EB3]' },
  'WEEKLY-2': { label: '2주', color: 'bg-[#DEE9FF] text-[#6296FE]' },
  'MONTHLY-1': { label: '1개월', color: 'bg-[#FFE6D3] text-[#FF7300]' },
  'MONTHLY-3': { label: '3개월', color: 'bg-[#E7F4E8] text-[#1BA300]' },
  'MONTHLY-6': { label: '6개월', color: 'bg-[#FBECF3] text-[#E568A0]' },
  'YEARLY-1': { label: '1년', color: 'bg-[#FFF3CA] text-[#FF961F]' },
  'NONE-0': { label: '한 번', color: 'bg-[#FFD8D8] text-[#F85C5C]' },
} as const

export function getRepeatKey(type?: string | null, interval?: number | null) {
  if (!type || type === 'NONE') return 'NONE-0'
  const iv = Math.max(1, Number(interval ?? 1))
  return `${type}-${iv}` as keyof typeof REPEAT_STYLE
}
