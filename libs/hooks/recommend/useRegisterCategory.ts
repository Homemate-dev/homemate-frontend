import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'

import { useToast } from '@/contexts/ToastContext'
import { postResisterCategoryChore } from '@/libs/api/recommend/postResisterCategoryChore'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { RegisterChoreResponse } from '@/types/recommend'

const missionIcon = require('../../../assets/images/icon/missionIcon.png')

export function useRegisterCategory() {
  const qc = useQueryClient()
  const dispatch = useDispatch()
  const toast = useToast()

  return useMutation<RegisterChoreResponse, unknown, { categoryChoreId: number; category: string }>(
    {
      mutationFn: ({ categoryChoreId, category }: { categoryChoreId: number; category: string }) =>
        postResisterCategoryChore(categoryChoreId, category),
      onSuccess: (resp) => {
        qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
        qc.invalidateQueries({ queryKey: ['chore', 'byDate', resp.data.startDate] })
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
      },
    }
  )
}
