import { ImageSourcePropType } from 'react-native'

export type ResponseBadge = {
  badgeType: string
  badgeTitle: string
  description: string
  acquired: boolean
  acquiredAt: string
  currentCount: number
  requiredCount: number
  remainingCount: number
  badgeImageUrl: ImageSourcePropType
}
