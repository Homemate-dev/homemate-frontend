import { Image, Pressable, ScrollView, Text, View } from 'react-native'

type DropdownProps = {
  id: string
  options: string[]
  value: string | null
  onChange: (v: string) => void
  placeholder?: string
  activeDropdown: string | null
  setActiveDropdown: (v: string | null) => void
}

export default function ChoreDropdown({
  id,
  options,
  value,
  onChange,
  placeholder,
  activeDropdown,
  setActiveDropdown,
}: DropdownProps) {
  const isOpen = activeDropdown === id

  const toggle = () => setActiveDropdown(isOpen ? null : id)
  const close = () => setActiveDropdown(null)

  return (
    <View className={`relative ${isOpen ? 'z-50' : ''}`}>
      <Pressable onPress={toggle} className="flex-row items-center gap-2">
        <Text className="text-[#686F79] text-base">
          {value != null && value !== '' ? value : (placeholder ?? '선택')}
        </Text>
        <Image
          source={require('../../assets/images/arrow/dropdown.png')}
          className="w-3 h-[22px]"
          resizeMode="contain"
        />
      </Pressable>

      {isOpen && (
        <View
          className="absolute right-0 top-6 z-50 w-[160px] rounded-xl bg-white px-4 py-4"
          style={{
            // iOS 그림자
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            // Android 그림자
            elevation: 6,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt, i) => (
              <Pressable
                key={opt}
                onPress={() => {
                  onChange(opt)
                  close()
                }}
              >
                <Text className="text-base">{opt}</Text>
                {i < options.length - 1 && <View className="h-[1px] bg-[#E6E7E9] mt-2 mb-2" />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
