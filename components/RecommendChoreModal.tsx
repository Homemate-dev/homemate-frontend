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
}

export default function DeleteModal({ visible, onClose, title, chores, loading = false }: Props) {
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
            <Checkbox checked />
          </View>

          <View style={styles.divider} />

          {chores.map((c, idx) => {
            const { repeatType, repeatInterval } = toRepeatFields(c.frequency)
            const key = getRepeatKey(repeatType, repeatInterval)
            const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']
            const isLast = idx === chores.length - 1

            return (
              <View key={c.choreId}>
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
                  <Pressable>{/* ... */}</Pressable>
                </View>

                {!isLast && <View style={styles.divider} />}
              </View>
            )
          })}
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontFamily: 'PretendardBold', fontSize: 18, color: '#57C9D0' },
  divider: { borderBottomWidth: 0.5, borderBottomColor: '#E6E7E9', marginBottom: 8.5 },

  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 23,
    borderRadius: 6,
  },

  badgeText: {
    fontFamily: 'PretendardRegular',
    fontSize: 12,
  },
})
