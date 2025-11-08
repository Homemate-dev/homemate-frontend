import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { patchChoreStatus } from '@/libs/api/chore/patchChoreStatus'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'

import type { ToggleResp } from '@/types/chore'

const missionIcon = require('../../../assets/images/icon/missionIcon.png')

export function usePatchChoreStatus(selectedDate: string) {
  const qc = useQueryClient()
  const dispatch = useDispatch()
  const queryKey = ['chore', 'byDate', selectedDate]

  return useMutation<ToggleResp, unknown, number>({
    // 서버 요청
    mutationFn: (choreInstanceId) => patchChoreStatus(choreInstanceId),

    // 1) 낙관적 업데이트: 체크 즉시 UI 토글
    onMutate: async (choreInstanceId) => {
      await qc.cancelQueries({ queryKey })

      qc.setQueryData<any[] | undefined>(queryKey, (old) =>
        old?.map((item) =>
          Number(item.id) === Number(choreInstanceId)
            ? { ...item, status: item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
            : item
        )
      )
    },

    // 2) 성공 시: 서버 응답으로 상태 확정
    onSuccess: (resp, choreInstanceId) => {
      const serverStatus = resp.data.choreStatus as 'COMPLETED' | 'PENDING'
      qc.setQueryData<any[] | undefined>(queryKey, (old) =>
        old?.map((item) =>
          Number(item.id) === Number(choreInstanceId) ? { ...item, status: serverStatus } : item
        )
      )

      const completedMissions = resp.missionResult?.filter((m) => m.completed) ?? []

      completedMissions.forEach((mission) => {
        dispatch(
          openAchievementModal({
            kind: 'mission',
            title: '미션 달성!',
            desc: `이달의 미션 \n ${mission.title} 미션을 완료했어요!`,
            icon: missionIcon,
          })
        )
      })
    },

    // 3) 최종 동기화
    onSettled: () => {
      qc.invalidateQueries({ queryKey })
    },
  })
}
