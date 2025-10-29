import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteChore } from '@/libs/api/chore/deleteChore'

type deleteType = {
  choreInstanceId: number
  selectedDate: string
  applyToAll?: boolean
}

export function useDeleteChore() {
  const qc = useQueryClient()

  return useMutation<void, unknown, deleteType>({
    mutationFn: ({ choreInstanceId, applyToAll = false }) =>
      deleteChore(choreInstanceId, applyToAll),
    onSuccess: (_data, { selectedDate }) => {
      // 해당 날짜 리스트 새로고침
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', selectedDate] })

      // 캘린더 새로고침
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'] })
    },
  })
}
