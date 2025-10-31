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
  styles?: any
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
    <View style={s.container}>
      {/* 오전/오후 */}
      <View style={[s.inlineRow, s.mr14]}>
        <Pressable onPress={() => toggleDropdown('ampm')}>
          <View style={s.box}>
            <Text style={s.boxText}>{ampm}</Text>
          </View>
        </Pressable>
        {activeDropdown === 'ampm' && (
          <View style={[s.dropdownPanel, s.w75]}>
            {ampmOptions.map((opt) => {
              const selected = opt === ampm
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange({ ampm: opt, hour, minute })
                    setActiveDropdown(null)
                  }}
                  style={[s.optionRow, selected && s.optionSelected]}
                >
                  <Text style={s.optionText}>{opt}</Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      {/* 시 */}
      <View style={[s.inlineRow, s.mr5]}>
        <Pressable onPress={() => toggleDropdown('hour')}>
          <View style={s.box}>
            <Text style={s.boxText}>{hour}</Text>
          </View>
        </Pressable>
        {activeDropdown === 'hour' && (
          <View style={[s.dropdownPanel, s.w75]}>
            <ScrollView style={s.h152} contentContainerStyle={s.dropdownContent}>
              {hourOptions.map((opt) => {
                const selected = opt === hour
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      onChange({ ampm, hour: opt, minute })
                      setActiveDropdown(null)
                    }}
                    style={[s.optionRow, selected && s.optionSelected]}
                  >
                    <Text style={s.optionText}>{opt}</Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        )}
        <Text style={[s.unitText, s.ml5]}>시</Text>
      </View>

      {/* 분 */}
      <View style={s.inlineRow}>
        <Pressable onPress={() => toggleDropdown('minute')}>
          <View style={s.box}>
            <Text style={s.boxText}>{String(minute).padStart(2, '0')}</Text>
          </View>
        </Pressable>
        {activeDropdown === 'minute' && (
          <View style={[s.dropdownPanel, s.w75]}>
            <ScrollView style={s.h152} contentContainerStyle={s.dropdownContent}>
              {minuteOptions.map((opt) => {
                const selected = Number(opt) === minute
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      onChange({ ampm, hour, minute: Number(opt) })
                      setActiveDropdown(null)
                    }}
                    style={[s.optionRow, selected && s.optionSelected]}
                  >
                    <Text style={s.optionText}>{opt}</Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        )}
        <Text style={[s.unitText, s.ml5]}>분</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 999, // 드롭다운 섹션 자체 우선순위
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    overflow: 'visible', // 부모에서 잘리지 않도록
  },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },

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
  boxText: { color: '#46A1A6', fontSize: 14 },

  dropdownPanel: {
    position: 'absolute',
    left: 0,
    top: 45,
    zIndex: 1000, // 패널은 더 위
    borderWidth: 1,
    borderColor: '#57C9D0',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 6,
    elevation: 24, // Android 겹침
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'visible',
  },

  h152: { height: 152 },
  dropdownContent: { paddingVertical: 0 },

  optionRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 4,
  },
  optionSelected: { backgroundColor: '#EBF9F9' },
  optionText: { color: '#46A1A6', fontSize: 14 },

  unitText: { fontSize: 14 },
  ml5: { marginLeft: 5 },
  mr5: { marginRight: 5 },
  mr14: { marginRight: 14 },
  w75: { width: 75 },
})
