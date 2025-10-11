import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Image, ImageSourcePropType, Modal, Pressable, StatusBar, Text, View } from 'react-native'

export type Badge = {
  id: number
  title: string
  desc: string
  current: number
  target: number
  icon: ImageSourcePropType
}

type Props = {
  badge: Badge
  onClose: () => void
  variant: 'mine' | 'mission'
}

export default function BadgeDetail({ badge, variant, onClose }: Props) {
  if (!badge) return null

  return (
    <Modal
      visible
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      hardwareAccelerated
    >
      {/* 상태바 어둡게 (iOS/Android 모두 적용) */}
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.25)" />
      {/* 반투명 백드롭 */}
      <Pressable className="flex-1 inset-0 bg-black/25" onPress={onClose} />

      {/* 중앙 카드 */}
      <View className="absolute inset-0 px-5 items-center justify-center">
        <View className="bg-white w-full rounded-2xl p-7 items-center justify-center">
          {variant === 'mission' && (
            <Pressable onPress={onClose} className="absolute top-4 right-4 p-1">
              <Ionicons name="close" size={20} />
            </Pressable>
          )}
          <Text className="text-2xl font-semibold mb-2">{badge.title}</Text>
          <Text className="text-base text-[#686F79] text-center max-w-[164px] mb-3">
            {badge.desc}
          </Text>
          <View className={`${variant === 'mission' ? 'mb-[19px]' : 'mb-4'}`}>
            <Image source={badge.icon} style={{ width: 124, height: 124 }} resizeMode="contain" />
          </View>
          {variant === 'mission' ? (
            <Pressable
              onPress={() => router.push('/mybadges')}
              className="bg-[#57C9D0] w-full items-center rounded-xl px-[59px] py-[15px]"
            >
              <Text className="text-base font-semibold text-white">뱃지 더보기</Text>
            </Pressable>
          ) : (
            <>
              <View className="flex-row">
                <Text className="text-base font-semibold">달성도</Text>
                <Text className="text-base text-[#B4B7BC]">
                  <Text className="font-semibold text-[#57C9D0]">{badge.current}</Text> /{' '}
                  {badge.target}
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                className="bg-[#57C9D0] w-full items-center rounded-xl px-[59px] py-[15px]"
              >
                <Text className="text-base font-semibold text-white">닫기</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}
