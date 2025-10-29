export function inferUnitFromTitle(title: string) {
  const t = title.trim()

  // 'n개'가 있으면 '개'로 표시
  if (/\d+\s*개/.test(t) || /개\s*완료/.test(t)) return '개'

  // 'n회/번' 이면 '회'로 표시
  if (/\d+\s*(회|번)/.test(t)) return '회'

  // '추가하기/완료하기' 등 동사 + 자유 미션
  if (/(하기|청소|정리|닦기|돌리기|버리기|비우기|빨래|점검|교체)/.test(t)) {
    // 단, 'N개'가 없고, 자유/월별 집안일로 보이는 문구면 회
    return '회'
  }

  // 기본값
  return '개'
}
