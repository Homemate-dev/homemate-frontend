import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Mission() {
  return (
    <View className="flex-row items-center justify-center mb-6">
      <TouchableOpacity onPress={() => router.back()} className="absolute left-0">
        <MaterialIcons name="chevron-left" size={24} color="#686F79" />
      </TouchableOpacity>
      <Text className="text-[22px] font-semibold">나의 뱃지</Text>
    </View>
  )
}
