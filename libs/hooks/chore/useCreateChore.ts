import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { postCreateChore } from '@/libs/api/chore/postCreateChore'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadge } from '@/libs/utils/getNewlyAcquiredBadges'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { CreateChoreDTO, ResponseChore } from '@/types/chore'

const missionIcon = require('../../../assets/images/icon/missionIcon.png')

export default function useCreateChore() {
  const qc = useQueryClient()
  const dispatch = useDispatch()

  return useMutation<ResponseChore, unknown, CreateChoreDTO>({
    mutationFn: (dto) => postCreateChore(dto),
    onSuccess: async (resp, dto) => {
      // 해당 날짜의 집안일 리스트 갱신
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', dto.startDate] })

      // 캘린더 갱신(화면에 보이는 달만)
      qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })

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
