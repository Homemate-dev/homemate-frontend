import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import SpaceChoreListCard from '@/components/recommend/SpaceChoreListCard'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'
import { useRegisterSpace } from '@/libs/hooks/recommend/useRegisterSpace'
import useSpaceChoreList from '@/libs/hooks/recommend/useSpaceChoreList'
import useSpaceList from '@/libs/hooks/recommend/useSpaceList'
import { trackEvent } from '@/libs/utils/ga4'
import { SpaceApi, SpaceUi, toSpaceUi } from '@/libs/utils/space'

export default function SpaceChoresScreen() {
  const params = useLocalSearchParams<{ space?: SpaceApi }>()
  // ----- 상태관리 -----
  const [selectedSpace, setSelectedSpace] = useState<SpaceApi | undefined>(params.space)

  // ----- api 훅 -----
  const { data: user } = useMyPage()
  const { data: spaceList = [], isLoading: spaceLoading } = useSpaceList()

  const {
    data: spaceChores = [],
    isLoading: choreLoading,
    isError: choreError,
  } = useSpaceChoreList(selectedSpace)

  const { mutate: spaRegister } = useRegisterSpace()

  useEffect(() => {
    // params.space가 바뀌면 selectedSpace도 같이 바꾸기
    setSelectedSpace(params.space)
  }, [params.space])

  // 탭용 공간 리스트 (전체 + 공간들)
  const uiSpaces = useMemo((): { code?: SpaceApi; label: SpaceUi | '전체' }[] => {
    const spaces = (spaceList ?? []).map(({ space }) => ({
      code: space as SpaceApi,
      label: toSpaceUi(space)!,
    }))

    return [{ code: undefined, label: '전체' }, ...spaces]
  }, [spaceList])

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: '/(tabs)/recommend',
                params: { space: params.space },
              })
            }
            style={styles.backBtn}
          >
            <MaterialIcons name="chevron-left" size={24} color="#686F79" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>공간별 집안일</Text>
        </View>

        {/* 공간 리스트 */}
        <View style={styles.tabBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.spaceList}
          >
            {spaceLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
              </View>
            )}

            {uiSpaces.map(({ code, label }) => {
              const isActive = selectedSpace === code
              return (
                <TouchableOpacity
                  key={String(label)}
                  style={[styles.space, isActive && styles.spaceActive]}
                  onPress={() => {
                    setSelectedSpace(code)
                    router.setParams({ space: code })
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.spaceText, isActive && styles.spaceTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* 공간 리스트 */}
        <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent}>
          <SpaceChoreListCard
            choresList={spaceChores}
            isLoading={choreLoading}
            isError={choreError}
            expandedGap
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
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FA', paddingHorizontal: 20, paddingTop: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  tabBar: {
    height: 50,
  },

  spaceList: {
    alignItems: 'center',
    paddingRight: 8,
    marginBottom: 16,
  },

  loadingRow: { paddingVertical: 12 },
  space: {
    height: 32,
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E7E9',
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
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

  backBtn: { position: 'absolute', left: 0 },
  headerTitle: { fontSize: 20, fontWeight: '600' },

  listScroll: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 24,
  },
})
