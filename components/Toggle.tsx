import { Pressable, View } from 'react-native'

type toggleProps = {
  value: boolean
  onChange: (next: boolean) => void
}

export default function Toggle({ value, onChange }: toggleProps) {
  return (
    <Pressable onPress={() => onChange(!value)}>
      <View
        className={`w-[42px] h-6 rounded-full flex items-start justify-center p-[2px] ${value ? 'bg-[#57C9D0]' : 'bg-[#E6E7E9]'}`}
      >
        <View
          className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${value ? 'translate-x-[18px]' : ''} `}
        />
      </View>
    </Pressable>
  )
}
