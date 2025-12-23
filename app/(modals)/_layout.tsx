import { Stack } from 'expo-router'
import { Platform } from 'react-native'

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F8FA' } }}>
      <Stack.Screen
        name="add-chore"
        options={{
          presentation: Platform.select({ ios: 'fullScreenModal', android: 'card' }),
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          presentation: Platform.select({ ios: 'fullScreenModal', android: 'card' }),
        }}
      />
    </Stack>
  )
}
