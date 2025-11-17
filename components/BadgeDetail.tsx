import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { ResponseBadge } from '@/types/badge'

type Props = {
  badge: ResponseBadge
  onClose: () => void
}

export default function BadgeDetail({ badge, onClose }: Props) {
  if (!badge) return null

  return (
    <Modal
      visible
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      statusBarTranslucent // Android에서 상태바 위까지 모달 렌더
      hardwareAccelerated
    >
      {/* 반투명 백드롭 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 중앙 카드 */}
      <View style={styles.centerWrapper} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={styles.title}>{badge.acquired === true ? badge.badgeTitle : '???'}</Text>
          <Text style={styles.desc}>{badge.description}</Text>
          <View style={styles.ImageWrap}>
            <Image source={badge.badgeImageUrl} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>달성도</Text>
            <Text style={styles.progressText}>
              <Text style={styles.progressValue}>
                {badge.currentCount > badge.requiredCount
                  ? badge.requiredCount
                  : badge.currentCount}
                회
              </Text>{' '}
              / {badge.requiredCount}회
            </Text>
          </View>

          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>닫기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  centerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#686F79',
    textAlign: 'center',
    maxWidth: 164,
    marginBottom: 12,
  },
  ImageWrap: { marginBottom: 16 },
  image: { width: 124, height: 124 },
  button: {
    backgroundColor: '#57C9D0',
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#B4B7BC',
  },
  progressValue: {
    fontWeight: '600',
    color: '#57C9D0',
  },
})
