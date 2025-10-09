import { Image, ImageSourcePropType } from 'react-native'

import GradientSurface from './GradientSurface'

type BadgeCardProps = {
  icon: ImageSourcePropType
  size?: number
  iconSize?: number
}

export default function BadgeCard({ icon, size = 84, iconSize = 82 }: BadgeCardProps) {
  return (
    <GradientSurface size={size}>
      <Image source={icon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
    </GradientSurface>
  )
}
