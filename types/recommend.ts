import { SpaceApi } from '@/libs/utils/space'

import { RepeatType } from './chore'

// 추천 화면 개요
export type Recommend = {
  name: string
  category: string
  count: string
}

// 랜덤 집안일 추천
export type RandomChore = {
  id: number
  space: string
  titleKo: string
}

// 랜덤 집안일 추천 정보
export type RandomChoreList = {
  id: number
  code: string
  titleKo: string
  repeatType: RepeatType
  repeatInterval: number
  space: string
  startDate: string
  endDate: string
  choreEnabled: boolean
}

// 집안일 카테고리
export type ChoreCategory = {
  category: string
}

// 집안일 리스트 조회
export type ChoreItem = {
  choreId: number
  title: string
  frequency: string
  spaceName?: string
  categoryName?: string
  isDuplicate: boolean
}

// 공간 리스트 조회
export type SpaceList = {
  spaceName: string
  space: SpaceApi
}

export interface MissionResult {
  id: number
  title: string
  targetCount: number
  currentCount: number
  completed: boolean
}

export interface RegisterChoreResponse {
  data: {
    id: number
    choreId?: number
    title: string
    notificationTime: string | null
    notificationYn?: boolean
    startDate: string
    endDate: string
    isDeleted: boolean
    space: string
    registrationType: string
    choreStatus: string
    repeatType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE' | 'YEARLY'
    repeatInterval: number
    completedAt?: string | null
    createdAt: string
    updatedAt: string
    deleteAt: string | null
  }
  missionResults: MissionResult[]
}
