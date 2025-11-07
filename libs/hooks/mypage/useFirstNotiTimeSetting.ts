import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postFirstNotiSetting } from '@/libs/api/mypage/postFirstNotiSetting'
import { FirstAlertTimeResp } from '@/types/mypage'

export function useFirstNotiTimeSetting() {
  const qc = useQueryClient()

  return useMutation<FirstAlertTimeResp, unknown, { notificationTime: string }>({
    mutationFn: ({ notificationTime }) => postFirstNotiSetting(notificationTime),
    onSuccess: () => {
      // 최초 설정 상태 다시 가져오기 (모달 안 뜨게)
      qc.invalidateQueries({ queryKey: ['notifications', 'first-status'] })
      qc.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}
