// app/(tabs)/_layout.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

type RouteName = "index" | "recommend" | "mission" | "mypage";

const ICONS: Record<
  RouteName,
  readonly [/* outline */ string, /* filled */ string]
> = {
  index: ["home-outline", "home"],
  recommend: ["thumbs-up-outline", "thumbs-up"],
  mission: ["flag-outline", "flag"],
  mypage: ["person-outline", "person"],
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index" // 첫 화면: 홈
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111111",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 60, paddingBottom: 6, paddingTop: 6 },
        tabBarIcon: ({ color, size, focused }) => {
          const [outline, filled] = ICONS[route.name as RouteName] ?? [
            "ellipse-outline",
            "ellipse",
          ];

          return (
            <Ionicons
              name={(focused ? filled : outline) as any} // 리터럴 타입 보장, 안전하게 캐스팅
              size={size ?? 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="recommend" options={{ title: "추천" }} />
      <Tabs.Screen name="mission" options={{ title: "미션" }} />
      <Tabs.Screen name="mypage" options={{ title: "마이페이지" }} />
    </Tabs>
  );
}
