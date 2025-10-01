// app/_layout.tsx
import "react-native-reanimated"; // 반드시 최상단, 한 번만
import "../global.css";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* (tabs) 그룹을 루트에서 렌더 */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* 필요하면 모달 등 추가 */}
      {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
    </Stack>
  );
}
