// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons'
import { useQueryClient } from '@tanstack/react-query'
import { router, Tabs } from 'expo-router'
import { useEffect } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'

const ICONS = {
  home: [
    require('../../assets/images/tabs/home.png'),
    require('../../assets/images/tabs/home-active.png'),
  ],
  recommend: [
    require('../../assets/images/tabs/recommend.png'),
    require('../../assets/images/tabs/recommend-active.png'),
  ],
  mission: [
    require('../../assets/images/tabs/mission.png'),
    require('../../assets/images/tabs/mission-active.png'),
  ],
  mypage: [
    require('../../assets/images/tabs/mypage.png'),
    require('../../assets/images/tabs/mypage-active.png'),
  ],
} as const

function CenterAddButton() {
  return (
    <View style={styles.centerBtnWrap}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(modals)/add-chore')}
        style={styles.centerBtn}
      >
        <Ionicons name="add" size={40} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
}

export default function TabsLayout() {
  const { user, verified } = useAuth()
  const qc = useQueryClient()

  /** 로그인 직후 뱃지 목록 조회(기준 baseline 생성) */
  useEffect(() => {
    if (!verified || !user?.id) return

    qc.fetchQuery({
      queryKey: ['badge', 'acquired'],
      queryFn: getAcquiredBadges,
    })
  }, [verified, user?.id, qc])

  return (
    <Tabs
      initialRouteName="home" // 첫 화면: 홈
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#57C9D0',
        tabBarInactiveTintColor: '#B4B7BC',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 700, marginTop: 3 },
        sceneContainerStyle: { backgroundColor: '#F8F8FA' },
        tabBarStyle: {
          height: 80,
          paddingBottom: 6,
          paddingTop: 10,
          elevation: 0, // Android 기본 그림자 제거
          shadowOpacity: 0, // iOS 기본 그림자 제거
          backgroundColor: '#F8F8FA',
          position: 'absolute',
          overflow: 'visible',
          borderTopWidth: 0,
        },
        tabBarBackground: () => <View style={styles.tabBarBg} />,
        tabBarIcon: ({ focused }) => {
          const [inactive, active] = ICONS[route.name as keyof typeof ICONS] ?? []
          if (!inactive || !active) return null
          return (
            <Image
              source={focused ? active : inactive}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          )
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: '홈' }} />
      <Tabs.Screen name="recommend" options={{ title: '추천' }} />
      <Tabs.Screen
        name="addChore"
        options={{
          title: '',
          tabBarLabel: '',
          tabBarButton: () => <CenterAddButton />,
        }}
      />
      <Tabs.Screen name="mission" options={{ title: '미션' }} />
      <Tabs.Screen name="mypage" options={{ title: '마이페이지' }} />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null, // 탭 버튼 숨김
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="mybadges"
        options={{
          href: null, // 탭 버튼 숨김
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  centerBtnWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#57C9D0',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBg: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#E5E5E5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
})
