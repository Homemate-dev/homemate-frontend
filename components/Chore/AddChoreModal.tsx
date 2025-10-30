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
import { isDateCompare, toYMD } from '@/libs/utils/date'
import { toRepeatFields, toRepeatLabel } from '@/libs/utils/repeat'
import { SPACE_UI_OPTIONS, toSpaceApi, toSpaceUi } from '@/libs/utils/space'
import { toHHmm, toHHmmParts } from '@/libs/utils/time'

import DeleteModal from '../DeleteModal'
import UpdateModal from '../UpdateModal'

export default function AddChoreModal() {
  const {
    mode: modeParam,
    instanceId: instanceIdParam,
    selectedDate: selectedDateParam,
  } = useLocalSearchParams<{
    mode?: string
    instanceId?: string
    choreId?: string
    selectedDate?: string
  }>()

  const isEdit = (modeParam ?? 'add') === 'edit'
  const instanceId = instanceIdParam ? Number(instanceIdParam) : undefined

  const toYYMMDD = (s?: string | null) => {
    if (!s) return ''
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(s)) return s
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return `${s.slice(2, 4)}.${s.slice(5, 7)}.${s.slice(8, 10)}`
    }
    const d = new Date(s)
    if (!isNaN(d.getTime())) {
      const yy = String(d.getFullYear()).slice(2)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yy}.${mm}.${dd}`
    }
    return s
  }

  const isYMD = (s: string | null | undefined): boolean => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s)
  const safeYMD = (s: string | null | undefined, fallback: string): string =>
    isYMD(s) ? (s as string) : fallback

  const [inputValue, setInputValue] = useState('')
  const todayYMD = useMemo(() => toYMD(new Date()), [])

  const [space, setSpace] = useState<string | null>(null)
  const [repeat, setRepeat] = useState<string | null>(null)

  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const [openCalendar, setOpenCalendar] = useState<'start' | 'end' | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const [notifyOn, setNotifyOn] = useState(false)
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전')
  const [hour12, setHour12] = useState<number>(9)
  const [minute, setMinute] = useState<number>(0)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [applyToAfter, setApplyToAfter] = useState<boolean | null>(null)

  const maxLength = 20

  const { mutate: createChore, isPending: creating } = useCreateChore()
  const { mutate: updateChore, isPending: updating } = useUpdateChore()
  const { mutate: deleteChore, isPending: deleting } = useDeleteChore()
  const { data: randomChores, isLoading } = useRandomChores()

  const instanceKey = isEdit && instanceId ? instanceId : 0
  const { data: detail, isLoading: loadingDetail } = useChoreDetail(instanceKey)

  const isDateRangeValid = isDateCompare(startDate, endDate)

  // ADD 기본값
  useEffect(() => {
    if (isEdit) return
    const base = isYMD(selectedDateParam) ? (selectedDateParam as string) : todayYMD
    setStartDate(base)
    setEndDate(base)
  }, [isEdit, selectedDateParam, todayYMD])

  // EDIT 값 채우기
  useEffect(() => {
    if (!isEdit || !detail) return
    setInputValue(detail.title ?? '')
    setNotifyOn(!!detail.notificationYn)
    setRepeat(toRepeatLabel(detail.repeatType, detail.repeatInterval))
    setSpace(toSpaceUi(detail.space) ?? null)
    setStartDate(detail.startDate ?? null)
    setEndDate(detail.endDate ?? null)
    const parts = toHHmmParts(detail.notificationTime ?? '09:00')
    setAmpm(parts.ampm)
    setHour12(parts.hour12)
    setMinute(parts.minute)
  }, [isEdit, detail])

  const initialValue = useMemo(() => {
    if (!isEdit || !detail) return
    return {
      title: (detail.title ?? '').trim(),
      notificationYn: !!detail.notificationYn,
      notificationTime: detail.notificationTime ?? '09:00',
      space: toSpaceUi(detail.space) ?? null,
      repeat: toRepeatLabel(detail.repeatType, detail.repeatInterval),
      startDate: detail.startDate ?? null,
      endDate: detail.endDate ?? detail.startDate ?? null,
    }
  }, [isEdit, detail])

  const currentValue = useMemo(() => {
    const hhmm = toHHmm(ampm, hour12, minute)
    return {
      title: inputValue.trim(),
      notificationYn: notifyOn,
      notificationTime: hhmm,
      space,
      repeat,
      startDate,
      endDate: endDate ?? startDate,
    }
  }, [inputValue, notifyOn, ampm, hour12, minute, space, repeat, startDate, endDate])

  const isChanged = useMemo(() => {
    if (!isEdit) return true
    if (!initialValue) return false
    return (
      initialValue.title !== currentValue.title ||
      initialValue.notificationYn !== currentValue.notificationYn ||
      initialValue.notificationTime !== currentValue.notificationTime ||
      initialValue.space !== currentValue.space ||
      initialValue.repeat !== currentValue.repeat ||
      initialValue.startDate !== currentValue.startDate ||
      initialValue.endDate !== currentValue.endDate
    )
  }, [isEdit, initialValue, currentValue])

  const baseValid =
    Boolean(inputValue.trim()) &&
    Boolean(space) &&
    Boolean(repeat) &&
    Boolean(startDate) &&
    isDateRangeValid &&
    (!notifyOn || (ampm && hour12 && minute >= 0))

  const canSubmit = baseValid && (!isEdit || isChanged)
  const submitDisabled =
    !canSubmit || creating || updating || (isEdit && (loadingDetail || !initialValue || !isChanged))

  const isRepeating = (detail?.repeatType ?? 'NONE') !== 'NONE'

  const onSubmit = () => {
    if (!canSubmit) return
    const hhmm = toHHmm(ampm, hour12, minute)
    const baseDate = startDate ?? todayYMD
    if (!repeat) return
    const { repeatType, repeatInterval } = toRepeatFields(repeat)
    const spaceApi = toSpaceApi(space)
    if (!spaceApi) return

    if (!isEdit) {
      createChore(
        {
          title: inputValue.trim(),
          notificationYn: notifyOn,
          notificationTime: hhmm,
          space: spaceApi,
          repeatType,
          repeatInterval,
          startDate: baseDate,
          endDate: endDate ?? baseDate,
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => {
            const { code, message, details } = toApiError(error)
            console.warn('[createChore error]', code, details?.[0]?.message ?? message)
          },
        }
      )
    } else {
      if (!instanceId) {
        console.warn('[update] instanceId가 없습니다. 수정 화면 진입 경로를 확인해주세요.')
        return
      }
      const instanceIdForUpdate = instanceId
      if (!instanceIdForUpdate) return

      if (isRepeating && applyToAfter === null) {
        setUpdateOpen(true)
        return
      }

      updateChore(
        {
          choreInstanceId: instanceIdForUpdate,
          dto: {
            title: inputValue.trim(),
            notificationYn: notifyOn,
            notificationTime: hhmm,
            space: spaceApi,
            repeatType,
            repeatInterval,
            startDate: baseDate,
            endDate: endDate ?? baseDate,
            applyToAfter: Boolean(applyToAfter),
          },
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => {
            const { code, message, details } = toApiError(error)
            console.warn('[updateChore error]', code, details?.[0]?.message ?? message)
          },
        }
      )
    }
  }

  const handleDelete = (applyToAfter: boolean) => {
    if (!isEdit || !instanceId) return
    if (!selectedDateParam) return
    deleteChore(
      { choreInstanceId: instanceId, selectedDate: selectedDateParam, applyToAfter },
      {
        onSuccess: () => {
          setDeleteOpen(false)
          router.back()
        },
        onError: (error) => {
          const { code, message, details } = toApiError(error)
          console.warn('[deleteChore error]', code, details?.[0]?.message ?? message)
        },
      }
    )
  }

  const spaceOptions = SPACE_UI_OPTIONS
  const repeatOptions = ['안 함', '매일', '1주마다', '2주마다', '매달', '3개월마다', '6개월마다']

  const headerTitle = isEdit ? '집안일 수정' : '집안일 추가'
  const btnLabel = isEdit ? '수정하기' : '등록하기'

  // 전역 오버레이 없이도 스크롤 잠금은 유지
  const overlayOpen = Boolean(activeDropdown || openCalendar)

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbView}
      >
        <View style={styles.wrapper}>
          <ScrollView
            style={styles.scroll}
            scrollEnabled={!overlayOpen}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
                <MaterialIcons name="chevron-left" size={24} color="#686F79" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{headerTitle}</Text>

              {isEdit && (
                <>
                  <TouchableOpacity
                    onPress={() => setDeleteOpen(true)}
                    style={styles.headerRight}
                    disabled={deleting}
                  >
                    <Text style={styles.deleteText}>삭제</Text>
                  </TouchableOpacity>

                  <DeleteModal
                    visible={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onDeleteOnly={() => handleDelete(false)}
                    onDeleteAll={() => handleDelete(true)}
                    loading={deleting}
                    repeatType={detail?.repeatType}
                  />
                </>
              )}
            </View>

            <View style={styles.flex1}>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="집안일을 입력해주세요"
                  placeholderTextColor="#9B9FA6"
                  value={inputValue}
                  onChangeText={setInputValue}
                  maxLength={maxLength}
                  style={styles.textInput}
                />
                <Text style={styles.counterText}>
                  {inputValue.length}자/{maxLength}자
                </Text>
              </View>

              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator />
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsRow}
                >
                  {(Array.isArray(randomChores) ? randomChores : []).map((item: any) => (
                    <Pressable
                      key={item.id}
                      style={styles.chip}
                      onPress={() => setInputValue(item.titleKo)}
                    >
                      <Text style={styles.chipText}>{item.titleKo}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>공간</Text>
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

                <View style={styles.divider} />

                <View style={styles.rowBetween}>
                  <Text style={styles.label}>반복주기</Text>
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

                <View style={styles.divider} />

                {/* 시작일자 */}
                <View
                  style={[
                    styles.rowBetween,
                    styles.relative,
                    openCalendar === 'start' ? styles.z50 : styles.z10,
                  ]}
                >
                  <Text style={styles.label}>시작일자</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (!isYMD(startDate)) setStartDate(todayYMD)
                      setOpenCalendar(openCalendar === 'start' ? null : 'start')
                    }}
                    style={styles.dateBtn}
                  >
                    <Text style={styles.dateBtnText}>{toYYMMDD(startDate ?? todayYMD)}</Text>
                  </TouchableOpacity>

                  {openCalendar === 'start' && (
                    <>
                      <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={() => setOpenCalendar(null)}
                      />
                      <View style={styles.calendarPopover}>
                        <DatePickerCalendar
                          selectedDate={safeYMD(startDate, todayYMD)}
                          onSelect={(d) => {
                            setStartDate(d)
                            setOpenCalendar(null)
                          }}
                        />
                      </View>
                    </>
                  )}
                </View>

                <View style={styles.divider} />

                {/* 완료일자 */}
                <View
                  style={[
                    styles.rowBetween,
                    styles.relative,
                    openCalendar === 'end' ? styles.z50 : styles.z10,
                  ]}
                >
                  <Text style={styles.label}>완료일자</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (!isYMD(endDate)) setEndDate(safeYMD(startDate, todayYMD))
                      setOpenCalendar(openCalendar === 'end' ? null : 'end')
                    }}
                    style={styles.dateBtn}
                  >
                    <Text style={styles.dateBtnText}>{toYYMMDD(endDate ?? todayYMD)}</Text>
                  </TouchableOpacity>

                  {openCalendar === 'end' && (
                    <>
                      <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={() => setOpenCalendar(null)}
                      />
                      <View style={styles.calendarPopover}>
                        <DatePickerCalendar
                          selectedDate={safeYMD(endDate, safeYMD(startDate, todayYMD))}
                          onSelect={(d) => {
                            setEndDate(d)
                            setOpenCalendar(null)
                          }}
                        />
                      </View>
                    </>
                  )}
                </View>

                {!isDateRangeValid && (
                  <Text style={styles.errorMsg}>완료일자는 시작일자보다 빠를 수 없습니다.</Text>
                )}

                <View style={styles.divider} />

                <View style={styles.rowBetween}>
                  <Text style={styles.label}>알림</Text>
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

          <UpdateModal
            visible={updateOpen}
            onClose={() => {
              setUpdateOpen(false)
              setApplyToAfter(null)
            }}
            onUpdateOnly={() => {
              setApplyToAfter(false)
              setUpdateOpen(false)
              onSubmit()
            }}
            onUpdateAll={() => {
              setApplyToAfter(true)
              setUpdateOpen(false)
              onSubmit()
            }}
            loading={updating}
          />

          <Pressable
            onPress={onSubmit}
            disabled={submitDisabled}
            style={[
              styles.submitBtn,
              isEdit && !isChanged ? styles.submitBtnDisabled : styles.submitBtnActive,
            ]}
          >
            <Text
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  headerBack: { position: 'absolute', left: 0 },
  headerRight: { position: 'absolute', right: 0 },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#000' },
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
  textInput: { fontSize: 16, flex: 1, minWidth: 0, padding: 0, color: '#000' },
  counterText: { fontSize: 14, color: '#B4B7BC' },

  loadingRow: { paddingVertical: 12, alignItems: 'center' },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: '#DDF4F6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
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
  label: { fontSize: 18, fontWeight: '500', color: '#000' },
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
    zIndex: 2000,
    elevation: 1000,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
  },

  errorMsg: { fontSize: 12, color: '#FF0707', marginTop: 8 },

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
