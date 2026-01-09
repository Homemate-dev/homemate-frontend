import { useMutation } from '@tanstack/react-query'

import { deleteWithdraw } from '@/libs/api/mypage/deleteWithdraw'
import { WithdrawBody } from '@/types/mypage'

export function useWithdraw() {
  return useMutation({
    mutationFn: (body: WithdrawBody) => deleteWithdraw(body),
  })
}
