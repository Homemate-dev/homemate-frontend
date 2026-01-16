import {
  ActivityIndicator,
  DimensionValue,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { styleFromRepeatColor, toRepeat } from '@/libs/utils/repeat'
import { ChoreItem } from '@/types/recommend'

type Props = {
  choresList: ChoreItem[]
  isLoading?: boolean
  isError?: boolean
  limit?: number
  width?: DimensionValue
  expandedGap?: boolean
  onAdd: (item: ChoreItem, cycleLabel: string) => void
}

export default function SpaceChoreListCard({
  choresList,
  isLoading,
  isError,
  limit,
  width = '100%',
  expandedGap,
  onAdd,
}: Props) {
  const list = limit ? choresList.slice(0, limit) : choresList

  return (
    <View style={styles.choreCard}>
      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
        </View>
      )}

      {isError && <Text style={{ color: '#FF4838' }}>공간별 집안일 불러오기에 실패했습니다.</Text>}

      <View style={[styles.choreRow, width ? { width } : null]}>
        {list.map((c, i) => {
          const { repeatType, repeatInterval } = toRepeat(c.frequency)
          const key = getRepeatKey(repeatType, repeatInterval)
          const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']
          const isLast = i === list.length - 1

          return (
            <View key={c.choreId}>
              <View
                style={[
                  styles.choreList,
                  expandedGap ? styles.mb12 : styles.mb8,
                  isLast && styles.mb0,
                ]}
              >
                <View style={styles.chore}>
                  <View style={[styles.badge, styleFromRepeatColor(repeat.color)]}>
                    <Text style={[styles.badgeText, styleFromRepeatColor(repeat.color)]}>
                      {repeat.label}
                    </Text>
                  </View>
                  <Text style={styles.choreTitle}>{c.title}</Text>
                </View>

                <Pressable onPress={() => onAdd(c, repeat.label)} hitSlop={8}>
                  <Image
                    source={require('../../assets/images/plus-square.png')}
                    resizeMode="contain"
                    style={{ width: 20, height: 20 }}
                  />
                </Pressable>
              </View>

              {!isLast && <View style={styles.divider} />}
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingRow: { paddingVertical: 12 },
  choreCard: {
    flexDirection: 'row',
    gap: 12,
  },
  choreList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb0: { marginBottom: 0 },
  choreRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
  },
  chore: { flexDirection: 'row', gap: 12, alignItems: 'center' },

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

  choreTitle: {
    fontSize: 14,
  },

  divider: { borderBottomWidth: 0.5, borderBottomColor: '#E6E7E9', marginBottom: 8.5 },
})
