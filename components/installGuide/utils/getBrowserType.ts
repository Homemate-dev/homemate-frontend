import { Platform } from 'react-native'

export type BrowserType = 'safari' | 'chrome' | 'whale' | 'samsung' | 'edge' | 'firefox' | 'other'

export function getBrowserType(): BrowserType {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return 'other'

  const ua = window.navigator.userAgent || ''

  // 특정 브라우저를 먼저 체크 (Chrome 계열보다 앞에)
  if (/Whale/i.test(ua)) return 'whale'
  if (/SamsungBrowser/i.test(ua)) return 'samsung'
  if (/Edg/i.test(ua)) return 'edge'
  if (/CriOS|Chrome|Chromium/i.test(ua)) return 'chrome'
  if (/Firefox|FxiOS/i.test(ua)) return 'firefox'
  if (/Safari/i.test(ua)) return 'safari'

  return 'other'
}
