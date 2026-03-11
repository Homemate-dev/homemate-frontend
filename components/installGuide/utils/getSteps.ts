import { Platform } from 'react-native'

import { GUIDE_STEPS, GuideStepData } from '../constants'
import { getBrowserType } from './getBrowserType'
import { getDeviceType } from './getDeviceType'

function getIsPwa(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return true
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

export function getSteps(): GuideStepData[] | null {
  if (getIsPwa()) return null
  const deviceType = getDeviceType()
  const browserType = getBrowserType()

  // console.log(deviceType, browserType)
  return GUIDE_STEPS[deviceType]?.[browserType] ?? null
}
