// libs/hooks/notification/usePatchNoticeReadNotification.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { patchNoticeReadNotification } from '@/libs/api/notification/patchNoticeReadNotification'

import type { NoticeNotification, ReadNotification } from '@/types/notification'

export function useNoticeReadNotification() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) => patchNoticeReadNotification(notificationId),

    // 낙관적 업데이트
    onMutate: async (notificationId: number) => {
      const key = ['notifications', 'notice'] as const
      await qc.cancelQueries({ queryKey: key })

      const prev = qc.getQueryData<NoticeNotification[]>(key)
      if (prev) {
        const next = prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        qc.setQueryData(key, next)
      }
    },

    // 성공 시 실제 데이터 동기화
    onSuccess: (_res: ReadNotification) => {
      qc.invalidateQueries({ queryKey: ['notifications', 'notice'] })
    },
  })
}
