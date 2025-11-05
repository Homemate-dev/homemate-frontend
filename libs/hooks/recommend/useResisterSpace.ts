import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'

import { useToast } from '@/contexts/ToastContext'
import { postResisterSpaceChore } from '@/libs/api/recommend/postResisterSpaceChore'
import { RegisterChoreResponse, Space } from '@/types/recommend'

export function useResisterSpace() {
  const qc = useQueryClient()
  const toast = useToast()

  return useMutation<RegisterChoreResponse, unknown, { spaceChoreId: number; space: Space }>({
    mutationFn: ({ spaceChoreId, space }: { spaceChoreId: number; space: Space }) =>
      postResisterSpaceChore(spaceChoreId, space),
    onSuccess: (res) => {
      qc.invalidateQueries({
        queryKey: ['chore', 'calendar', res.data.startDate, res.data.endDate],
      })
      qc.invalidateQueries({ queryKey: ['chore', 'byDate', res.data.startDate] })
      const title = res?.data?.title

      toast.show({
        message: title,
        onPress: () => {
          router.push('/(tabs)/home')
        },
      })
    },
  })
}
