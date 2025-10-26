import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분 동안 fresh 상태 유지
      retry: 1, // 실패 시 한 번만 재시도
      refetchOnWindowFocus: false, // 앱(또는 브라우저) 다시 포커스돼도 자동 refetch 안 함
    },
    mutations: {
      retry: 1, // mutation도 실패 시 한 번만 재시도
    },
  },
})
