import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { postResisterCategoryChore } from '@/libs/api/recommend/postResisterCategoryChore'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadge } from '@/libs/utils/getNewlyAcquiredBadges'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { RegisterChoreResponse } from '@/types/recommend'

const missionIcon = require('../../../assets/images/icon/missionIcon.png')

export function useRegisterCategory() {
  const qc = useQueryClient()
  const dispatch = useDispatch()

  return useMutation<RegisterChoreResponse, unknown, { categoryChoreId: number; category: string }>(
    {
      mutationFn: ({ categoryChoreId, category }: { categoryChoreId: number; category: string }) =>
        postResisterCategoryChore(categoryChoreId, category),
      onSuccess: async (resp) => {
        qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
        qc.invalidateQueries({ queryKey: ['chore', 'byDate', resp.data.startDate] })
        qc.invalidateQueries({ queryKey: ['mission', 'monthly'] })

        const completedMissions = resp.missionResults?.filter((m) => m.completed) ?? []

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
        // 뱃지 데이터 최신화
        const prevBadge = qc.getQueryData<ResponseBadge[]>(['badge', 'acquired']) ?? []

        const nextBadge = await qc.fetchQuery<ResponseBadge[]>({
          queryKey: ['badge', 'acquired'],
          queryFn: getAcquiredBadges,
        })

        const newlyAcquired = getNewlyAcquiredBadge(prevBadge, nextBadge)

        newlyAcquired.forEach((badge) => {
          dispatch(
            openAchievementModal({
              kind: 'badge',
              title: `${badge.badgeTitle} 뱃지 획득`,
              desc: getBadgeDesc(badge, nextBadge),
              icon: badge.badgeImageUrl,
            })
          )
        })
      },
    }
  )
}
