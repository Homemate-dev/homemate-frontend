import { MaterialIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import NotificationBell from '@/components/notification/NotificationBell'
import TabSafeScroll from '@/components/TabSafeScroll'
import { getRepeatKey, REPEAT_STYLE } from '@/constants/choreRepeatStyles'
import { SpaceApi, SpaceUi, toSpaceUi } from '@/libs/utils/space'

const mockCategory = [
  { category: '겨울철 대청소' },
  { category: '주말 대청소 루틴' },
  { category: '호텔 화장실 따라잡기' },
  { category: '안전 점검의 날' },
  { category: '가전제품 관리하기' },
  { category: '하루 10분 청소하기' },
]

const mockChores = [
  {
    id: 1,
    code: 'KITCHEN_01',
    titleKo: '설거지하기',
    repeatType: 'DAILY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 2,
    code: 'KITCHEN_02',
    titleKo: '싱크대 거름망 비우기',
    repeatType: 'DAILY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 3,
    code: 'KITCHEN_03',
    titleKo: '조리대·식탁 닦기',
    repeatType: 'DAILY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 4,
    code: 'KITCHEN_04',
    titleKo: '가스레인지/인덕션 상판 닦기',
    repeatType: 'DAILY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 5,
    code: 'KITCHEN_05',
    titleKo: '도마·칼 소독하기',
    repeatType: 'WEEKLY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 6,
    code: 'KITCHEN_06',
    titleKo: '수세미·행주 삶기/교체',
    repeatType: 'WEEKLY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 7,
    code: 'KITCHEN_07',
    titleKo: '식료품 재고 체크·장보기 목록 만들기',
    repeatType: 'WEEKLY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 8,
    code: 'KITCHEN_08',
    titleKo: '전자레인지 스팀 청소하기',
    repeatType: 'WEEKLY',
    repeatInterval: 2,
    space: 'KITCHEN',
  },
  {
    id: 9,
    code: 'KITCHEN_09',
    titleKo: '싱크대 배수구 세정제 사용',
    repeatType: 'WEEKLY',
    repeatInterval: 2,
    space: 'KITCHEN',
  },
  {
    id: 10,
    code: 'KITCHEN_10',
    titleKo: '냉장고 정리·유통기한 확인하기',
    repeatType: 'MONTHLY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 11,
    code: 'KITCHEN_11',
    titleKo: '양념통·조미료 정리',
    repeatType: 'MONTHLY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 12,
    code: 'KITCHEN_12',
    titleKo: '식기세척기 필터 청소',
    repeatType: 'MONTHLY',
    repeatInterval: 1,
    space: 'KITCHEN',
  },
  {
    id: 13,
    code: 'KITCHEN_13',
    titleKo: '주방 후드 필터 세척',
    repeatType: 'MONTHLY',
    repeatInterval: 3,
    space: 'KITCHEN',
  },
  {
    id: 14,
    code: 'KITCHEN_14',
    titleKo: '커피머신 디스케일링',
    repeatType: 'MONTHLY',
    repeatInterval: 3,
    space: 'KITCHEN',
  },
  {
    id: 15,
    code: 'KITCHEN_15',
    titleKo: '오븐 내부 딥클리닝',
    repeatType: 'MONTHLY',
    repeatInterval: 6,
    space: 'KITCHEN',
  },
]

const SPACE: readonly SpaceApi[] = ['KITCHEN', 'BATHROOM', 'BEDROOM', 'PORCH', 'ETC']

// 3개씩 묶어서 "한 행(row)" 만들기
function chunkBy<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function Recommend() {
  const androidTop = Platform.OS === 'android' ? 50 : 0

  const categoryRows = chunkBy(mockCategory, 3) // ← 한 줄에 3개

  const [activeSpace, setActiveSpace] = useState<SpaceApi>('KITCHEN')

  const filteredChores = useMemo(
    () => mockChores.filter((c) => c.space === activeSpace),
    [activeSpace]
  )

  const choreRows = useMemo(() => chunkBy(filteredChores, 5), [filteredChores])

  const uiSpaces = useMemo(
    (): { code: SpaceApi; label: SpaceUi }[] =>
      SPACE.map((code) => ({ code, label: toSpaceUi(code)! })), // ← !
    []
  )

  const styleFromRepeatColor = (cls: string | undefined) => {
    if (!cls) return {}
    const bgMatch = cls.match(/bg-\[#([0-9A-Fa-f]{6})\]/)
    const textMatch = cls.match(/text-\[#([0-9A-Fa-f]{6})\]/)
    const style: any = {}
    if (bgMatch) style.backgroundColor = `#${bgMatch[1]}`
    if (textMatch) style.color = `#${textMatch[1]}`
    return style
  }

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />
      <TabSafeScroll contentContainerStyle={{ paddingTop: androidTop }}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.screenHeader}>
            <Text style={styles.headerText}>추천</Text>
            <View style={styles.notificationBell}>
              <NotificationBell />
            </View>
          </View>

          {/* 이번달 집안일 카테고리 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이번달 집안일 카테고리</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              horizontal
            >
              {categoryRows.map((row, rIdx) => (
                <View key={`row-${rIdx}`} style={styles.row}>
                  {row.map((c, i) => (
                    <Pressable key={`${c.category}-${i}`} style={styles.card} onPress={() => {}}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                          {c.category}
                        </Text>
                        <MaterialIcons name="chevron-right" size={18} color="#B4B7BC" />
                      </View>
                      <Text style={styles.cardSub}>5개의 집안일</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 공간별 집안일 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공간별 집안일</Text>

            <View style={styles.spaceList}>
              {uiSpaces.map(({ code, label }) => {
                const isActive = activeSpace === code
                return (
                  <Pressable
                    key={code}
                    style={[styles.space, isActive && styles.spaceActive]}
                    onPress={() => setActiveSpace(code)}
                    hitSlop={6}
                  >
                    <Text style={[styles.spaceText, isActive && styles.spaceTextActive]}>
                      {label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollChore}
              horizontal
            >
              {choreRows.map((row, rIdx) => (
                <View key={`row-${rIdx}`} style={styles.choreRow}>
                  {row.map((c, i) => {
                    const key = getRepeatKey(c.repeatType, c.repeatInterval)
                    const repeat = REPEAT_STYLE[key] ?? REPEAT_STYLE['NONE-0']

                    return (
                      <>
                        <View
                          key={c.id}
                          style={[styles.choreList, i === row.length - 1 && styles.mb0]}
                        >
                          <View style={styles.chore}>
                            <Text style={[styles.badgeText, styleFromRepeatColor(repeat.color)]}>
                              {repeat.label}
                            </Text>
                            <Text style={styles.choreTitle}>{c.titleKo}</Text>
                          </View>

                          <Pressable>
                            <Image
                              source={require('../../assets/images/plus-square.png')}
                              resizeMode="contain"
                              style={{ width: 20, height: 20 }}
                            />
                          </Pressable>
                        </View>

                        {i !== row.length - 1 && <View style={styles.divider} />}
                      </>
                    )
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </TabSafeScroll>
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F8FA' },

  screenHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
    flexDirection: 'row',
    height: 62,
  },
  headerText: { fontFamily: 'PretendardSemiBold', fontSize: 20 },
  notificationBell: { position: 'absolute', right: 0 },

  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'PretendardBold', fontSize: 18, fontWeight: '700', marginBottom: 12 },

  scrollContainer: {
    flexDirection: 'column',
    rowGap: 12,
  },

  row: {
    flexDirection: 'row',
    columnGap: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  placeholder: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'PretendardSemiBold',
    color: '#46A1A6',
    flexShrink: 1,
  },
  cardSub: {
    fontSize: 13,
    fontFamily: 'PretendardRegular',
    color: '#4F5763',
  },

  // 공간 탭
  spaceList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
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
    fontFamily: 'PretendardSemiBold',
  },

  spaceText: { color: '#9B9FA6', fontFamily: 'PretendardRegular', fontSize: 14 },

  scrollChore: {
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
    minWidth: 300,
  },
  chore: { flexDirection: 'row', gap: 12 },
  badgeText: {
    fontFamily: 'PretendardRegular',
    fontSize: 12,
    textAlign: 'center',
    width: 42,
    height: 23,
    borderRadius: 6,
  },

  choreTitle: {
    fontFamily: 'PretendardRegular',
    fontSize: 14,
  },

  mb0: {
    marginBottom: 0,
  },

  divider: { borderBottomWidth: 0.5, borderBottomColor: '#E6E7E9', marginBottom: 8.5 },
})
