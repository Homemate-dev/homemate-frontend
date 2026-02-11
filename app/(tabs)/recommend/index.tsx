import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'

import NotificationBell from '@/components/notification/NotificationBell'
import CategoryOverviewSection from '@/components/recommend/CategoryOverviewSection'
import MonthlyCategorySection from '@/components/recommend/MonthlyCategorySection'
import SpaceChoreSection from '@/components/recommend/SpaceChoresSection'
import TabSafeScroll from '@/components/TabSafeScroll'

export default function Recommend() {
  const androidTop = Platform.OS === 'android' ? 50 : 0

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
          <CategoryOverviewSection />

          {/* 공간별 집안일 */}
          <SpaceChoreSection />

          {/* 계절 */}
          <MonthlyCategorySection />
        </View>
      </TabSafeScroll>
      ......
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F8FA' },

  screenHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexDirection: 'row',
    height: 46,
    marginVertical: 16,
  },
  headerText: { fontWeight: 600, fontSize: 20 },
  notificationBell: { position: 'absolute', right: 0 },

  section: {
    marginBottom: 24,
  },
  sectionSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

  scrollContainer: {
    flexDirection: 'row',
    columnGap: 12,
  },

  loadingRow: { paddingVertical: 12 },
})
