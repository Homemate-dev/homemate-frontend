import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { patchChoreStatus } from '@/libs/api/chore/patchChoreStatus'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadge } from '@/libs/utils/getNewlyAcquiredBadges'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'

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
    onSuccess: async (resp, choreInstanceId) => {
      const serverStatus = resp.data.choreStatus as 'COMPLETED' | 'PENDING'
      qc.setQueryData<any[] | undefined>(queryKey, (old) =>
        old?.map((item) =>
          Number(item.id) === Number(choreInstanceId) ? { ...item, status: serverStatus } : item
        )
      )

      // 미션 완료 시 모달
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

      // 뱃지 획득 시 모달
      const prevBadge = qc.getQueryData<ResponseBadge[]>(['badge', 'acquired']) ?? []

      const nextBadge = await qc.fetchQuery<ResponseBadge[]>({
        queryKey: ['badge', 'acquired'],
        queryFn: getAcquiredBadges,
      })

      const newlyAcquired = getNewlyAcquiredBadge(prevBadge, nextBadge)

      newlyAcquired.forEach((badge) => {
        dispatch(
          openAchievementModal({
            kind: 'mission',
            title: `${badge.badgeTitle} 뱃지 획득`,
            desc: getBadgeDesc(badge, nextBadge),
            icon: badge.badgeImageUrl,
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
