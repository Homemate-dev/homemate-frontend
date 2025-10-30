import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'

type Props = {
  children?: React.ReactNode
  size?: number
}

export default function GradientSurface({ children, size = 84 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={['#FFFFFF', '#DDF4F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#79D4D9',
    borderRadius: 8,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
