declare global {
  interface Window {
    dataLayer: any[]
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
