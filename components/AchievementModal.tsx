import { router } from 'expo-router'
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
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
      <Pressable onPress={onClose} style={styles.backdrop} />

      {/* 중앙 카드 */}
      <View style={styles.centerWrap}>
        <View style={styles.card}>
          {/* 타이틀 및 설명 */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>

          {/* 아이콘 */}
          <View style={styles.iconWrap}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonsRow}>
            <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>닫기</Text>
            </Pressable>

            <Pressable onPress={onPrimary} style={[styles.btn, styles.btnPrimary, styles.btnRight]}>
              <Text style={styles.btnPrimaryText}>{primaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'pretendard',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  desc: {
    fontFamily: 'pretendard',
    fontSize: 16,
    color: '#686F79',
    textAlign: 'center',
    maxWidth: 164,
    marginBottom: 12,
  },
  iconWrap: {
    marginBottom: 16,
  },
  icon: {
    width: 124,
    height: 124,
  },
  buttonsRow: {
    width: '100%',
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRight: {
    marginLeft: 12,
  },
  btnGhost: {
    backgroundColor: '#E6E7E9',
  },
  btnGhostText: {
    fontFamily: 'pretendard',
    fontSize: 16,
    color: '#686F79',
  },
  btnPrimary: {
    backgroundColor: '#57C9D0',
  },
  btnPrimaryText: {
    fontFamily: 'pretendard',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
