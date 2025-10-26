import { router } from 'expo-router'
import { Image, Modal, Pressable, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { closeAchievementModal } from '@/store/slices/achievementModalSlice'

export default function AchievementModal() {
  const dispatch = useDispatch()
  const { isVisible, kind, title, desc, icon } = useSelector((s: RootState) => s.achievementModal)

  const onClose = () => dispatch(closeAchievementModal())
  const onPrimary = () => {
    onClose()
    if (kind === 'badge') router.push('/mybadges')
    else router.push('/(tabs)/mission')
  }

  const primaryLabel = kind === 'badge' ? '뱃지 더보기' : '미션 더보기'

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={onClose}
    >
      {/* 반투명 백드롭 */}
      <Pressable onPress={onClose} className="absolute inset-0 bg-black/40" />

      {/* 중앙 카드 */}
      <View className="absolute inset-0 px-5 items-center justify-center">
        <View className="w-full rounded-2xl bg-white p-6 items-center">
          {/*  타이틀 및 설명 */}
          <Text className="text-2xl font-semibold mb-2">{title}</Text>
          <Text className="text-base text-[#686F79] text-center max-w-[164px] mb-3">{desc}</Text>

          {/* 아이콘 */}
          <View className="mb-4">
            <Image source={icon} style={{ width: 124, height: 124 }} resizeMode="contain" />
          </View>

          <View className="w-full flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 h-11 rounded-xl items-center justify-center bg-[#E6E7E9]"
            >
              <Text className="text-[#686F79] text-base">닫기</Text>
            </Pressable>

            {/* 버튼 */}
            <Pressable
              onPress={onPrimary}
              className="flex-1 h-11 rounded-xl items-center justify-center bg-[#57C9D0]"
            >
              <Text className="text-base font-semibold text-white">{primaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
