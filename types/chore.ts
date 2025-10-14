/**
 * 집안일 생성 요청 DTO
 */

export type RepeatType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

export const REPEAT_OPTIONS = [
  { label: '매일', type: 'DAILY', interval: 1 },
  { label: '1주', type: 'WEEKLY', interval: 1 },
  { label: '2주', type: 'WEEKLY', interval: 2 },
  { label: '1개월', type: 'MONTHLY', interval: 1 },
  { label: '3개월', type: 'MONTHLY', interval: 3 },
  { label: '6개월', type: 'MONTHLY', interval: 6 },
] as const
export type RepeatOption = (typeof REPEAT_OPTIONS)[number]

export type CreateChoreDTO = {
  title: string
  notification_yn: boolean // 알림 여부
  notification_time: string
  space: string
  repeatType: RepeatType
  repeatInterval: number
  startDate: string
  endDate: string
}

/**
 * 집안일 생성 응답
 */

export type ResponseChore = {
  id: number
  title: string
  notification_yn: boolean
  notification_time: string
  space: string
  repeatType: RepeatType
  repeatInterval: number
  startDate: string
  endDate: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

/**
 * 집안일 수정 요청 DTO
 * - 응답은 집안일 생성과 동일
 */

export type UpdateChoreDTO = CreateChoreDTO & {
  isUpdateAll: boolean // true: 전체 일정 수정, false: 해당 인스턴스만
}
