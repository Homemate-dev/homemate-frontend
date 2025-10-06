// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, Tabs } from 'expo-router'
import { Image, Platform, TouchableOpacity, View } from 'react-native'

const ICONS = {
  index: [
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
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/add-chore')}
        className="w-[48px] h-[48px] bg-[#57C9D0] rounded-full items-center justify-center"
      >
        <Ionicons name="add" size={40} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index" // 첫 화면: 홈
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#57C9D0',
        tabBarInactiveTintColor: '#B4B7BC',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 700, marginTop: 3 },
        tabBarStyle: {
          height: Platform.OS === 'android' ? 72 : 60,
          paddingBottom: 6,
          paddingTop: 10,
          elevation: 0, // Android 기본 그림자 제거
          shadowOpacity: 0, // iOS 기본 그림자 제거
          backgroundColor: 'transparent',
          position: 'absolute',
          overflow: 'visible',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <View className="h-full rounded-t-3xl bg-white border-t border-r border-l border-[#E5E5E5]" />
        ),
        tabBarIcon: ({ focused }) => {
          const [inactive, active] = ICONS[route.name as keyof typeof ICONS] ?? []
          if (!inactive || !active) return null
          return (
            <Image source={focused ? active : inactive} className="w-6 h-6" resizeMode="contain" />
          )
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
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
    </Tabs>
  )
}
