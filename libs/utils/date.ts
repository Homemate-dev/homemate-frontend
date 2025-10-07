/** 날짜를 YYYY-MM-DD 형식 문자열로 반환 */
export const toYMD = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const toYMD2 = (d: Date): string => {
  const y = String(d.getFullYear()).slice(2) // '2025' → '25'
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

/** 날짜 또는 문자열에서 해당 월의 1일(YYYY-MM-01)을 반환 */
export const toFirstDayOfMonth = (input: string | Date): string => {
  if (typeof input === 'string') {
    const [y, m] = input.split('-')
    return `${y}-${m}-01`
  }
  const y = input.getFullYear()
  const m = String(input.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}

/** YYYY-MM-DD → 한국식 "10월 3일" 포맷 */
export const formatKoreanDate = (ymd: string): string => {
  if (!ymd) return ''
  const [, m, d] = ymd.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

/** YYYY-MM-DD → 한국식 "10월 3일 (화)" 포맷 */
export const formatKoreanDateWithDay = (ymd: string): string => {
  if (!ymd) return ''
  const date = new Date(ymd)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dayName = days[date.getDay()]
  const [, m, d] = ymd.split('-')
  return `${Number(m)}월 ${Number(d)}일 (${dayName})`
}
