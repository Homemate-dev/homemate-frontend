import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'

import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import { useRegisterSpace } from '@/libs/hooks/recommend/useRegisterSpace'
import useSpaceChoreList from '@/libs/hooks/recommend/useSpaceChoreList'
import useSpaceList from '@/libs/hooks/recommend/useSpaceList'
import { trackEvent } from '@/libs/utils/ga4'
import { SpaceApi, SpaceUi, toSpaceUi } from '@/libs/utils/space'

import SpaceChoreListCard from './SpaceChoreListCard'

export default function SpaceChoreSection() {
  // ----- 상태관리 -----
  const { data: user } = useMyPage()
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

  return (
    <View style={styles.section}>
      {/* 헤더 */}

      <Text style={styles.sectionTitle}>공간별 집안일</Text>

      {/* 공간 리스트 */}
      <View style={styles.spaceList}>
        {spaLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
          </View>
        )}

        {uiSpaces.map(({ code, label }) => {
          const isActive = selectedSpace === code
          return (
            <Pressable
              key={code}
              style={[styles.space, isActive && styles.spaceActive]}
              onPress={() => {
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
      <SpaceChoreListCard
        choresList={spaceChores}
        limit={5}
        isLoading={spaChoreLoading}
        isError={spaChoreError}
        onAdd={(c, cycleLabel) => {
          trackEvent('task_created', {
            user_id: user?.id,
            task_type: 'SPACE',
            title: c.title,
            cycle: cycleLabel,
          })

          spaRegister({ spaceChoreId: c.choreId, space: c.spaceName })
        }}
      />

      {/* 더보기 버튼 */}
      <Pressable
        style={styles.btnArea}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/recommend/space-chores',
            params: {
              space: selectedSpace,
            },
          })
        }
      >
        <Text style={styles.btnText}>더보기</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
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
