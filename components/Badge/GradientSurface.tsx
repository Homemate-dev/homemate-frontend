import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

type Props = {
  children?: React.ReactNode
  size?: number
}

export default function GradientSurface({ children, size = 84 }: Props) {
  return (
    <View
      className="w-[84px] h-[84px] items-center overflow-hidden justify-center border border-[#79D4D9] rounded-lg"
      style={{ width: size, height: size }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#DDF4F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        {children}
      </LinearGradient>
    </View>
  )
}
