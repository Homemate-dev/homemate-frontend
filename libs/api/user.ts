import { api } from './axios'

export const fetchMyPage = async () => {
  const res = await api.get('/users/me')
  return res.data
}
