import { useEffect, useMemo, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { styleFromRepeatColor, toRepeatFields } from '@/libs/utils/repeat'
import { RecommendChores } from '@/types/recommend'

import Checkbox from './Checkbox'

type Props = {
  visible: boolean
  onClose: () => void
  title: string
  loading?: boolean
  chores: RecommendChores[]
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

  // 모달 열렸을태 상태 및 전체 선택 기능
  useEffect(() => {
    if (!visible) return

    // 초기 체크박스 false
    setSelected(new Set())
  }, [visible, chores])

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={!loading ? onClose : undefined} // 로딩 중엔 바깥 탭 닫기 막기
        style={styles.backdrop}
      />

      <View style={styles.sheet}>
        <Text style={styles.sheetHandle} />

        <View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            <Checkbox
              checked={allChecked}
              onChange={(next) => toggleAllBtn(next)}
              disabled={chores.length === 0}
            />
          </View>

          <View style={styles.divider} />

          {chores.map((c) => {
            const { repeatType, repeatInterval } = toRepeatFields(c.frequency)
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
                    <Text>{c.title}</Text>
                  </View>

                  {/* 우측 액션 자리 */}
                  <Checkbox checked={isChecked} onChange={() => toggleOn(c.choreId)} />
                </View>
              </View>
            )
          })}

          <Pressable onPress={() => onSubmit(Array.from(selected))} style={styles.addBtn}>
            <Text style={styles.addBtnText}>추가하기</Text>
          </Pressable>
        </View>
      </View>
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
  title: { fontFamily: 'pretendard', fontSize: 18, fontWeight: 700, color: '#57C9D0' },
  divider: { borderBottomWidth: 0.5, borderBottomColor: '#DDF4F6', marginBottom: 16 },

  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 23,
    borderRadius: 6,
  },

  badgeText: {
    fontFamily: 'pretendard',
    fontSize: 12,
  },

  addBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontFamily: 'pretendard', fontSize: 16, fontWeight: 600 },
})
