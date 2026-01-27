// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons'
import { useQueryClient } from '@tanstack/react-query'
import { router, Tabs } from 'expo-router'
import { useEffect } from 'react'
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { getAcquiredBadges } from '@/libs/api/badge/getAcquiredBadges'
import { useReplaceTab } from '@/libs/hooks/tabs/useReplaceTab'

const TAB_BAR_HEIGHT = 80

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
    <View pointerEvents="box-none" style={styles.fabWrap}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(modals)/add-chore')}
        style={styles.fabBtn}
      >
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

/** 탭바 가운데 자리 확보용 더미 버튼 (터치 안 먹음) */
function DummyTabButton(props: any) {
  const { style, href, onPress, ...rest } = props // href/onPress 제거
  return <Pressable {...rest} pointerEvents="none" style={[style, { height: TAB_BAR_HEIGHT }]} />
}

function TabButton({ props, onPress }: { props: any; onPress: () => void }) {
  const { href: _href, onPress: _onPress, style, ...rest } = props as any
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      style={[style, { height: TAB_BAR_HEIGHT, justifyContent: 'center' }]}
    />
  )
}

export default function TabsLayout() {
  const replaceTab = useReplaceTab()
  const { user, verified } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!verified || !user?.id) return
    qc.fetchQuery({
      queryKey: ['badge', 'acquired'],
      queryFn: getAcquiredBadges,
    })
  }, [verified, user?.id, qc])

  return (
    <View style={styles.root}>
      <Tabs
        initialRouteName="home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#57C9D0',
          tabBarInactiveTintColor: '#B4B7BC',
          tabBarLabelStyle: { fontSize: 12, fontWeight: 700, marginTop: 3 },
          sceneContainerStyle: { backgroundColor: '#F8F8FA' },

          tabBarStyle: {
            height: TAB_BAR_HEIGHT,
            paddingBottom: 6,
            paddingTop: 10,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: '#F8F8FA',
            position: 'absolute',
            borderTopWidth: 0,
          },

          // 배경 레이어가 터치 간섭하지 않게
          tabBarBackground: () => <View pointerEvents="none" style={styles.tabBarBg} />,

          tabBarIcon: ({ focused }) => {
            const tabKey = route.name.split('/')[0] as keyof typeof ICONS
            const [inactive, active] = ICONS[tabKey] ?? []
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
        <Tabs.Screen
          name="home"
          options={{
            title: '홈',
            tabBarButton: (props) => (
              <TabButton props={props} onPress={() => replaceTab('/(tabs)/home')} />
            ),
          }}
        />

        <Tabs.Screen
          name="recommend/index"
          options={{
            title: '추천',
            tabBarButton: (props) => (
              <TabButton props={props} onPress={() => replaceTab('/(tabs)/recommend')} />
            ),
          }}
        />

        <Tabs.Screen
          name="recommend/space-chores"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* 가운데 빈칸 1개 */}
        <Tabs.Screen
          name="__dummy__"
          options={{
            title: '',
            tabBarLabel: () => null,
            tabBarIcon: () => null,
            tabBarButton: (props) => <DummyTabButton {...props} />,
          }}
        />

        <Tabs.Screen
          name="mission"
          options={{
            title: '미션',
            tabBarButton: (props) => (
              <TabButton props={props} onPress={() => replaceTab('/(tabs)/mission')} />
            ),
          }}
        />

        <Tabs.Screen
          name="mypage/index"
          options={{
            title: '마이페이지',
            tabBarButton: (props) => (
              <TabButton props={props} onPress={() => replaceTab('/(tabs)/mypage')} />
            ),
          }}
        />

        <Tabs.Screen
          name="mypage/withdraw"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="mybadges"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* addChore 탭은 존재하더라도 탭바에서 숨김 */}
        <Tabs.Screen
          name="addChore"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>

      {/* 중앙 + 버튼은 Tabs 밖에서 FAB로 */}
      <CenterAddButton />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // FAB: 화면 정중앙
  fabWrap: {
    position: 'absolute',
    left: '50%',
    bottom: 15,
    transform: [{ translateX: -24 }],
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  fabBtn: {
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
