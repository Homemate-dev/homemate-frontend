import { useMemo, useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import { useRegisterSpace } from '@/libs/hooks/recommend/useRegisterSpace'
import useSpaceChoreList from '@/libs/hooks/recommend/useSpaceChoreList'
import useSpaceList from '@/libs/hooks/recommend/useSpaceList'
import { trackEvent } from '@/libs/utils/ga4'
import { styleFromRepeatColor, toRepeat } from '@/libs/utils/repeat'
import { SpaceApi, SpaceUi, toSpaceUi } from '@/libs/utils/space'

function chunkBy<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

export default function SpaceChoreSection() {
  // ----- 상태관리 -----
  const { data: user } = useMyPage()
  const [activeSpace, setActiveSpace] = useState<SpaceApi>('KITCHEN')
  const [selectedSpace, setSelectedSpace] = useState<SpaceApi | undefined>('KITCHEN')

  // ----- api 훅 -----
  const { data: spaceList = [], isLoading: spaLoading } = useSpaceList()

  const {
    data: spaceChores = [],
    isLoading: spaChoreLoading,
    isError: spaChoreError,
  } = useSpaceChoreList(selectedSpace)

  const { mutate: spaRegister } = useRegisterSpace()

  const uiSpaces = useMemo((): { code: SpaceApi; label: SpaceUi }[] => {
    const list = (spaceList ?? []).map(({ space }) => ({
      code: space as SpaceApi,
      label: toSpaceUi(space)!,
    }))

    return list.length
      ? list
      : (['KITCHEN', 'BATHROOM', 'BEDROOM', 'PORCH', 'ETC'] as SpaceApi[]).map((code) => ({
          code,
          label: toSpaceUi(code)!,
        }))
  }, [spaceList])

  const choresList = useMemo(() => spaceChores.slice(0, 5), [spaceChores])

  return (
    <View style={styles.section}>
      {/* 헤더 */}
      <View style={styles.sectionSpace}>
        <Text style={styles.sectionTitle}>공간별 집안일</Text>
      </View>

      {/* 공간 리스트 */}
      <View style={styles.spaceList}>
        {spaLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
          </View>
        )}

        {uiSpaces.map(({ code, label }) => {
          const isActive = activeSpace === code
          return (
            <Pressable
              key={code}
              style={[styles.space, isActive && styles.spaceActive]}
              onPress={() => {
                setActiveSpace(code)
                setSelectedSpace(code)
              }}
              hitSlop={6}
            >
              <Text style={[styles.spaceText, isActive && styles.spaceTextActive]}>{label}</Text>
            </Pressable>
          )
        })}
      </View>

      {/* 공간에 해당하는 집안일 카드 */}
      <View style={styles.choreCard}>
        {spaChoreLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
          </View>
        )}

        {spaChoreError && (
          <Text style={{ color: '#FF4838' }}>공간별 집안일 불러오기에 실패했습니다.</Text>
        )}

        <View style={styles.choreRow}>
          {choresList.map((c, i) => {
            const { repeatType, repeatInterval } = toRepeat(c.frequency)
            const key = getRepeatKey(repeatType, repeatInterval)
            const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']

            return (
              <View key={c.choreId}>
                <View style={[styles.choreList, i === choresList.length - 1 && styles.mb0]}>
                  <View style={styles.chore}>
                    <View style={[styles.badge, styleFromRepeatColor(repeat.color)]}>
                      <Text style={[styles.badgeText, styleFromRepeatColor(repeat.color)]}>
                        {repeat.label}
                      </Text>
                    </View>
                    <Text style={styles.choreTitle}>{c.title}</Text>
                  </View>

                  <Pressable
                    onPress={() => {
                      // GA4 태깅
                      trackEvent('task_created', {
                        user_id: user?.id,
                        task_type: 'SPACE',
                        title: c.title,
                        cycle: repeat.label,
                      })
                      spaRegister({ spaceChoreId: c.choreId, space: activeSpace })
                    }}
                    hitSlop={8}
                  >
                    <Image
                      source={require('../../assets/images/plus-square.png')}
                      resizeMode="contain"
                      style={{ width: 20, height: 20 }}
                    />
                  </Pressable>
                </View>

                {i !== choresList.length - 1 && <View style={styles.divider} />}
              </View>
            )
          })}
        </View>
      </View>

      {/* 더보기 버튼 */}
      <Pressable style={styles.btnArea}>
        <Text style={styles.btnText}>더보기</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

  spaceList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  loadingRow: { paddingVertical: 12 },
  space: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E7E9',
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  spaceActive: {
    backgroundColor: '#79D4D9',
    borderWidth: 0,
  },

  spaceTextActive: {
    color: '#FFFFFF',
    fontWeight: 600,
  },

  spaceText: { color: '#9B9FA6', fontSize: 14 },

  choreCard: {
    flexDirection: 'row',
    gap: 12,
  },
  choreList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8.5,
  },
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

  mb0: {
    marginBottom: 0,
  },

  divider: { borderBottomWidth: 0.5, borderBottomColor: '#E6E7E9', marginBottom: 8.5 },

  btnArea: {
    width: '100%',
    backgroundColor: '#57C9D0',
    height: 44,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 600,
    color: '#FFFFFF',
  },
})
