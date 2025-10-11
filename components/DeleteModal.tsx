import { Modal, Pressable, Text, View } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function DeleteModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="absolute inset-0 bg-transparent justify-end" />
      <View
        className="bg-white absolute left-0 right-0 bottom-0 px-5 py-[30px] rounded-t-3xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Pressable className="w-full bg-[#DDF4F6] rounded-xl items-center py-3 h-12 mb-2">
          <Text className="text-[#46A1A6] font-semibold text-base">이 일정만 삭제</Text>
        </Pressable>
        <Pressable className="w-full bg-[#DDF4F6] rounded-xl items-center py-3 h-12 mb-2">
          <Text className="text-[#46A1A6] font-semibold text-base">전체 반복 일정 삭제</Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          className="w-full bg-[#040F200D] rounded-xl items-center py-3 h-12"
        >
          <Text className="text-[#9B9FA6] font-semibold text-base">취소</Text>
        </Pressable>
      </View>
    </Modal>
  )
}
