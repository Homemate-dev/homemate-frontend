declare global {
  interface Window {
    dataLayer: any[]
  }
}

export type TaskSource = 'manual' | 'category' | 'space' | 'recommend'

/** 2task_type 매핑 함수 (문서 기준으로 GA4에 보낼 값 변환) */
export const mapTaskType = (source: TaskSource) => {
  switch (source) {
    case 'manual':
      return 'MANUAL'
    case 'category':
      return 'CATEGORY'
    case 'space':
      return 'SPACE'
    case 'recommend':
      return 'RECOMMEND'
    default:
      return 'MANUAL'
  }
}

/** 공통 이벤트 트래커 */
export const trackEvent = (eventName: string, params: Record<string, any>) => {
  if (typeof window === 'undefined') return

  // GA4에서 사용하는 dataLayer 보장
  window.dataLayer = window.dataLayer || []

  window.dataLayer.push({
    event: eventName,
    ...params,
    timestamp: Date.now(),
  })
}

export {}
