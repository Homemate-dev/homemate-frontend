export function withSubjectJosa(word: string) {
  if (!word || word.length === 0) return word

  const lastChar = word[word.length - 1]
  const code = lastChar.charCodeAt(0) - 0xac00
  const hasJong = code % 28 !== 0 // 받침 여부

  return hasJong ? `${word}이` : `${word}가`
}
