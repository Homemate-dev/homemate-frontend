import { useMutation, useQueryClient } from '@tanstack/react-query'

import { patchChoreStatus } from '@/libs/api/chore/patchChoreStatus'

export function usePatchChoreStatus(selectedDate: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (choreInstanceId: number) => patchChoreStatus(choreInstanceId),
    onSuccess: () => {
      // 선택한 날짜 리스트 새로고침
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', selectedDate] })
    },
  })
}
