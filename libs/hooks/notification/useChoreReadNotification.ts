import { useMutation, useQueryClient } from '@tanstack/react-query'

import { patchChoreReadNotification } from '@/libs/api/notification/patchChoreReadNotification'
import { ChoreNotification, ReadNotification } from '@/types/notification'

export function useChoreReadNotification() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) => patchChoreReadNotification(notificationId),

    // 낙관적 업데이트 (UI 즉시 반영)
    onMutate: async (notificationId: number) => {
      await qc.cancelQueries({ queryKey: ['notifications', 'chore'] })

      const prevData = qc.getQueryData<ChoreNotification[]>(['notifications', 'chore'])
      if (prevData) {
        const nextData = prevData.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        qc.setQueryData(['notifications', 'chore'], nextData)
      }
    },

    // 성공 시 목록 카운트 새로고침
    onSuccess: (_data: ReadNotification) => {
      qc.invalidateQueries({ queryKey: ['notifications', 'chore'] })
    },
  })
}
