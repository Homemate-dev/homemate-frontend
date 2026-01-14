import { RecommendChores } from '@/types/recommend'

export function groupMonthlyChoresByCategoryName(list: RecommendChores[]) {
  const map = new Map<string, RecommendChores[]>()

  for (const item of list) {
    const key = item.categoryName ?? '기타'
    const chores = map.get(key) ?? []

    chores.push(item)
    map.set(key, chores)
  }

  const result = Array.from(map.entries()).map(([key, value]) => {
    return { categoryName: key, choresList: value }
  })

  return result
}
