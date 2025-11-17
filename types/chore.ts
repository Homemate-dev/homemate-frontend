/**
 * 집안일 생성 요청 DTO
 */

export type RepeatType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export type CreateChoreDTO = {
  title: string
  notificationYn: boolean // 알림 여부
  notificationTime: string | null
  space: string
  repeatType: RepeatType
  repeatInterval: number
  startDate: string
  endDate: string
}

/**
 * 집안일 생성 응답
 */

export interface MissionResult {
  id: number
  title: string
  targetCount: number
  currentCount: number
  completed: boolean
}

export interface ResponseChore {
  data: {
    id: number
    title: string
    notificationYn: boolean
    notificationTime: string | null
    repeatType: RepeatType
    repeatInterval: number
    startDate: string
    endDate: string
    isDeleted: boolean
    space: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  missionResults: MissionResult[]
}

/**
 * 집안일 수정 요청 DTO
 * - 응답은 집안일 생성과 동일
 */

export type UpdateChoreDTO = CreateChoreDTO & {
  applyToAfter: boolean // true: 전체 일정 수정, false: 해당 인스턴스만
}

/**
 * 집안일 수정을 위한 데이터 조회 응답
 */

export type responseChoreDetail = {
  choreId: number
  title: string
  notificationYn: boolean // 알림 여부
  notificationTime: string | null
  space: string
  repeatType: RepeatType
  repeatInterval: number
  startDate: string
  endDate: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

/**
 * 당일 집안일 리스트 조회
 */

export type statusType = 'PENDING' | 'COMPLETED'

export type responseChoreByDate = {
  id: number
  choreId: number
  titleSnapshot: string
  dueDate: string
  repeatType: RepeatType
  repeatInterval: number
  notificationTime: string
  status: statusType
  completedAt: string | null
  createdAt: string
  updatedAt: string | null
}

/**
 * 캘린더 집안일 유무 확인
 */
export type ChoreCalendarDates = string[]

/**
 * 집안일 완료/해제
 */

export type ResponseChoreInstance = {
  id: number
  choreId: number
  titleSnapshot: string
  dueDate: string
  notificationTime: string
  choreStatus: statusType
  completedAt: string | null
  createdAt: string
  updatedAt: string | null
}

/**
 * 집안일 완료/해제 + 미션 결과 응답
 * - missionResult가 없을 수도 있음 (빈 배열)
 */
export type ToggleResp = {
  data: ResponseChoreInstance
  missionResult?: {
    id: number
    title: string
    targetCount: number
    currentCount: number
    completed: boolean
  }[]
}
