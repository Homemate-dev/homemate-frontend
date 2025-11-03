export type RandomChore = {
  id: number
  space: string
  titleKo: string
}

// 집안일 카테고리
export type ChoreCategory = {
  category: string
}

// 집안일 리스트 조회
export type RecommendChores = {
  choreId: number
  title: string
  frequency: string
  categoryName: string
}

// 공간 리스트 조회
export type SpaceList = {
  spaceName: string
  space: string
}

// 공간 집안일 정보
export type SpaceChore = {
  id: number
  code: string
  titleKo: string
  repeatType: string
  repeatInterval: number
  space: string
}
