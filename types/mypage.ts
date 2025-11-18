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
  totalBadgeCount: number
  acquiredBadgeCount: number
}

// 최초 알림 설정 여부 조회 resp
export type FirstAlertStatusResp = {
  firstSetupCompleted: boolean
  notificationTime: string
}

// 최초 알림 시간 설정
export type FirstAlertTimeResp = {
  firstSetupCompleted: boolean
  masterEnabled: boolean
  notificationTime: string
  updatedAt: string
}

// 알림 설정 변경
// - 알림 여부 설정
export type AlertType = 'master' | 'chore' | 'notice'

/// - 응답
export type UpdateAlertResp = {
  masterEnabled: boolean
  choreEnabled: boolean
  noticeEnabled: boolean
  updatedAt: string
}

// 알림 시간 조회/설정 바디 응답
export type ResponseNotificationTime = {
  notificationTime: string
  updatedAt: string
}
