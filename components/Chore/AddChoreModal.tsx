import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
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
import { toApiError } from '@/libs/api/error'
import { useChoreDetail } from '@/libs/hooks/chore/useChoreDetail'
import useCreateChore from '@/libs/hooks/chore/useCreateChore'
import useUpdateChore from '@/libs/hooks/chore/useUpdateChore'
import { toYMD2 } from '@/libs/utils/date'
import { toRepeatFields, toRepeatLabel } from '@/libs/utils/repeat'
import { toHHmm, toHHmmParts } from '@/libs/utils/time'

import DeleteModal from '../DeleteModal'

export default function AddChoreModal() {
  // ---------- URL params ----------
  const {
    mode: modeParam,
    instanceId: instanceIdParam,
    choreId: choreIdParam,
  } = useLocalSearchParams<{ mode?: string; instanceId?: string; choreId?: string }>()

  const isEdit = (modeParam ?? 'add') === 'edit'
  const instanceId = instanceIdParam ? Number(instanceIdParam) : undefined
  const choreId = choreIdParam ? Number(choreIdParam) : undefined

  // ---------- local states ----------
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
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전')
  const [hour12, setHour12] = useState<number>(9)
  const [minute, setMinute] = useState<number>(0)

  // 삭제 버튼 클릭
  const [deleteOpen, setDeleteOpen] = useState(false)

  const maxLength = 20

  // ---------- API 훅 ----------
  const { mutate: createChore, isPending: creating } = useCreateChore()
  const { mutate: updateChore, isPending: updating } = useUpdateChore()

  // add 모드면 0, edit 모드 + 값 있으면 해당 instanceId
  const instanceKey = isEdit && instanceId ? instanceId : 0
  const { data: detail, isLoading: loadingDetail } = useChoreDetail(instanceKey)

  // 수정 모드 시, 데이터 채워주기
  useEffect(() => {
    if (!isEdit || !detail) return

    setInputValue(detail.title ?? '')
    setNotifyOn(!!detail.notification_yn)
    setRepeat(toRepeatLabel(detail.repeatType, detail.repeatInterval))
    setSpace(detail.space ?? null)
    setStartDate(detail.startDate ?? null)
    setEndDate(detail.endDate ?? null)

    const { ampm, hour12, minute } = toHHmmParts(detail.notification_time ?? '09:00')
    setAmpm(ampm)
    setHour12(hour12)
    setMinute(minute)
  }, [isEdit, detail])

  const canSubmit =
    Boolean(inputValue.trim()) &&
    Boolean(space) &&
    Boolean(startDate) &&
    (!notifyOn || (ampm && hour12 && minute >= 0))

  const onSubmit = () => {
    if (!canSubmit) return

    const hhmm = toHHmm(ampm, hour12, minute)
    const { repeatType, repeatInterval } = toRepeatFields(repeat)

    if (!isEdit) {
      createChore(
        {
          title: inputValue.trim(),
          notification_yn: notifyOn,
          notification_time: hhmm,
          space: space!,
          repeatType: repeatType,
          repeatInterval: repeatInterval,
          startDate: startDate!,
          endDate: endDate ?? startDate!,
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => {
            const { code, message, details } = toApiError(error)
            const uiMsg = details?.[0]?.message ?? message

            // TODO: 프로젝트 토스트로 교체
            console.warn('[createChore error]', code, uiMsg)
          },
        }
      )
    } else {
      const choreIdForUpdate = choreId ?? detail?.choreId
      if (!choreIdForUpdate) return

      updateChore(
        {
          choreId: choreIdForUpdate,
          dto: {
            title: inputValue.trim(),
            notification_yn: notifyOn,
            notification_time: hhmm,
            space: space!,
            repeatType,
            repeatInterval,
            startDate: startDate!,
            endDate: endDate ?? startDate!,
            isUpdateAll: false,
          },
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => {
            const { code, message, details } = toApiError(error)
            const uiMsg = details?.[0]?.message ?? message

            // TODO: 프로젝트 토스트로 교체
            console.warn('[updateChore error]', code, uiMsg)
          },
        }
      )
    }
  }

  const chores = [
    { id: 1, title: '이불 빨래하기' },
    { id: 2, title: '옷장 제습제 교체하기' },
    { id: 3, title: '배수구 트랩 청소' },
  ]

  const spaceOptions = ['주방', '욕실', '침실', '현관', '기타']
  const repeatOptions = ['안 함', '매일', '1주마다', '2주마다', '매달', '3개월마다', '6개월마다']

  const headerTitle = isEdit ? '집안일 수정' : '집안일 추가'
  const btnLabel = isEdit ? '수정하기' : '등록하기'

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
              <Text className="text-[22px] font-semibold">{headerTitle}</Text>

              {isEdit && (
                <>
                  <TouchableOpacity
                    onPress={() => setDeleteOpen(true)}
                    className="absolute right-0"
                  >
                    <Text className="text-base text-[#57C9D0] font-semibold">삭제</Text>
                  </TouchableOpacity>

                  <DeleteModal visible={deleteOpen} onClose={() => setDeleteOpen(false)} />
                </>
              )}
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
                    ampm={ampm}
                    hour={hour12}
                    minute={minute}
                    onChange={({ ampm, hour, minute }) => {
                      setAmpm(ampm)
                      setHour12(hour)
                      setMinute(minute)
                    }}
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                  />
                )}
              </View>
            </View>
          </ScrollView>
          {/* 등록 버튼 */}
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || creating || updating || (isEdit && loadingDetail)}
            className="h-[52px] bg-[#57C9D0] rounded-xl flex items-center justify-center mb-3"
          >
            <Text className="text-lg font-semibold text-white">{btnLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}
