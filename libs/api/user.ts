import { api } from './axios'

export const fetchMyPage = async () => {
  const res = await api.get('/users/me')
  return res.data
}

export const fetchFirstSetupStatus = async () => {
  try {
    const res = await api.get('/users/me/notification-settings/first-setup-status')
    return res.data
  } catch (error) {
    console.error('알림 최초 설정 상태 조회 실패:', error)
    throw error
  }
}
