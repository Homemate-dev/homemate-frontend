import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { RepeatType } from '@/types/chore'

type Props = {
  visible: boolean
  onClose: () => void
  onDeleteOnly: () => void
  onDeleteAll: () => void
  loading?: boolean
  repeatType?: RepeatType
}

export default function DeleteModal({
  visible,
  onClose,
  onDeleteOnly,
  onDeleteAll,
  loading = false,
  repeatType = 'NONE',
}: Props) {
  const noneRepeat = repeatType === 'NONE'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={!loading ? onClose : undefined} // 로딩 중엔 바깥 탭 닫기 막기
        style={styles.backdrop}
      />
      <View style={styles.sheet}>
        <Text style={styles.sheetHandle} />
        {noneRepeat ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>일정을 삭제하시겠습니까?</Text>
          </View>
        ) : (
          <Pressable
            disabled={loading}
            onPress={onDeleteOnly}
            style={[styles.primaryBtn, styles.mb8]}
          >
            <Text style={styles.primaryBtnText}>이 일정만 삭제</Text>
          </Pressable>
        )}

        {noneRepeat ? (
          <Pressable
            disabled={loading}
            onPress={onDeleteOnly}
            style={[styles.primaryBtn, styles.mb8]}
          >
            <Text style={styles.primaryBtnText}>일정 삭제</Text>
          </Pressable>
        ) : (
          <Pressable
            disabled={loading}
            onPress={onDeleteAll}
            style={[styles.primaryBtn, styles.mb8]}
          >
            <Text style={styles.primaryBtnText}>전체 반복 일정 삭제</Text>
          </Pressable>
        )}

        <Pressable
          disabled={loading}
          onPress={!loading ? onClose : undefined}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelBtnText}>취소</Text>
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E7E9',
    marginBottom: 12,
  },

  // banner for NONE
  banner: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    height: 48,
    marginBottom: 8,
    borderRadius: 0,
  },
  bannerText: {
    color: '#686F79',
    fontSize: 14,
  },

  // primary buttons
  primaryBtn: {
    width: '100%',
    backgroundColor: '#DDF4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    height: 48,
  },
  primaryBtnText: {
    color: '#46A1A6',
    fontWeight: '600',
    fontSize: 16,
  },
  mb8: { marginBottom: 8 },

  // cancel button
  cancelBtn: {
    width: '100%',
    backgroundColor: '#040F200D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    height: 48,
  },
  cancelBtnText: {
    color: '#9B9FA6',
    fontWeight: '600',
    fontSize: 16,
  },
})
