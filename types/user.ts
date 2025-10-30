export type MyPageResponse = {
  id: number
  provider: 'KAKAO' | 'APPLE' | 'GOOGLE' | string
  nickname: string
  profileImageUrl?: string
  createdAt: string
  lastLoginAt: string
  masterEnabled: boolean
  choreEnabled: boolean
  noticeEnabled: boolean
  notificationTime?: string // "18:00"
  updatedAt: string
}
