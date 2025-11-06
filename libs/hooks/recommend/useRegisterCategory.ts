import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'

import { useToast } from '@/contexts/ToastContext'
import { postResisterCategoryChore } from '@/libs/api/recommend/postResisterCategoryChore'
import { RegisterChoreResponse } from '@/types/recommend'

export function useRegisterCategory() {
  const qc = useQueryClient()
  const toast = useToast()

  return useMutation<RegisterChoreResponse, unknown, { categoryChoreId: number; category: string }>(
    {
      mutationFn: ({ categoryChoreId, category }: { categoryChoreId: number; category: string }) =>
        postResisterCategoryChore(categoryChoreId, category),
      onSuccess: (res) => {
        qc.invalidateQueries({ queryKey: ['chore', 'calendar'], type: 'active' })
        qc.invalidateQueries({ queryKey: ['chore', 'byDate', res.data.startDate] })
        const title = res?.data?.title

        toast.show({
          message: title ?? '집안일이 추가됐어요',
          onPress: () => {
            router.push('/(tabs)/home')
          },
        })
      },
    }
  )
}
