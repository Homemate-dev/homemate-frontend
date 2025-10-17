/**
 * 오전/오후 + 12시간제 → 24시간 'HH:mm' 변환
 */
export function toHHmm(a: '오전' | '오후', h12: number, m: number): string {
  let h24 = h12 % 12
  if (a === '오후') h24 += 12
  const HH = String(h24).padStart(2, '0')
  const MM = String(m).padStart(2, '0')
  return `${HH}:${MM}`
}

export const toHHmmParts = (hhmm?: string) => {
  const [h = '9', m = '0'] = (hhmm ?? '09:00').split(':')
  const H = Number(h)
  const M = Number(m) || 0
  const ampm: '오전' | '오후' = H >= 12 ? '오후' : '오전'
  const hour12 = ((H + 11) % 12) + 1
  return { ampm, hour12, minute: M }
}
