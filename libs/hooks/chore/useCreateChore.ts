import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postCreateChore } from '@/libs/api/chore/postCreateChore'
import { CreateChoreDTO, ResponseChore } from '@/types/chore'

export default function useCreateChore() {
  const qc = useQueryClient()

  return useMutation<ResponseChore, unknown, CreateChoreDTO>({
    mutationFn: (dto) => postCreateChore(dto),
    onSuccess: (_resp, dto) => {
      // 해당 날짜의 집안일 리스트 갱신
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', dto.startDate] })

      // 캘린더 갱신(화면에 보이는 달만)
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
    },
  })
}
