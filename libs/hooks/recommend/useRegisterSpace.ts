import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'

import { useToast } from '@/contexts/ToastContext'
import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { postResisterSpaceChore } from '@/libs/api/recommend/postResisterSpaceChore'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadge } from '@/libs/utils/getNewlyAcquiredBadges'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { RegisterChoreResponse, Space } from '@/types/recommend'

const missionIcon = require('../../../assets/images/icon/missionIcon.png')

export function useRegisterSpace() {
  const qc = useQueryClient()
  const dispatch = useDispatch()

  const toast = useToast()

  return useMutation<RegisterChoreResponse, unknown, { spaceChoreId: number; space: Space }>({
    mutationFn: ({ spaceChoreId, space }: { spaceChoreId: number; space: Space }) =>
      postResisterSpaceChore(spaceChoreId, space),
    onSuccess: async (resp) => {
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', resp.data.startDate] })
      qc.invalidateQueries({ queryKey: ['mission', 'monthly'] })
      const title = resp?.data?.title

      toast.show({
        message: title ?? '집안일이 추가됐어요',
        onPress: () => {
          router.push('/(tabs)/home')
        },
      })

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
  })
}
