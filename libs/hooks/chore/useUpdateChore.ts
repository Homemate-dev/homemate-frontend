import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateChore } from '@/libs/api/chore/updateChore'
import { ResponseChore, UpdateChoreDTO } from '@/types/chore'

type Vars = { choreId: number; dto: UpdateChoreDTO }

export default function useUpdateChore() {
  const qc = useQueryClient()

  return useMutation<ResponseChore, unknown, Vars>({
    mutationFn: ({ choreId, dto }) => updateChore(choreId, dto),
    onSuccess: (_resp, vars) => {
      // 날짜별 조회 리스트 갱신
      qc.invalidateQueries({
        queryKey: ['chore', 'byDate', vars.dto.startDate],
      })

      // 캘린더 dot 데이터 갱신
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
    },
  })
}
