import { useCallback, useEffect, useRef } from 'react'
import { Platform } from 'react-native'

import { GuideStepData } from '../constants'

interface CachedStepsResult {
  getVideoSource: (step: GuideStepData) => number | string | null
  steps: GuideStepData[]
}

export function useCachedSteps(steps: GuideStepData[]): CachedStepsResult {
  const cacheRef = useRef<Map<string, string>>(new Map())
  // 생성된 모든 Blob URL을 어떤 상황에서도 추적할 수 있도록 ref 사용
  const allCreatedBlobsRef = useRef<string[]>([])

  useEffect(() => {
    if (Platform.OS !== 'web') return

    const controller = new AbortController()
    const { signal } = controller

    const prefetch = async () => {
      try {
        await Promise.all(
          steps.map(async (s) => {
            if (s.video == null) return
            const originalUrl = s.video as unknown as string

            try {
              const res = await fetch(originalUrl, { signal })
              const blob = await res.blob()

              // 생성 직전 최종 확인
              if (signal.aborted) return

              const blobUrl = URL.createObjectURL(blob)
              // 생성 즉시 Ref에 기록 (언마운트 시 즉각 해제 가능하게)
              allCreatedBlobsRef.current.push(blobUrl)
              // state 업데이트 없음 → 리렌더링 없음
              cacheRef.current.set(originalUrl, blobUrl)
            } catch {
              // fetch 실패 시 원본 URL 유지
            }
          })
        )
      } catch {
        // Promise.all 전체 에러 대응
      }
    }

    prefetch()

    const blobsRef = allCreatedBlobsRef
    const cache = cacheRef

    return () => {
      // 1. 진행 중인 모든 fetch 중단
      controller.abort()

      // 2. 지금까지 생성된 모든 Blob URL 해제
      blobsRef.current.forEach((url) => URL.revokeObjectURL(url))
      blobsRef.current = [] // 리스트 초기화
      cache.current.clear()
    }
  }, [steps])

  const getVideoSource = useCallback((step: GuideStepData): number | string | null => {
    if (step.video == null) return null
    const originalUrl = step.video as unknown as string
    return (cacheRef.current.get(originalUrl) ?? step.video) as number | string
  }, [])

  return { getVideoSource, steps }
}
