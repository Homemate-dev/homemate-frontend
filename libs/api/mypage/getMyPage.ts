import { api } from '../axios'
import { MYPAGE_ENDPOINTS } from '../endpoints'

export async function getMyPage() {
  const { data } = await api.get(MYPAGE_ENDPOINTS.GET_PROFILE)
  return data
}
