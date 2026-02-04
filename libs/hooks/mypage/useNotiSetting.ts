import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { AlertType, UpdateAlertResp } from '@/types/mypage'

import { patchNotiSetting } from '../../api/mypage/patchNotiSetting'

export function useNotiSetting() {
  const qc = useQueryClient()
  const dispatch = useDispatch()

  return useMutation<UpdateAlertResp, unknown, { type: AlertType; enabled: boolean }>({
    // 서버 요청
    mutationFn: ({ type, enabled }) => patchNotiSetting(type, enabled),

    onSuccess: async (resp) => {
      // 1) 유저 정보 무요화
      qc.invalidateQueries({ queryKey: ['user', 'me'] })

      // 2) 알림 뱃지 획득 처리
      if (!resp.newBadge) return

      // 배지 목록 확보
      const nextBadge = await qc.fetchQuery<ResponseBadge[]>({
        queryKey: ['badge', 'acquired'],
        queryFn: getAcquiredBadges,
      })

      // newBadge code로 매칭
      const badge = nextBadge.find((b) => b.badgeType === resp.newBadge)
      if (!badge) return

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

      qc.invalidateQueries({ queryKey: ['badge', 'top', 'three'] })
    },
  })
}
