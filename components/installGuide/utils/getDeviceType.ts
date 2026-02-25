import { Platform } from 'react-native'

export type DeviceType = 'android' | 'ios' | 'other'

export function getDeviceType(): DeviceType {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return 'other'

  const ua = window.navigator.userAgent || ''

  console.log(ua)
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'

  return 'other'
}
