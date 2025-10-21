import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { heightPercentageToDP as wp } from 'react-native-responsive-screen'

type Props = {
  activeDropdown: string | null
  setActiveDropdown: Dispatch<SetStateAction<string | null>>
  styles: any
}

export default function TimeDropdown({ activeDropdown, setActiveDropdown, styles }: Props) {
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전')
  const [hour, setHour] = useState('9')
  const [minute, setMinute] = useState('10')

  // 임시 선택값 (확인 버튼 누르기 전까지 실제값 반영 X)
  const [tempAmpm, setTempAmpm] = useState<'오전' | '오후'>(ampm)
  const [tempHour, setTempHour] = useState(hour)
  const [tempMinute, setTempMinute] = useState(minute)

  const ampmOptions: ('오전' | '오후')[] = ['오전', '오후']
  const hourOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), [])
  const minuteOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')),
    []
  )

  // 하나라도 클릭 시 전체 열기
  const handleToggle = () => {
    setActiveDropdown((prev) => (prev ? null : 'all'))
    setTempAmpm(ampm)
    setTempHour(hour)
    setTempMinute(minute)
  }

  // 확인 버튼 클릭 시 값 반영
  const handleConfirm = () => {
    setAmpm(tempAmpm)
    setHour(tempHour)
    setMinute(tempMinute)
    setActiveDropdown(null)
  }

  const isOpen = activeDropdown === 'all'

  return (
    <View style={styles.timeContainer}>
      {/* 기본 선택 영역 */}
      <Pressable onPress={handleToggle} style={styles.timeBox}>
        <View style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>{ampm}</Text>
        </View>

        <View style={styles.timeUnit}>
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownText}>{hour}</Text>
          </View>
          <Text style={styles.unitLabel}>시</Text>
        </View>

        <View style={styles.timeUnit}>
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownText}>{minute}</Text>
          </View>
          <Text style={styles.unitLabel}>분</Text>
        </View>
      </Pressable>

      {/* 클릭 시 전체 드롭다운 오픈 */}
      {isOpen && (
        <View style={styles.timeList}>
          <View style={styles.timeLists}>
            {/* 오전/오후 리스트 */}
            <View style={styles.dropdownList}>
              {ampmOptions.map((opt) => (
                <Pressable key={opt} onPress={() => setTempAmpm(opt)}>
                  <Text
                    style={[styles.dropdownItem, { fontWeight: tempAmpm === opt ? '700' : '400' }]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 시 리스트 */}
            <ScrollView style={[styles.dropdownList, { marginRight: wp('4%') }]}>
              {hourOptions.map((opt) => (
                <Pressable key={opt} onPress={() => setTempHour(opt)}>
                  <Text
                    style={[styles.dropdownItem, { fontWeight: tempHour === opt ? '700' : '400' }]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* 분 리스트 */}
            <ScrollView style={styles.dropdownList}>
              {minuteOptions.map((opt) => (
                <Pressable key={opt} onPress={() => setTempMinute(opt)}>
                  <Text
                    style={[
                      styles.dropdownItem,
                      { fontWeight: tempMinute === opt ? '700' : '400' },
                    ]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* 확인 버튼 */}
          <Pressable onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmText}>확인</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
