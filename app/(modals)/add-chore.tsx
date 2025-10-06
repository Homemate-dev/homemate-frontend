import { router } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export default function AddChoreModal() {
  return (
    <View className="flex-1 bg-white px-5 pt-12">
      <Text className="text-xl font-bold mb-4">집안일 추가</Text>

      {/* 폼 UI 작성 영역 */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="mt-6 bg-black rounded-xl px-4 py-3"
      >
        <Text className="text-white text-center font-semibold">닫기</Text>
      </TouchableOpacity>
    </View>
  )
}
