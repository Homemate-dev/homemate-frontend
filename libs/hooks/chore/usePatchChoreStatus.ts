import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { patchChoreStatus } from '@/libs/api/chore/patchChoreStatus'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadgeByTime } from '@/libs/utils/getNewlyAcquiredBadgeByTime'
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
      const completedMissions = resp.missionResults?.filter((m) => m.completed) ?? []

      completedMissions.forEach((mission) => {
        dispatch(
          openAchievementModal({
            kind: 'mission',
            title: '미션 달성!',
            desc: `이달의 미션 \n ${mission.title} 미션을 완료했어요!`,
            icon: missionIcon,
            missionId: mission.id,
            missionName: mission.title,
          })
        )
      })

      // 뱃지 획득 시 모달
      const prevBadge = qc.getQueryData<ResponseBadge[]>(['badge', 'acquired'])

      const nextBadge = await qc.fetchQuery<ResponseBadge[]>({
        queryKey: ['badge', 'acquired'],
        queryFn: getAcquiredBadges,
      })

      // 이전에는 없었는데 이번에 새로 획득한 뱃지 가져오기
      const newlyAcquired = getNewlyAcquiredBadgeByTime(prevBadge, nextBadge)

      // 새로 획득한 뱃지마다 모달 큐에 쌓기
      newlyAcquired?.forEach((badge) => {
        dispatch(
          openAchievementModal({
            kind: 'badge',
            title: `${badge.badgeTitle} 뱃지 획득`,
            desc: getBadgeDesc(badge, nextBadge),
            icon: badge.badgeImageUrl,
            badgeId: badge.badgeTitle,
            badgeName: badge.badgeTitle,
          })
        )
      })

      qc.invalidateQueries({ queryKey: ['mission', 'monthly'] })
    },

    // 3) 최종 동기화
    onSettled: () => {
      qc.invalidateQueries({ queryKey })
    },
  })
}
