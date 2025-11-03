export type BaseNotification = {
  id: number
  title: string
  message: string
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export type ChoreNotification = BaseNotification & {
  type: 'chore'
  choreInstanceId: number
  scheduledAt: string
}

export type NoticeNotification = BaseNotification & {
  type: 'notice'
  url?: string | null
  scheduledAt?: string | null
}

export type ReadNotification = {
  id: number
  isRead: boolean
  readAt: string | null
}
