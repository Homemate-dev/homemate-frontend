import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'

import { useToast } from '@/contexts/ToastContext'
import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { postResisterSpaceChore } from '@/libs/api/recommend/postResisterSpaceChore'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadgeByTime } from '@/libs/utils/getNewlyAcquiredBadgeByTime'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { RegisterChoreResponse } from '@/types/recommend'

const missionIcon = require('../../../assets/images/icon/missionIcon.png')

export function useRegisterSpace() {
  const qc = useQueryClient()
  const dispatch = useDispatch()

  const toast = useToast()

  return useMutation<RegisterChoreResponse, unknown, { spaceChoreId: number; space: string }>({
    mutationFn: ({ spaceChoreId, space }: { spaceChoreId: number; space: string }) =>
      postResisterSpaceChore(spaceChoreId, space),
    onSuccess: async (resp) => {
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
      qc.invalidateQueries({ queryKey: ['chore', 'byDate'] })
      qc.invalidateQueries({ queryKey: ['mission', 'monthly'] })
      qc.invalidateQueries({ queryKey: ['badge', 'acquired'] })
      qc.invalidateQueries({ queryKey: ['badge', 'top', 'three'] })
      qc.invalidateQueries({ queryKey: ['recommend', 'monthly-chores'] })
      qc.invalidateQueries({ queryKey: ['recommend', 'category-chores'] })
      qc.invalidateQueries({ queryKey: ['recommend', 'season-chores'] })
      const title = resp?.data?.title

      toast.show({
        message: title ?? '집안일이 ',
        onPress: () => {
          router.replace('/(tabs)/home')
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
            kind: 'mission',
            title: `${badge.badgeTitle} 뱃지 획득`,
            desc: getBadgeDesc(badge, nextBadge),
            icon: badge.badgeImageUrl,
            badgeId: badge.badgeTitle,
            badgeName: badge.badgeTitle,
          })
        )
      })
    },
  })
}
