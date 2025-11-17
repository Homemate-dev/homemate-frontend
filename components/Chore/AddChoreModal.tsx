// AddChoreModal.tsx
import { MaterialIcons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'

import DatePickerCalendar from '@/components/Calendar/DatePickerCalendar'
import ChoreDropdown from '@/components/Dropdown/ChoreDropdown'
import TimeDropdown from '@/components/Dropdown/TimeDropdown'
import Toggle from '@/components/Toggle'
import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { toApiError } from '@/libs/api/error'
import { useChoreDetail } from '@/libs/hooks/chore/useChoreDetail'
import useCreateChore from '@/libs/hooks/chore/useCreateChore'
import { useDeleteChore } from '@/libs/hooks/chore/useDeleteChore'
import useUpdateChore from '@/libs/hooks/chore/useUpdateChore'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import useRandomChoreInfo from '@/libs/hooks/recommend/useRandomChoreInfo'
import useRandomChores from '@/libs/hooks/recommend/useRandomChores'
import { isDateCompare, toYMD } from '@/libs/utils/date'
import { getBadgeDesc } from '@/libs/utils/getBadgeDesc'
import { getNewlyAcquiredBadge } from '@/libs/utils/getNewlyAcquiredBadges'
import { toRepeatFields, toRepeatLabel } from '@/libs/utils/repeat'
import { SPACE_UI_OPTIONS, toSpaceApi, toSpaceUi } from '@/libs/utils/space'
import { toHHmm, toHHmmParts } from '@/libs/utils/time'
import { openAchievementModal } from '@/store/slices/achievementModalSlice'
import { ResponseBadge } from '@/types/badge'
import { RandomChoreList } from '@/types/recommend'

import DeleteModal from '../DeleteModal'
import UpdateModal from '../UpdateModal'

// 이모지(특수문자) 불가
const EMOJI_RE = /[\p{Extended_Pictographic}]/u

const missionIcon = require('../../assets/images/icon/missionIcon.png')

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

  // ----- 유틸 -----
  const toBool = (v: unknown) => v === true || v === 'Y' || v === 'y' || v === 1 || v === '1'

  const toYYMMDD = (s?: string | null) => {
    if (!s) return ''
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(s)) return s
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return `${s.slice(2, 4)}.${s.slice(5, 7)}.${s.slice(8, 10)}`
    }
    const d = new Date(s as string)
    if (!isNaN(d.getTime())) {
      const yy = String(d.getFullYear()).slice(2)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yy}.${mm}.${dd}`
    }
    return s || ''
  }

  const isYMD = (s: string | null | undefined): boolean => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s)
  const safeYMD = (s: string | null | undefined, fallback: string): string =>
    isYMD(s) ? (s as string) : fallback

  // ----- api 훅 -----
  const { mutate: createChore, isPending: creating } = useCreateChore()
  const { mutate: updateChore, isPending: updating } = useUpdateChore()
  const { mutate: deleteChore, isPending: deleting } = useDeleteChore()
  const { data: randomChores = [], isLoading, isRefetching, refetch } = useRandomChores()

  const [spaceChoreId, setSpaceChoreId] = useState<number | null>(null)
  const { data: randomChoreInfo } = useRandomChoreInfo(spaceChoreId as number)

  const instanceKey = isEdit && instanceId ? instanceId : 0
  const { data: detail, isLoading: loadingDetail } = useChoreDetail(instanceKey)
  const { data: user } = useMyPage()

  // ----- 상태관리 -----
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
  const [hour12, setHour12] = useState<number>(toHHmmParts(user?.notificationTime).hour12)
  const [minute, setMinute] = useState<number>(toHHmmParts(user?.notificationTime).minute)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [applyToAfter, setApplyToAfter] = useState<boolean | null>(null)

  const isDateRangeValid = isDateCompare(startDate, endDate)

  const dispatch = useDispatch()
  const qc = useQueryClient()

  // ----- 추천 집안일 자동 채우기 -----
  const applyRandomChore = (c: RandomChoreList) => {
    setInputValue(c.titleKo)
    setSpace(toSpaceUi(c.space))
    setRepeat(toRepeatLabel(c.repeatType, c.repeatInterval))
    setStartDate(c.startDate)
    setEndDate(c.endDate)
    if (c.choreEnabled) {
      setNotifyOn(true)
      setAmpm('오전')
      setHour12(9)
      setMinute(0)
    } else {
      setNotifyOn(false)
    }
  }

  useEffect(() => {
    if (randomChoreInfo) applyRandomChore(randomChoreInfo)
  }, [randomChoreInfo])

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
    setNotifyOn(toBool(detail.notificationYn))
    setRepeat(toRepeatLabel(detail.repeatType, detail.repeatInterval))
    setSpace(toSpaceUi(detail.space) ?? null)
    setStartDate(detail.startDate ?? null)
    setEndDate(detail.endDate ?? null)

    const parts = toHHmmParts(detail.notificationTime ?? '09:00')
    setAmpm(parts.ampm)
    setHour12(parts.hour12)
    setMinute(parts.minute)
  }, [isEdit, detail])

  // ----- 변경 여부 비교 -----
  const initialValue = useMemo(() => {
    if (!isEdit || !detail) return
    const parts = toHHmmParts(detail.notificationTime ?? '09:00')
    return {
      title: (detail.title ?? '').trim(),
      notificationYn: toBool(detail.notificationYn),
      notificationTime: toHHmm(parts.ampm, parts.hour12, parts.minute),
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

    const same = (a: any, b: any) => String(a ?? '') === String(b ?? '')

    if (!same(initialValue.title, currentValue.title)) return true
    if (initialValue.notificationYn !== currentValue.notificationYn) return true

    if (currentValue.notificationYn) {
      if (!same(initialValue.notificationTime, currentValue.notificationTime)) return true
    }

    if (!same(initialValue.space, currentValue.space)) return true
    if (!same(initialValue.repeat, currentValue.repeat)) return true

    const initStart = initialValue.startDate ?? null
    const currStart = currentValue.startDate ?? null
    const initEnd = initialValue.endDate ?? initialValue.startDate ?? null
    const currEnd = currentValue.endDate ?? currentValue.startDate ?? null

    if (!same(initStart, currStart)) return true
    if (!same(initEnd, currEnd)) return true

    return false
  }, [isEdit, initialValue, currentValue])

  // ----- 유효성 / 버튼 disabled -----
  const hasForbiddenChar = useMemo(() => EMOJI_RE.test(inputValue), [inputValue])

  const baseValid =
    !hasForbiddenChar &&
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

  // ----- 오버레이: 공간/반복 전용 -----
  const overlayOpen = activeDropdown === 'space' || activeDropdown === 'repeat'
  // 🔴 시간 드롭다운(ampm/hour/minute)은 제외해서, 안에서 터치/스크롤 가능하게 유지

  // ----- 제출 -----
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
          onSuccess: async (resp) => {
            router.back()

            const completedMissions = resp.missionResults?.filter((m) => m.completed) ?? []
            completedMissions.forEach((mission) => {
              dispatch(
                openAchievementModal({
                  kind: 'mission',
                  title: '미션 달성!',
                  desc: `이달의 미션 \n ${mission.title} 미션을 완료했어요!`,
                  icon: missionIcon,
                })
              )
            })

            const prevBadge = qc.getQueryData<ResponseBadge[]>(['badge', 'acquired']) ?? []
            const nextBadge = await qc.fetchQuery<ResponseBadge[]>({
              queryKey: ['badge', 'acquired'],
              queryFn: getAcquiredBadges,
            })
            const newlyAcquired = getNewlyAcquiredBadge(prevBadge, nextBadge)

            newlyAcquired.forEach((badge) => {
              dispatch(
                openAchievementModal({
                  kind: 'mission', // 필요시 'badge'로 변경
                  title: `${badge.badgeTitle} 뱃지 획득`,
                  desc: getBadgeDesc(badge, nextBadge),
                  icon: badge.badgeImageUrl,
                })
              )
            })
          },
          onError: (error) => {
            const { code, message, details } = toApiError(error)
            console.warn('[createChore error]', code, details?.[0]?.message ?? message)
          },
        }
      )
    } else {
      if (!instanceId) {
        console.warn('[update] instanceId가 없습니다.')
        return
      }

      if (isRepeating && applyToAfter === null) {
        setUpdateOpen(true)
        return
      }

      updateChore(
        {
          choreInstanceId: instanceId,
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
          onSuccess: () => {
            router.back()
          },
          onError: (error) => {
            const { code, message, details } = toApiError(error)
            console.warn('[updateChore error]', code, details?.[0]?.message ?? message)
          },
        }
      )
    }
  }

  // ----- 삭제 -----
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
  const repeatOptions = ['한번', '매일', '1주마다', '2주마다', '매달', '3개월마다', '6개월마다']

  const headerTitle = isEdit ? '집안일 수정' : '집안일 추가'
  const btnLabel = isEdit ? '수정하기' : '등록하기'

  const MAX_LEN = 20
  const handleChangeText = (text: string) => {
    const limited = Array.from(text).slice(0, MAX_LEN).join('')
    setInputValue(limited)
  }

  const modalPadding =
    openCalendar === 'start'
      ? { paddingTop: 333, paddingRight: 25 }
      : { paddingTop: 383, paddingRight: 25 }

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbView}
      >
        <View style={styles.wrapper}>
          <TouchableWithoutFeedback
            disabled={overlayOpen}
            onPress={() => {
              if (overlayOpen && activeDropdown) setActiveDropdown(null)
            }}
          >
            <View style={{ flex: 1 }}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                scrollEnabled={!overlayOpen}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* 헤더 */}
                <View style={styles.headerRow}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
                    <MaterialIcons name="chevron-left" size={28} color="#686F79" />
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

                {/* 내용 */}
                <View style={styles.flex1}>
                  {/* 집안일 입력 */}
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder="집안일을 입력해주세요"
                      placeholderTextColor="#9B9FA6"
                      value={inputValue}
                      onChangeText={handleChangeText}
                      maxLength={MAX_LEN}
                      style={[
                        styles.textInput,
                        Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                      ]}
                    />
                    <Text style={styles.counterText}>
                      {inputValue.length}자/{MAX_LEN}자
                    </Text>
                  </View>

                  {hasForbiddenChar && (
                    <Text style={styles.warnText}>*특수문자를 제외해주세요</Text>
                  )}

                  {/* 추천 집안일 chips */}
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
                      {(randomChores ?? []).map((item: any) => (
                        <Pressable
                          key={item.id}
                          style={styles.chip}
                          onPress={() => setSpaceChoreId(item.id)}
                        >
                          <Text style={styles.chipText}>{item.titleKo}</Text>
                        </Pressable>
                      ))}

                      <Pressable
                        style={styles.resetBtn}
                        onPress={() => refetch()}
                        disabled={isRefetching || isLoading}
                      >
                        <View style={styles.resetContent}>
                          <Image
                            source={require('../../assets/images/icon/refresh.png')}
                            style={{ width: 16, height: 16 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.resetBtnText}>새로고침하기</Text>
                        </View>
                      </Pressable>
                    </ScrollView>
                  )}

                  {/* 카드 */}
                  <View style={styles.card}>
                    {/* 공간 */}
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

                    {/* 반복주기 */}
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
                    <View style={[styles.rowBetween, styles.relative]}>
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
                    </View>

                    <View style={styles.divider} />

                    {/* 완료일자 */}
                    <View style={[styles.rowBetween, styles.relative]}>
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
                    </View>

                    {!isDateRangeValid && (
                      <Text style={styles.errorMsg}>완료일자는 시작일자보다 빠를 수 없습니다.</Text>
                    )}

                    <View style={styles.divider} />

                    {/* 알림 토글 */}
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

              {/* 공간/반복 드롭다운 바깥 클릭 시 닫기용 오버레이 */}
              {overlayOpen && (
                <Pressable
                  onPress={() => setActiveDropdown(null)}
                  style={[
                    StyleSheet.absoluteFillObject,
                    {
                      backgroundColor: 'transparent',
                      zIndex: 100,
                    },
                  ]}
                  pointerEvents="auto"
                />
              )}
            </View>
          </TouchableWithoutFeedback>

          {/* 반복 일정 수정 모달 */}
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

          {/* 하단 버튼 */}
          <Pressable
            onPress={onSubmit}
            disabled={submitDisabled}
            style={[
              styles.submitBtn,
              submitDisabled ? styles.submitBtnDisabled : styles.submitBtnActive,
            ]}
          >
            <Text
              style={[
                styles.submitText,
                submitDisabled ? styles.submitTextDisabled : styles.submitTextActive,
              ]}
            >
              {btnLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* 캘린더 Modal: start */}
      <Modal
        visible={openCalendar === 'start'}
        transparent
        animationType="none"
        onRequestClose={() => setOpenCalendar(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setOpenCalendar(null)} />
        <View style={[styles.modalAnchorArea, modalPadding]} pointerEvents="box-none">
          <View
            style={styles.calendarPopover}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            <DatePickerCalendar
              selectedDate={safeYMD(startDate, todayYMD)}
              onSelect={(d) => {
                setStartDate(d)
                setOpenCalendar(null)
              }}
              isOpen={true}
            />
          </View>
        </View>
      </Modal>

      {/* 캘린더 Modal: end */}
      <Modal
        visible={openCalendar === 'end'}
        transparent
        animationType="none"
        onRequestClose={() => setOpenCalendar(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setOpenCalendar(null)} />
        <View style={[styles.modalAnchorArea, modalPadding]} pointerEvents="box-none">
          <View
            style={styles.calendarPopover}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            <DatePickerCalendar
              selectedDate={safeYMD(endDate, safeYMD(startDate, todayYMD))}
              onSelect={(d) => {
                setEndDate(d)
                setOpenCalendar(null)
              }}
              isOpen={true}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  kbView: { flex: 1, backgroundColor: '#F8F8FA' },
  wrapper: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 20,
  },

  scroll: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#F8F8FA',
  },
  scrollContent: {
    paddingBottom: 120, // 하단 버튼 영역 만큼 확보
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
    position: 'relative',
    height: 62,
  },
  headerBack: { position: 'absolute', left: 0 },
  headerRight: { position: 'absolute', right: 0 },
  headerTitle: { fontSize: 20, fontWeight: 600 as any, color: '#111111' },
  deleteText: { fontSize: 16, color: '#57C9D0', fontWeight: '600' },

  flex1: { flex: 1 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 14,
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: '#000',
  },
  counterText: { fontSize: 12, color: '#B4B7BC' },

  warnText: {
    fontSize: 12,
    color: '#FF4838',
    marginBottom: 12,
    paddingLeft: 12,
  },

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
    marginLeft: 8,
    marginBottom: 12,
  },
  chipText: { color: '#46A1A6', fontSize: 12, fontWeight: 600 as any },

  resetBtn: {
    backgroundColor: '#79D4D9',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    marginBottom: 12,
  },
  resetContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  resetBtnText: {
    fontSize: 12,
    fontWeight: 600 as any,
    color: 'white',
    paddingLeft: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 16, fontWeight: '500', color: '#363F4D' },
  divider: { height: 1, backgroundColor: '#E6E7E9', marginVertical: 12 },

  relative: { position: 'relative' },

  dateBtn: {
    backgroundColor: '#EBF9F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dateBtnText: { fontSize: 14, color: '#46A1A6' },

  calendarPopover: {
    width: 340,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  modalAnchorArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
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
  submitText: { fontSize: 16, fontWeight: '600' },
  submitTextActive: { color: '#FFFFFF' },
  submitTextDisabled: { color: '#B4B7BC' },
})
