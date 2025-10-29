import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

type DropdownProps = {
  id: string
  options: string[]
  value: string | null
  onChange: (v: string) => void
  placeholder?: string
  activeDropdown: string | null
  setActiveDropdown: (v: string | null) => void
}

export default function ChoreDropdown({
  id,
  options,
  value,
  onChange,
  placeholder,
  activeDropdown,
  setActiveDropdown,
}: DropdownProps) {
  const isOpen = activeDropdown === id

  const toggle = () => setActiveDropdown(isOpen ? null : id)
  const close = () => setActiveDropdown(null)

  return (
    <View style={[styles.container, isOpen && styles.z50]}>
      <Pressable onPress={toggle} style={styles.pressable}>
        <Text style={styles.label}>
          {value != null && value !== '' ? value : (placeholder ?? '선택')}
        </Text>
        <Image
          source={require('../../assets/images/arrow/dropdown.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt, i) => (
              <Pressable
                key={opt}
                onPress={() => {
                  onChange(opt)
                  close()
                }}
              >
                <Text style={styles.option}>{opt}</Text>
                {i < options.length - 1 && <View style={styles.divider} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  z50: {
    zIndex: 50,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#686F79',
    fontSize: 16,
  },
  icon: {
    width: 12,
    height: 22,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 24,
    zIndex: 50,
    width: 160,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    // iOS 그림자
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    // Android 그림자
    elevation: 6,
  },
  option: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E7E9',
    marginTop: 8,
    marginBottom: 8,
  },
})
