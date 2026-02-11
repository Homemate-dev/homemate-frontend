import { WithdrawBody } from '@/types/mypage'

import { api } from '../axios'
import { AUTH_ENDPOINTS } from '../endpoints'

export async function deleteWithdraw(body: WithdrawBody) {
  const { data } = await api.delete(AUTH_ENDPOINTS.WITHDRAW, {
    data: body,
  })
  return data
}
