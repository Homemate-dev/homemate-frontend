// UpdateModal.tsx
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

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
        <Pressable
          onPress={!loading ? onClose : undefined} // 로딩 중엔 바깥 탭 닫기 막기
          style={styles.backdrop}
        />

        {/* 시트 */}
        <View style={styles.sheet}>
          <Text style={styles.sheetHandle} />

          <View style={styles.gap}>
            <View style={styles.gap}>
              <View style={styles.mb8}>
                <Pressable
                  onPress={!loading ? onUpdateOnly : undefined}
                  style={styles.primaryBtnTextWrap}
                >
                  <Text style={styles.primaryBtnText}>이 일정만 수정</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={!loading ? onUpdateAll : undefined}
                style={styles.primaryBtnTextWrap}
              >
                <Text style={styles.primaryBtnText}>향후 일정 수정</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.mt12}>
            <Text onPress={!loading ? onClose : undefined} style={styles.cancelBtnText}>
              취소
            </Text>
          </Pressable>
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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheet: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    // 터치와 레이어 우선순위 보장
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
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E7E9',
    marginBottom: 12,
  },
  gap: { gap: 8 },

  primaryBtnTextWrap: {
    width: '100%',
    height: 52,
    backgroundColor: '#DDF4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { fontFamily: 'pretendard', color: '#46A1A6', fontWeight: '600', fontSize: 16 },

  mt12: { marginTop: 12 },
  mb8: { marginBottom: 8 },

  cancelBtnText: {
    width: '100%',
    height: 52,
    backgroundColor: '#040F200D',
    borderRadius: 12,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#9B9FA6',
    fontFamily: 'pretendard',
    fontWeight: '600',
    fontSize: 16,
  },
})
