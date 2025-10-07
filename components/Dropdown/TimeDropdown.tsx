import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

type DropdownId = 'ampm' | 'hour' | 'minute'

type Props = {
  activeDropdown: string | null
  setActiveDropdown: Dispatch<SetStateAction<string | null>>
}

export default function TimeDropdown({ activeDropdown, setActiveDropdown }: Props) {
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전')
  const [hour, setHour] = useState('9')
  const [minute, setMinute] = useState('10')

  const toggleDropdown = (id: DropdownId) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const ampmOptions: ('오전' | '오후')[] = ['오전', '오후']
  const hourOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i + 1)), // 1..12
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
            {ampmOptions.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  setAmpm(opt)
                  setActiveDropdown(null)
                }}
                className="items-center justify-center px-1 py-1"
              >
                <Text className="text-[#46A1A6] text-base" numberOfLines={1}>
                  {opt}
                </Text>
              </Pressable>
            ))}
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
              {hourOptions.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    setHour(opt)
                    setActiveDropdown(null)
                  }}
                  className="items-center justify-center px-1 py-1"
                >
                  <Text className="text-[#46A1A6] text-base" numberOfLines={1}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
        <Text className="text-base ml-[5px]">시</Text>
      </View>

      {/* 분 선택 */}
      <View className="flex-row items-center">
        <View className="bg-[#EBF9F9] px-[10px] py-1 w-[75px] h-[40px] rounded-[6px] items-center justify-center">
          <Pressable onPress={() => toggleDropdown('minute')}>
            <Text className="text-[#46A1A6] text-base">{minute}</Text>
          </Pressable>
          {activeDropdown === 'minute' && (
            <ScrollView className="absolute left-0 top-[45px] z-50  w-[75px] h-[152px] border border-[#57C9D0] px-[10px] py-1 bg-white rounded-md">
              {minuteOptions.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    setMinute(opt)
                    setActiveDropdown(null)
                  }}
                  className="items-center justify-center px-1 py-1"
                >
                  <Text className="text-[#46A1A6] text-base" numberOfLines={1}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
        <Text className="text-base ml-[5px]">분</Text>
      </View>
    </View>
  )
}
