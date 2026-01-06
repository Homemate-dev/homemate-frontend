import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  visible: boolean
  userName?: string
  onClose: () => void
  onConfirm: () => void
}

export default function WithdrawConfirmModal({ visible, userName, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Image
            source={require('../../assets//images/withdraw/withdrawImg.png')}
            style={styles.cardImg}
          />

          <View style={styles.textArea}>
            <Text style={styles.title}>회원 탈퇴를 진행하시겠어요?</Text>

            <Text style={styles.desc}>탈퇴하면 집안일 완료, 뱃지 획득 등</Text>

            <Text style={styles.desc}>
              {userName}님의 모든 활동 정보가 삭제되어 복구할 수 없어요
            </Text>
          </View>

          <View style={styles.btnArea}>
            <Pressable style={[styles.btn, styles.btnGray]} onPress={onClose}>
              <Text style={[styles.btnText, styles.btnTextGray]}>계속 이용하기</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onConfirm}>
              <Text style={[styles.btnText, styles.btnTextWhite]}>회원 탈퇴</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },

  cardImg: {
    width: 133,
    height: 118,

    marginBottom: 18,
  },

  textArea: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 18,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },

  desc: {
    fontSize: 12,
    lineHeight: 20,
  },

  btnArea: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    borderRadius: 12,

    width: 145,
    height: 52,

    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    fontSize: 14,
  },

  btnGray: {
    backgroundColor: '#E6E7E9',
  },

  btnTextGray: {
    color: '#686F79',
  },

  btnPrimary: {
    backgroundColor: '#57C9D0',
  },

  btnTextWhite: {
    color: '#fff',
  },
})
