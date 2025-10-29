import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Image, ImageSourcePropType, Modal, Pressable, StyleSheet, Text, View } from 'react-native'

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
      statusBarTranslucent // Android에서 상태바 위까지 모달 렌더
      hardwareAccelerated
    >
      {/* 반투명 백드롭 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 중앙 카드 */}
      <View style={styles.centerWrapper}>
        <View style={styles.card}>
          {variant === 'mission' && (
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} />
            </Pressable>
          )}
          <Text style={styles.title}>{badge.title}</Text>
          <Text style={styles.desc}>{badge.desc}</Text>
          <View style={variant === 'mission' ? styles.missionImageWrap : styles.mineImageWrap}>
            <Image source={badge.icon} style={styles.image} resizeMode="contain" />
          </View>
          {variant === 'mission' ? (
            <Pressable onPress={() => router.push('/mybadges')} style={styles.button}>
              <Text style={styles.buttonText}>뱃지 더보기</Text>
            </Pressable>
          ) : (
            <>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>달성도</Text>
                <Text style={styles.progressText}>
                  <Text style={styles.progressValue}>{badge.current}회</Text> / {badge.target}회
                </Text>
              </View>

              <Pressable onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>닫기</Text>
              </Pressable>
            </>
          )}
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
    fontSize: 16,
    color: '#686F79',
    textAlign: 'center',
    maxWidth: 164,
    marginBottom: 12,
  },
  missionImageWrap: { marginBottom: 19 },
  mineImageWrap: { marginBottom: 16 },
  image: { width: 124, height: 124 },
  button: {
    backgroundColor: '#57C9D0',
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#B4B7BC',
  },
  progressValue: {
    fontWeight: '600',
    color: '#57C9D0',
  },
})
