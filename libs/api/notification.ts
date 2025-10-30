import { api } from '@/libs/api/axios'

// 알림 목록 조회
export const fetchNotifications = async (type: 'chore' | 'notice') => {
  const endpoint = type === 'chore' ? '/notifications/chores' : '/notifications/notices'
  const res = await api.get(endpoint)
  return res.data
}
