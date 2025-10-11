import { BlurView } from 'expo-blur'
import { Image, ImageSourcePropType, Platform, View } from 'react-native'

import GradientSurface from './GradientSurface'

type BadgeCardProps = {
  icon: ImageSourcePropType
  size?: number
  iconSize?: number
  earned?: boolean
}

export default function BadgeCard({
  icon,
  size = 84,
  iconSize = 82,
  earned = true,
}: BadgeCardProps) {
  const locked = !earned

  return (
    <View className="relative" style={{ width: size, height: size }}>
      <GradientSurface size={size}>
        {/* 같은 컨테이너 안에서 겹치기 */}
        <View className="relative w-full h-full items-center justify-center">
          {/* 아이콘 */}
          <Image source={icon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />

          {/* 잠금일 때만 오버레이들 */}
          {locked && (
            <>
              {/* Blur는 같은 컨테이너 안에서 절대 채움 */}
              <BlurView
                intensity={25}
                {...(Platform.OS === 'android'
                  ? { experimentalBlurMethod: 'dimezisBlurView' }
                  : {})}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  borderRadius: 8,
                }}
              />

              <View
                pointerEvents="none"
                className={`absolute inset-0 rounded-lg bg-black`}
                style={{
                  opacity: Platform.OS === 'ios' ? 0.7 : 0.45,
                }}
              />

              {/* 자물쇠 */}
              <View className="absolute inset-0 items-center justify-center">
                <Image source={require('@/assets/images/lock.png')} />
              </View>
            </>
          )}
        </View>
      </GradientSurface>
    </View>
  )
}
