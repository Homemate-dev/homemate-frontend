import { BlurView } from 'expo-blur'
import { Image, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native'

import GradientSurface from '../Badge/GradientSurface'

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
    <View style={[styles.relative, { width: size, height: size }]}>
      <GradientSurface size={size}>
        {/* 같은 컨테이너 안에서 겹치기 */}
        <View style={styles.inner}>
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
                style={styles.absoluteFillRounded}
              />

              <View
                pointerEvents="none"
                style={[
                  styles.absoluteFillRounded,
                  styles.blackBg,
                  { opacity: Platform.OS === 'ios' ? 0.7 : 0.45 },
                ]}
              />

              {/* 자물쇠 */}
              <View style={styles.absoluteCenter}>
                <Image source={require('@/assets/images/lock.png')} />
              </View>
            </>
          )}
        </View>
      </GradientSurface>
    </View>
  )
}

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  inner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteFillRounded: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 8,
  },
  blackBg: {
    backgroundColor: '#000000',
  },
  absoluteCenter: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
