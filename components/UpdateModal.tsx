// UpdateModal.tsx
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  onUpdateOnly: () => void
  onUpdateAll: () => void
  loading?: boolean
}

export default function UpdateModal({
  visible,
  onClose,
  onUpdateOnly,
  onUpdateAll,
  loading = false,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose} // 안드로이드 백버튼
    >
      <View style={styles.container} pointerEvents="box-none">
        {/* 어두운 배경 (바깥 탭 닫기) */}
        <TouchableWithoutFeedback onPress={!loading ? onClose : undefined}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* 시트 */}
        <View style={styles.sheet}>
          <Text style={styles.sheetHandle} />

          <View style={styles.gap}>
            <View style={styles.gap}>
              <View style={styles.mb8}>
                <Text
                  onPress={!loading ? onUpdateOnly : undefined}
                  style={styles.primaryBtnTextWrap}
                >
                  <Text style={styles.primaryBtnText}>이 일정만 수정</Text>
                </Text>
              </View>

              <Text onPress={!loading ? onUpdateAll : undefined} style={styles.primaryBtnTextWrap}>
                <Text style={styles.primaryBtnText}>전체 반복 일정 수정</Text>
              </Text>
            </View>
          </View>

          <View style={styles.mt12}>
            <Text onPress={!loading ? onClose : undefined} style={styles.cancelBtnText}>
              취소
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    // ⬇️ 터치와 레이어 우선순위 보장
    zIndex: 1000,
    elevation: 20,

    // 그림자(ios)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E7E9',
    marginBottom: 12,
  },
  gap: { gap: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },
  desc: { fontSize: 13, color: '#6B6F76' },
  label: { fontSize: 12, color: '#9B9FA6' },

  primaryBtnTextWrap: {
    width: '100%',
    backgroundColor: '#DDF4F6',
    borderRadius: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#46A1A6', fontWeight: '600', fontSize: 16 },

  mt12: { marginTop: 12 },
  mb8: { marginBottom: 8 },

  cancelBtnText: {
    width: '100%',
    backgroundColor: '#040F200D',
    borderRadius: 12,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#9B9FA6',
    fontWeight: '600',
    fontSize: 16,
  },
})
