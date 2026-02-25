import { Pressable, StyleSheet, View } from 'react-native'

export default function GuideNavigation({
  goPrev,
  goNext,
}: {
  goPrev: () => void
  goNext: () => void
}) {
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
      <View style={styles.navOverlay}>
        <Pressable style={[styles.navLeft, { outline: 'none' } as any]} onPress={goPrev} />
        <Pressable style={[styles.navRight, { outline: 'none' } as any]} onPress={goNext} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  navLeft: {
    flex: 1,
  },
  navRight: {
    flex: 1,
  },
})
