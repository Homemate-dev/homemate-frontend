import { useEffect, useMemo, useState } from 'react'
import { Animated, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { useSimpleToast } from '@/contexts/SimpleToastContext'
import { styleFromRepeatColor, toRepeat } from '@/libs/utils/repeat'
import { ChoreItem } from '@/types/recommend'

import Checkbox from '../Checkbox'

type Props = {
  visible: boolean
  onClose: () => void
  title: string
  loading?: boolean
  chores: ChoreItem[]
  onSubmit: (selectedIds: number[]) => void
}

export default function RecommendChoreModal({
  visible,
  onClose,
  title,
  chores,
  loading = false,
  onSubmit,
}: Props) {
  // 개별 체크박스 선택 상태
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const [sheetAnim] = useState(new Animated.Value(300))

  const hasSelection = selected.size > 0

  const simpleToast = useSimpleToast()

  // 모달 열렸을태 상태 및 전체 선택 기능
  useEffect(() => {
    if (!visible) return

    // 초기 체크박스 전체 true
    setSelected(new Set(chores.map((c) => c.choreId)))

    // 바텀시트 애니메이션
    sheetAnim.setValue(300)
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [visible, chores, sheetAnim])

  // 전체 체크 여부 계산
  const allChecked = useMemo(
    () => chores.length > 0 && selected.size === chores.length,
    [chores.length, selected]
  )

  // 개별 토글
  const toggleOn = (id: number) => {
    if (loading) return

    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  // 전체 토글
  const toggleAllBtn = (next: boolean) => {
    if (loading) return
    setSelected(next ? new Set(chores.map((c) => c.choreId)) : new Set())
  }

  // 중복 집안일 개수 계산
  const duplicateCount = useMemo(() => chores.filter((c) => c.isDuplicate).length, [chores])

  // 선택한 중복 집안일 계산
  const duplicateSelectedIds = useMemo(() => {
    return chores.filter((c) => c.isDuplicate && selected.has(c.choreId)).map((c) => c.choreId)
  }, [chores, selected])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={!loading ? onClose : undefined} // 로딩 중엔 바깥 탭 닫기 막기
        style={styles.backdrop}
      />

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: sheetAnim }],
          },
        ]}
      >
        <Text style={styles.sheetHandle} />

        <View>
          <View style={styles.titleSection}>
            {title === '미션 달성 집안일' ? (
              <View style={styles.missionTitle}>
                <Image source={require('../../assets/images/star.svg')} />
                <Text style={styles.title}>{title}</Text>
              </View>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}

            <Checkbox
              checked={allChecked}
              onChange={(next) => toggleAllBtn(next)}
              disabled={chores.length === 0}
            />
          </View>

          <View style={styles.divider} />

          {chores.map((c) => {
            const { repeatType, repeatInterval } = toRepeat(c.frequency)
            const key = getRepeatKey(repeatType, repeatInterval)
            const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']
            const isChecked = selected.has(c.choreId)

            return (
              <View key={c.choreId} style={styles.choreList}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* 배지 + 제목 */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.badge, styleFromRepeatColor(repeat.color)]}>
                      <Text style={[styles.badgeText, styleFromRepeatColor(repeat.color)]}>
                        {repeat.label}
                      </Text>
                    </View>
                    <Text>
                      {c.title} {c.isDuplicate && <Text style={styles.duplicateHint}>*</Text>}
                    </Text>
                  </View>

                  {/* 우측 액션 자리 */}
                  <Checkbox checked={isChecked} onChange={() => toggleOn(c.choreId)} />
                </View>
              </View>
            )
          })}

          {duplicateCount > 0 && (
            <View style={styles.duplicateArea}>
              <Text style={styles.duplicateHint}>* 중복된 집안일이 {duplicateCount}개 있어요</Text>
            </View>
          )}

          <Pressable
            onPress={() => {
              if (!hasSelection) return

              // 중복 포함되면 확인 토스트 먼저 보여준 후 등록
              if (duplicateSelectedIds.length > 0) {
                onClose()
                simpleToast.show({
                  messageNode: (
                    <>
                      이미 등록된 집안일이{' '}
                      <Text style={styles.highlight}>{duplicateSelectedIds.length}개</Text>에요
                    </>
                  ),
                  actionText: '무시하고 등록',
                  onActionPress: () => {
                    onSubmit(Array.from(selected))
                  },
                })

                return
              }

              // 중복 없으면 바로 등록
              onSubmit(Array.from(selected))
            }}
            disabled={!hasSelection}
            style={[styles.addBtn, !hasSelection && styles.addBtnDisabled]}
          >
            <Text style={[styles.addBtnText, !hasSelection && styles.addBtnTextDisabled]}>
              추가하기
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E7E9',
    marginBottom: 18,
  },

  choreList: {
    marginBottom: 16,
  },

  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  missionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  title: { fontSize: 18, fontWeight: 700, color: '#46A1A6' },
  divider: { borderBottomWidth: 0.5, borderBottomColor: '#DDF4F6', marginBottom: 16 },

  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 23,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 12,
  },

  duplicateArea: {
    alignItems: 'center',
    marginBottom: 12,
  },

  duplicateHint: {
    fontSize: 14,
    color: '#46A1A6',
    top: 0,
  },

  addBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addBtnDisabled: {
    backgroundColor: '#E6E7E9',
  },

  addBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 600 },

  addBtnTextDisabled: {
    color: '#B4B7BC',
  },

  highlight: {
    color: '#57C9D0',
  },
})
