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
