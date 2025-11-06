import { api } from '../axios'
import { AUTH_ENDPOINTS } from '../endpoints'

export const postLogout = async () => {
  const { data } = await api.post(AUTH_ENDPOINTS.LOGOUT)
  return data
}
