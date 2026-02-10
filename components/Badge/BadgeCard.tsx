import { BlurView } from 'expo-blur'
import { Image, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native'

import GradientSurface from '../Badge/GradientSurface'

type BadgeCardProps = {
  icon: ImageSourcePropType
  size?: number
  iconSize?: number
  acquired?: boolean
}

// BadgeCard.tsx (부모에서 크기만 한 번 지정)
export default function BadgeCard({
  icon,
  size = 96,
  iconSize = 56,
  acquired = false,
}: BadgeCardProps) {
  const locked = !acquired

  return (
    <View style={{ width: size, height: size }}>
      <GradientSurface
        style={{ width: size, height: size, borderRadius: 8, borderWidth: locked ? 0 : 1 }}
      >
        <View
          style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <Image source={icon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
          {locked && (
            <>
              <BlurView
                intensity={25}
                {...(Platform.OS === 'android'
                  ? { experimentalBlurMethod: 'dimezisBlurView' }
                  : {})}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 8 }]}
              />
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFillObject,
                  { borderRadius: 8, backgroundColor: '#000', opacity: 0.7 },
                ]}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <Image
                  source={require('@/assets/images/lock.svg')}
                  style={{ width: 45, height: 45 }}
                />
              </View>
            </>
          )}
        </View>
      </GradientSurface>
    </View>
  )
}
