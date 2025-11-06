import { useMutation, useQueryClient } from '@tanstack/react-query'

import { patchNotiTimeSetting } from '@/libs/api/mypage/patchNotiTimeSetting'
import { ResponseNotificationTime } from '@/types/mypage'

export function useNotiTimeSetting() {
  const qc = useQueryClient()

  return useMutation<ResponseNotificationTime, unknown, { notificationTime: string }>({
    // 서버 요청
    mutationFn: ({ notificationTime }) => patchNotiTimeSetting(notificationTime),

    // 유저 정보 무효화
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}
