import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
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
import { useDeleteChore } from '@/libs/hooks/chore/useDeleteChore'
import useUpdateChore from '@/libs/hooks/chore/useUpdateChore'
import useRandomChores from '@/libs/hooks/recommend/useRandomChores'
import { isDateCompare, toYMD2 } from '@/libs/utils/date'
import { toRepeatFields, toRepeatLabel } from '@/libs/utils/repeat'
import { toHHmm, toHHmmParts } from '@/libs/utils/time'

import DeleteModal from '../DeleteModal'

export default function AddChoreModal() {
  // ---------- URL params ----------
  const {
    mode: modeParam,
    instanceId: instanceIdParam,
    choreId: choreIdParam,
    selectedDate: selectedDateParam,
  } = useLocalSearchParams<{
    mode?: string
    instanceId?: string
    choreId?: string
    selectedDate?: string
  }>()

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
  const { mutate: deleteChore, isPending: deleting } = useDeleteChore()
  const { data: randomChores, isLoading } = useRandomChores()

  // add 모드면 0, edit 모드 + 값 있으면 해당 instanceId
  const instanceKey = isEdit && instanceId ? instanceId : 0
  const { data: detail, isLoading: loadingDetail } = useChoreDetail(instanceKey)

  // 날짜 검증
  const isDateRangeValid = isDateCompare(startDate, endDate)

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

  // 수정 모드 시, 초기 값 기억하기
  const initialValue = useMemo(() => {
    if (!isEdit || !detail) return

    return {
      title: (detail.title ?? '').trim(),
      notification_yn: !!detail.notification_yn,
      notification_time: detail.notification_time ?? '09:00',
      space: detail.space ?? null,
      repeat: toRepeatLabel(detail.repeatType, detail.repeatInterval),
      startDate: detail.startDate ?? null,
      endDate: detail.endDate ?? detail.startDate ?? null, // null 허용
    }
  }, [isEdit, detail])

  const currentValue = useMemo(() => {
    const hhmm = toHHmm(ampm, hour12, minute)
    return {
      title: inputValue.trim(),
      notification_yn: notifyOn,
      notification_time: hhmm,
      space,
      repeat,
      startDate,
      endDate: endDate ?? startDate,
    }
  }, [inputValue, notifyOn, ampm, hour12, minute, space, repeat, startDate, endDate])

  const isChanged = useMemo(() => {
    if (!isEdit) return true // 추가 모드는 항상 변경으로 간주(버튼 활성 조건에서 막지 않음)
    if (!initialValue) return false // detail 로딩 전엔 변경 아님(버튼 잠깐 비활성)
    return (
      initialValue.title !== currentValue.title ||
      initialValue.notification_yn !== currentValue.notification_yn ||
      initialValue.notification_time !== currentValue.notification_time ||
      initialValue.space !== currentValue.space ||
      initialValue.repeat !== currentValue.repeat ||
      initialValue.startDate !== currentValue.startDate ||
      initialValue.endDate !== currentValue.endDate
    )
  }, [isEdit, initialValue, currentValue])

  const baseValid =
    Boolean(inputValue.trim()) &&
    Boolean(space) &&
    Boolean(startDate) &&
    isDateRangeValid &&
    (!notifyOn || (ampm && hour12 && minute >= 0))

  const canSubmit = baseValid && (!isEdit || isChanged)

  const submitDisabled =
    creating || updating || (isEdit && (loadingDetail || !initialValue || !isChanged))

  // 등록 및 수정하기 핸들러
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

  // 삭제 핸들러
  const handleDelete = (applyToAll: boolean) => {
    if (!isEdit || !instanceId) return

    if (!selectedDateParam) {
      console.warn('선택된 날짜 누락-다시 시도해주세요')
      return
    }

    deleteChore(
      {
        choreInstanceId: instanceId,
        selectedDate: selectedDateParam,
        applyToAll,
      },

      {
        onSuccess: () => {
          setDeleteOpen(false)
          router.back()
        },

        onError: (error) => {
          const { code, message, details } = toApiError(error)
          const uiMsg = details?.[0]?.message ?? message

          // TODO: 프로젝트 토스트로 교체
          console.warn('[updateChore error]', code, uiMsg)
        },
      }
    )
  }

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
        style={styles.kbView}
      >
        <View className="flex-1 relative px-5" style={styles.wrapper}>
          <ScrollView className="flex-1 pt-6 bg-[#F8F8FA]" style={styles.scroll}>
            {/* 바깥 탭 닫기 오버레이 */}
            {(activeDropdown || openCalendar) && (
              <Pressable
                onPress={() => {
                  setActiveDropdown(null)
                  setOpenCalendar(null)
                }}
                className="absolute inset-0 z-40"
                style={styles.fullscreenOverlay}
              />
            )}
            <View className="flex-row items-center justify-center mb-6" style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-0"
                style={styles.headerBack}
              >
                <MaterialIcons name="chevron-left" size={24} color="#686F79" />
              </TouchableOpacity>
              <Text className="text-[22px] font-semibold" style={styles.headerTitle}>
                {headerTitle}
              </Text>

              {isEdit && (
                <>
                  <TouchableOpacity
                    onPress={() => setDeleteOpen(true)}
                    className="absolute right-0"
                    style={styles.headerRight}
                    disabled={deleting}
                  >
                    <Text
                      className="text-base text-[#57C9D0] font-semibold"
                      style={styles.deleteText}
                    >
                      삭제
                    </Text>
                  </TouchableOpacity>

                  <DeleteModal
                    visible={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onDeleteOnly={() => handleDelete(false)}
                    onDeleteAll={() => handleDelete(true)}
                    loading={deleting} // 삭제 중이면 버튼 로딩/비활성화
                    repeatType={detail?.repeatType}
                  />
                </>
              )}
            </View>

            <View className="flex-1 " style={styles.flex1}>
              {/* 입력창 */}
              <View
                className="flex-row items-center rounded-xl bg-white px-5 py-4 mb-4"
                style={styles.inputRow}
              >
                <TextInput
                  placeholder="집안일을 입력해주세요"
                  placeholderTextColor="#9B9FA6"
                  value={inputValue}
                  onChangeText={setInputValue}
                  maxLength={maxLength}
                  className="text-base flex-1 min-w-0 p-0 "
                  style={styles.textInput}
                />
                <Text className="text-sm text-[#B4B7BC]" style={styles.counterText}>
                  {inputValue.length}자/{maxLength}자
                </Text>
              </View>

              {/* 추천 집안일 */}
              {isLoading ? (
                <View className="py-3 items-center" style={styles.loadingRow}>
                  <ActivityIndicator />
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row flex-wrap gap-2"
                  contentContainerStyle={styles.chipsRow}
                >
                  {randomChores?.map((item) => (
                    <Pressable
                      key={item.id}
                      className="bg-[#DDF4F6] rounded-[6px] flex items-center justify-center px-3 py-[10px]"
                      style={styles.chip}
                      onPress={() => setInputValue(item.titleKo)}
                    >
                      <Text className="text-[#46A1A6] text-base" style={styles.chipText}>
                        {item.titleKo}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {/* 집안일 알림 설정 */}
              <View className="bg-white rounded-xl p-5 mb-4 relative" style={styles.card}>
                {/* 공간 */}
                <View className="flex-row items-center justify-between" style={styles.rowBetween}>
                  <Text className="text-lg font-[500]" style={styles.label}>
                    공간
                  </Text>
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

                <View className="h-[1px] bg-[#E6E7E9] my-3" style={styles.divider} />

                {/* 반복 주기 */}
                <View className="flex-row items-center justify-between" style={styles.rowBetween}>
                  <Text className="text-lg font-[500]" style={styles.label}>
                    반복주기
                  </Text>
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

                <View className="h-[1px] bg-[#E6E7E9] my-3" style={styles.divider} />

                {/* 시작 일자 */}
                <View
                  className={`relative flex-row items-center justify-between ${openCalendar === 'start' ? 'z-50' : 'z-10'}`}
                  style={[
                    styles.rowBetween,
                    openCalendar === 'start' ? styles.z50 : styles.z10,
                    styles.relative,
                  ]}
                >
                  <Text className="text-lg font-[500]" style={styles.label}>
                    시작일자
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setOpenCalendar(openCalendar === 'start' ? null : 'start')}
                    className="relative bg-[#EBF9F9] py-1 px-[10px] rounded-[6px]"
                    style={styles.dateBtn}
                  >
                    <Text className="text-base text-[#46A1A6]" style={styles.dateBtnText}>
                      {startDate ? ymdToYYMMDD(startDate) : todayStr}
                    </Text>
                  </TouchableOpacity>

                  {openCalendar === 'start' && (
                    <View
                      className="absolute left-0 right-0 w-full top-full mt-2 z-50 rounded-2xl bg-white"
                      style={styles.calendarPopover}
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

                <View className="h-[1px] bg-[#E6E7E9] my-3" style={styles.divider} />

                {/* 완료 일자 */}
                <View
                  className={`relative flex-row items-center justify-between ${openCalendar === 'end' ? 'z-50' : 'z-10'}`}
                  style={[
                    styles.rowBetween,
                    openCalendar === 'end' ? styles.z50 : styles.z10,
                    styles.relative,
                  ]}
                >
                  <Text className="text-lg font-[500]" style={styles.label}>
                    완료일자
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setOpenCalendar(openCalendar === 'end' ? null : 'end')}
                    className="relative bg-[#EBF9F9] py-1 px-[10px] rounded-[6px]"
                    style={styles.dateBtn}
                  >
                    <Text className="text-base text-[#46A1A6]" style={styles.dateBtnText}>
                      {endDate ? ymdToYYMMDD(endDate) : todayStr}
                    </Text>
                  </TouchableOpacity>

                  {openCalendar === 'end' && (
                    <View
                      className="absolute left-0 right-0 w-full top-full mt-2 z-50 rounded-2xl bg-white"
                      style={styles.calendarPopover}
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
                {!isDateRangeValid && (
                  <Text className="text-sm text-[#FF0707]" style={styles.errorMsg}>
                    완료일자는 시작일자보다 빠를 수 없습니다.
                  </Text>
                )}

                <View className="h-[1px] bg-[#E6E7E9] my-3" style={styles.divider} />

                {/* 알림 */}
                <View className="flex-row items-center justify-between " style={styles.rowBetween}>
                  <Text className="text-lg font-[500]" style={styles.label}>
                    알림
                  </Text>
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
            disabled={submitDisabled}
            className={`h-[52px] rounded-xl flex items-center justify-center mb-3 ${
              // 수정모드면서 변경없을 때만 회색으로
              isEdit && !isChanged ? 'bg-[#E6E7E9]' : 'bg-[#57C9D0]'
            }`}
            style={[
              styles.submitBtn,
              isEdit && !isChanged ? styles.submitBtnDisabled : styles.submitBtnActive,
            ]}
          >
            <Text
              className={`text-lg font-semibold ${
                isEdit && !isChanged ? 'text-[#B4B7BC]' : 'text-white'
              }`}
              style={[
                styles.submitText,
                isEdit && !isChanged ? styles.submitTextDisabled : styles.submitTextActive,
              ]}
            >
              {btnLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  kbView: { flex: 1, backgroundColor: '#F8F8FA' },
  wrapper: { flex: 1, position: 'relative', paddingHorizontal: 20 },
  scroll: { flex: 1, paddingTop: 24, backgroundColor: '#F8F8FA' },
  scrollContent: {},

  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 40,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerBack: { position: 'absolute', left: 0 },
  headerRight: { position: 'absolute', right: 0 },
  headerTitle: { fontSize: 22, fontWeight: '600' },
  deleteText: { fontSize: 16, color: '#57C9D0', fontWeight: '600' },

  flex1: { flex: 1 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    minWidth: 0,
    padding: 0,
  },
  counterText: { fontSize: 14, color: '#B4B7BC' },

  loadingRow: { paddingVertical: 12, alignItems: 'center' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#DDF4F6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipText: { color: '#46A1A6', fontSize: 16 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 18, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#E6E7E9', marginVertical: 12 },

  relative: { position: 'relative' },
  z10: { zIndex: 10 },
  z50: { zIndex: 50 },

  dateBtn: {
    backgroundColor: '#EBF9F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dateBtnText: { fontSize: 16, color: '#46A1A6' },
  calendarPopover: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    top: '100%',
    marginTop: 8,
    zIndex: 50,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  errorMsg: { fontSize: 12, color: '#FF0707' },

  submitBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitBtnActive: { backgroundColor: '#57C9D0' },
  submitBtnDisabled: { backgroundColor: '#E6E7E9' },
  submitText: { fontSize: 18, fontWeight: '600' },
  submitTextActive: { color: '#FFFFFF' },
  submitTextDisabled: { color: '#B4B7BC' },
})
