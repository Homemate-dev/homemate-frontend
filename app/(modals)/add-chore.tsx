import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import DatePickerCalendar from '@/components/Calendar/DatePickerCalendar'
import ChoreDropdown from '@/components/Dropdown/ChoreDropdown'
import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import Toggle from '@/components/Toggle'
import { toYMD2 } from '@/libs/utils/date'

export default function AddChoreModal() {
  const [inputValue, setInputValue] = useState('')

  const ymdToYYMMDD = (ymd: string) => `${ymd.slice(2, 4)}.${ymd.slice(5, 7)}.${ymd.slice(8, 10)}`

  const todayStr = useMemo(() => toYMD2(new Date()), [])

  const [space, setSpace] = useState<string | null>(null)
  const [repeat, setRepeat] = useState<string | null>(null)

  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const [openCalendar, setOpenCalendar] = useState<'start' | 'end' | null>(null)

  // 드롭다운 해당 영역 외 클릭 시 off
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const [notifyOn, setNotifyOn] = useState(false)

  const maxLength = 20

  const chores = [
    { id: 1, title: '이불 빨래하기' },
    { id: 2, title: '옷장 제습제 교체하기' },
    { id: 3, title: '배수구 트랩 청소' },
  ]

  const spaceOptions = ['주방', '욕실', '침실', '현관', '기타']
  const repeatOptions = ['안 함', '매일', '1주마다', '2주마다', '매달', '3개월마다', '6개월마다']

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-[#F8F8FA]"
      >
        <View className="flex-1 relative px-5">
          <ScrollView className="flex-1 pt-6 bg-[#F8F8FA]">
            {/* 바깥 탭 닫기 오버레이 */}
            {(activeDropdown || openCalendar) && (
              <Pressable
                onPress={() => {
                  setActiveDropdown(null)
                  setOpenCalendar(null)
                }}
                className="absolute inset-0 z-40"
              />
            )}
            <View className="flex-row items-center justify-center mb-6">
              <TouchableOpacity onPress={() => router.back()} className="absolute left-0">
                <MaterialIcons name="chevron-left" size={24} color="#686F79" />
              </TouchableOpacity>
              <Text className="text-[22px] font-semibold">집안일 추가</Text>
            </View>

            <View className="flex-1 ">
              {/* 입력창 */}
              <View className="flex-row items-center rounded-xl bg-white px-5 py-4 mb-4">
                <TextInput
                  placeholder="집안일을 입력해주세요"
                  placeholderTextColor="#9B9FA6"
                  value={inputValue}
                  onChangeText={setInputValue}
                  maxLength={maxLength}
                  className="text-base flex-1 min-w-0 p-0 "
                />
                <Text className="text-sm text-[#B4B7BC]">
                  {inputValue.length}자/{maxLength}자
                </Text>
              </View>

              {/* 추천 집안일 */}

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row flex-wrap gap-2 mb-4"
              >
                {chores.map((item) => (
                  <Pressable
                    key={item.id}
                    className="bg-[#DDF4F6] rounded-[6px] flex items-center justify-center px-3 py-[10px]"
                    onPress={() => setInputValue(item.title)}
                  >
                    <Text className="text-[#46A1A6] text-base">{item.title}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* 집안일 알림 설정 */}
              <View className="bg-white rounded-xl p-5 mb-4 relative">
                {/* 공간 */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-[500]">공간</Text>
                  <ChoreDropdown
                    id="space"
                    options={spaceOptions}
                    value={space}
                    onChange={setSpace}
                    placeholder="선택"
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                  />
                </View>

                <View className="h-[1px] bg-[#E6E7E9] my-3" />

                {/* 반복 주기 */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-[500]">반복주기</Text>
                  <ChoreDropdown
                    id="repeat"
                    options={repeatOptions}
                    value={repeat}
                    onChange={setRepeat}
                    placeholder="선택"
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                  />
                </View>

                <View className="h-[1px] bg-[#E6E7E9] my-3" />

                {/* 시작 일자 */}
                <View
                  className={`relative flex-row items-center justify-between ${openCalendar === 'start' ? 'z-50' : 'z-10'}`}
                >
                  <Text className="text-lg font-[500]">시작일자</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setOpenCalendar(openCalendar === 'start' ? null : 'start')}
                    className="relative bg-[#EBF9F9] py-1 px-[10px] rounded-[6px]"
                  >
                    <Text className="text-base text-[#46A1A6]">
                      {startDate ? ymdToYYMMDD(startDate) : todayStr}
                    </Text>
                  </TouchableOpacity>

                  {openCalendar === 'start' && (
                    <View
                      className="absolute left-0 right-0 w-full top-full mt-2 z-50 rounded-2xl bg-white"
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
                      <DatePickerCalendar
                        selectedDate={startDate ?? undefined}
                        onSelect={(d) => {
                          setStartDate(d)
                          setOpenCalendar(null)
                        }}
                      />
                    </View>
                  )}
                </View>

                <View className="h-[1px] bg-[#E6E7E9] my-3" />

                {/* 완료 일자 */}
                <View
                  className={`relative flex-row items-center justify-between ${openCalendar === 'end' ? 'z-50' : 'z-10'}`}
                >
                  <Text className="text-lg font-[500]">완료일자</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setOpenCalendar(openCalendar === 'end' ? null : 'end')}
                    className="relative bg-[#EBF9F9] py-1 px-[10px] rounded-[6px]"
                  >
                    <Text className="text-base text-[#46A1A6]">
                      {endDate ? ymdToYYMMDD(endDate) : todayStr}
                    </Text>
                  </TouchableOpacity>

                  {openCalendar === 'end' && (
                    <View
                      className="absolute left-0 right-0 w-full top-full mt-2 z-50 rounded-2xl bg-white"
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
                      <DatePickerCalendar
                        selectedDate={endDate ?? undefined}
                        onSelect={(d) => {
                          setEndDate(d)
                          setOpenCalendar(null)
                        }}
                      />
                    </View>
                  )}
                </View>

                <View className="h-[1px] bg-[#E6E7E9] my-3" />

                {/* 알림 */}
                <View className="flex-row items-center justify-between ">
                  <Text className="text-lg font-[500]">알림</Text>
                  <Toggle value={notifyOn} onChange={setNotifyOn} />
                </View>

                {notifyOn && (
                  <TimeDropdown
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                  />
                )}
              </View>
            </View>
          </ScrollView>
          {/* 등록 버튼 */}
          <Pressable className="h-[52px] bg-[#57C9D0] rounded-xl flex items-center justify-center mb-3">
            <Text className="text-lg font-semibold text-white">등록하기</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}
