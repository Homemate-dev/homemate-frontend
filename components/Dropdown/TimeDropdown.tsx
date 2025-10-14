import { type Dispatch, type SetStateAction, useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

type DropdownId = 'ampm' | 'hour' | 'minute'

type Props = {
  ampm: '오전' | '오후'
  hour: number
  minute: number
  onChange: (v: { ampm: '오전' | '오후'; hour: number; minute: number }) => void
  activeDropdown: string | null
  setActiveDropdown: Dispatch<SetStateAction<string | null>>
}

export default function TimeDropdown({
  ampm,
  hour,
  minute,
  onChange,
  activeDropdown,
  setActiveDropdown,
}: Props) {
  const toggleDropdown = (id: DropdownId) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const ampmOptions: ('오전' | '오후')[] = ['오전', '오후']
  const hourOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1), // 1..12
    []
  )
  const minuteOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')), // 00..55
    []
  )

  return (
    <View className="flex-row items-center justify-center mt-4">
      {/* 오전/오후 */}
      <View className="relative bg-[#EBF9F9] px-[10px] py-1 w-[75px] h-[40px] rounded-[6px] items-center justify-center mr-[14px]">
        <Pressable onPress={() => toggleDropdown('ampm')}>
          <Text className="text-[#46A1A6] text-base">{ampm}</Text>
        </Pressable>
        {activeDropdown === 'ampm' && (
          <View className="absolute left-0 top-[45px] z-50  w-[75px] border border-[#57C9D0] px-[10px] py-1 bg-white rounded-md">
            {ampmOptions.map((opt) => {
              const selected = opt === ampm
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange({ ampm: opt, hour, minute })
                    setActiveDropdown(null)
                  }}
                  className={`items-center justify-center px-1 py-1 rounded ${selected ? 'bg-[#EBF9F9]' : ''}`}
                >
                  <Text className="text-[#46A1A6] text-base" numberOfLines={1}>
                    {opt}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      {/* 시 선택 */}
      <View className="flex-row items-center mr-[5px]">
        <View className="bg-[#EBF9F9] px-[10px] py-1 w-[75px] h-[40px] rounded-[6px] items-center justify-center">
          <Pressable onPress={() => toggleDropdown('hour')}>
            <Text className="text-[#46A1A6] text-base">{hour}</Text>
          </Pressable>

          {activeDropdown === 'hour' && (
            <ScrollView className="absolute left-0 top-[45px] z-50  w-[75px] h-[152px] border border-[#57C9D0] px-[10px] py-1 bg-white rounded-md">
              {hourOptions.map((opt) => {
                const selected = opt === hour
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      onChange({ ampm, hour: opt, minute })
                      setActiveDropdown(null)
                    }}
                    className={`items-center justify-center px-1 py-1 rounded ${selected ? 'bg-[#EBF9F9]' : ''}`}
                  >
                    <Text className="text-[#46A1A6] text-base" numberOfLines={1}>
                      {opt}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          )}
        </View>
        <Text className="text-base ml-[5px]">시</Text>
      </View>

      {/* 분 선택 */}
      <View className="flex-row items-center">
        <View className="bg-[#EBF9F9] px-[10px] py-1 w-[75px] h-[40px] rounded-[6px] items-center justify-center">
          <Pressable onPress={() => toggleDropdown('minute')}>
            <Text className="text-[#46A1A6] text-base">{String(minute).padStart(2, '0')}</Text>
          </Pressable>
          {activeDropdown === 'minute' && (
            <ScrollView className="absolute left-0 top-[45px] z-50  w-[75px] h-[152px] border border-[#57C9D0] px-[10px] py-1 bg-white rounded-md">
              {minuteOptions.map((opt) => {
                const selected = opt === String(minute)
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      onChange({ ampm, hour, minute: Number(opt) })
                      setActiveDropdown(null)
                    }}
                    className={`items-center justify-center px-1 py-1 rounded ${selected ? 'bg-[#EBF9F9]' : ''}`}
                  >
                    <Text className="text-[#46A1A6] text-base" numberOfLines={1}>
                      {opt}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          )}
        </View>
        <Text className="text-base ml-[5px]">분</Text>
      </View>
    </View>
  )
}
