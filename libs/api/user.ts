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

export const patchNotificationSetting = async (
  type: 'master' | 'chore' | 'notice',
  enabled: boolean
) => {
  try {
    await api.patch(`/users/me/notification-settings/${type}`, { enabled })
    console.log(`${type} 알림 설정 변경 성공`)
  } catch (error) {
    console.error(`${type} 알림 설정 변경 실패:`, error)
    throw error
  }
}

export const patchNotificationTime = async (
  hour: number,
  minute: number,
  ampm: '오전' | '오후'
) => {
  const convertedHour = ampm === '오후' && hour < 12 ? hour + 12 : hour
  const formattedTime = `${String(convertedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  const res = await api.patch('/users/me/notification-settings/time', {
    notificationTime: formattedTime,
  })
  return res.data
}

export const fetchNotificationTime = async () => {
  const res = await api.get('/users/me/notification-settings/time')
  return res.data
}

export const postLogout = async () => {
  const res = await api.post('/auth/logout')
  return res.data
}
