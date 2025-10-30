import { type Dispatch, type SetStateAction, useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

type DropdownId = 'ampm' | 'hour' | 'minute'

type Props = {
  ampm: '오전' | '오후'
  hour: number
  minute: number
  onChange: (v: { ampm: '오전' | '오후'; hour: number; minute: number }) => void
  activeDropdown: string | null
  setActiveDropdown: Dispatch<SetStateAction<string | null>>
  styles?: any // 외부 스타일 전달 가능 (선택사항)
}

export default function TimeDropdown({
  ampm,
  hour,
  minute,
  onChange,
  activeDropdown,
  setActiveDropdown,
}: Props) {
  const toggleDropdown = (id: DropdownId) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const ampmOptions: ('오전' | '오후')[] = ['오전', '오후']
  const hourOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])
  const minuteOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')),
    []
  )

  return (
    <View style={styles.container}>
      {/* 오전/오후 선택 */}
      <View style={[styles.boxWrapper, styles.mr14]}>
        <Pressable onPress={() => toggleDropdown('ampm')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>{ampm}</Text>
          </View>
        </Pressable>
        {activeDropdown === 'ampm' && (
          <View style={[styles.dropdownPanel, styles.w75]}>
            {ampmOptions.map((opt) => {
              const selected = opt === ampm
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange({ ampm: opt, hour, minute })
                    setActiveDropdown(null)
                  }}
                  style={[styles.optionRow, selected && styles.optionSelected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      {/* 시 선택 */}
      <View style={[styles.inlineRow, styles.mr5]}>
        <Pressable onPress={() => toggleDropdown('hour')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>{hour}</Text>
          </View>
        </Pressable>
        {activeDropdown === 'hour' && (
          <ScrollView style={[styles.dropdownScroll, styles.w75, styles.h152]}>
            {hourOptions.map((opt) => {
              const selected = opt === hour
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange({ ampm, hour: opt, minute })
                    setActiveDropdown(null)
                  }}
                  style={[styles.optionRow, selected && styles.optionSelected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              )
            })}
          </ScrollView>
        )}
        <Text style={[styles.unitText, styles.ml5]}>시</Text>
      </View>

      {/* 분 선택 */}
      <View style={styles.inlineRow}>
        <Pressable onPress={() => toggleDropdown('minute')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>{String(minute).padStart(2, '0')}</Text>
          </View>
        </Pressable>
        {activeDropdown === 'minute' && (
          <ScrollView style={[styles.dropdownScroll, styles.w75, styles.h152]}>
            {minuteOptions.map((opt) => {
              const selected = opt === String(minute)
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange({ ampm, hour, minute: Number(opt) })
                    setActiveDropdown(null)
                  }}
                  style={[styles.optionRow, selected && styles.optionSelected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              )
            })}
          </ScrollView>
        )}
        <Text style={[styles.unitText, styles.ml5]}>분</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },
  boxWrapper: { position: 'relative' },

  box: {
    backgroundColor: '#EBF9F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: 75,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: { color: '#46A1A6', fontSize: 16 },

  dropdownPanel: {
    position: 'absolute',
    left: 0,
    top: 45,
    zIndex: 50,
    borderWidth: 1,
    borderColor: '#57C9D0',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 4,
  },
  dropdownScroll: {
    position: 'absolute',
    left: 0,
    top: 45,
    zIndex: 50,
    borderWidth: 1,
    borderColor: '#57C9D0',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },

  optionRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  optionSelected: { backgroundColor: '#EBF9F9' },
  optionText: { color: '#46A1A6', fontSize: 16 },

  unitText: { fontSize: 16 },
  ml5: { marginLeft: 5 },
  mr5: { marginRight: 5 },
  mr14: { marginRight: 14 },
  w75: { width: 75 },
  h152: { height: 152 },
})
