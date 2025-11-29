import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { postCreateChore } from '@/libs/api/chore/postCreateChore'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadge } from '@/libs/utils/getNewlyAcquiredBadges'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { CreateChoreDTO, ResponseChore } from '@/types/chore'

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

      // 뱃지 획득 로직
      // - 이전에 가지고 있던 뱃지들
      const prevBadge = qc.getQueryData<ResponseBadge[]>(['badge', 'acquired']) ?? []

      // - 최신 뱃지 목록 서버에서 가져오기
      const nextBadge = await qc.fetchQuery<ResponseBadge[]>({
        queryKey: ['badge', 'acquired'],
        queryFn: getAcquiredBadges,
      })

      // 이전에는 없었는데 이번에 새로 획득한 뱃지 가져오기
      const newlyAcquired = getNewlyAcquiredBadge(prevBadge, nextBadge)

      // 새로 획득한 뱃지마다 모달 큐에 쌓기
      newlyAcquired.forEach((badge) => {
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
      qc.invalidateQueries({ queryKey: ['badge', 'acquired'] })
    },
  })
}
