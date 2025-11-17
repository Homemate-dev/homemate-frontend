// GradientSurface.tsx
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, type ViewStyle } from 'react-native'

type Props = {
  children?: React.ReactNode
  style?: ViewStyle // 외부에서 크기/모서리 등 지정
}

export default function GradientSurface({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* 그라디언트는 부모를 꽉 채우기 */}
      <LinearGradient
        colors={['#FFFFFF', '#DDF4F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* 콘텐츠는 그 위에 */}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#79D4D9',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
