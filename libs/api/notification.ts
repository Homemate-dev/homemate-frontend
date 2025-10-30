import { api } from '@/libs/api/axios'

// 알림 목록 조회
export const fetchNotifications = async (type: 'chore' | 'notice') => {
  const endpoint = type === 'chore' ? '/notifications/chores' : '/notifications/notices'
  const res = await api.get(endpoint)
  return res.data
}

// 알림 읽음 처리
export const patchReadNotification = async (type: 'chore' | 'notice', id: number) => {
  const endpoint = type === 'chore' ? `/notifications/chores/${id}` : `/notifications/notices/${id}`
  const res = await api.patch(endpoint)
  return res.data
}
