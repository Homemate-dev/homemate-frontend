import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AlertType, UpdateAlertResp } from '@/types/mypage'

import { patchNotiSetting } from '../../api/mypage/patchNotiSetting'

export function useNotiSetting() {
  const qc = useQueryClient()

  return useMutation<UpdateAlertResp, unknown, { type: AlertType; enabled: boolean }>({
    // 서버 요청
    mutationFn: ({ type, enabled }) => patchNotiSetting(type, enabled),

    // 유저 정보 무효화
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}
