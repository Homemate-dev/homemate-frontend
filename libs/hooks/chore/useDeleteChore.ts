import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteChore } from '@/libs/api/chore/deleteChore'

type deleteType = {
  choreInstanceId: number
  selectedDate: string
  applyToAfter?: boolean
}

export function useDeleteChore() {
  const qc = useQueryClient()

  return useMutation<void, unknown, deleteType>({
    mutationFn: ({ choreInstanceId, applyToAfter = false }) =>
      deleteChore(choreInstanceId, applyToAfter),
    onSuccess: (_data, { selectedDate, choreInstanceId }) => {
      // 해당 날짜 리스트 새로고침
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', selectedDate] })

      // 캘린더 새로고침
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'] })

      qc.invalidateQueries({ queryKey: ['chore', 'detail', choreInstanceId] })

      qc.invalidateQueries({ queryKey: ['mission', 'monthly'] })
      qc.invalidateQueries({ queryKey: ['badge', 'acquired'] })
    },
  })
}
