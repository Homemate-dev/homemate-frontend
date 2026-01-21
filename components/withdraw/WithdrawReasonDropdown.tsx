import { MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { WithdrawReasonConfig } from '@/constants/withdrawReasons'

type Props = {
  reasons: WithdrawReasonConfig[]
  selected: WithdrawReasonConfig | null
  onSelect: (reason: WithdrawReasonConfig) => void
  placeholder?: string
  onOpenChange?: (open: boolean) => void
}

export default function WithdrawReasonDropdown({
  reasons,
  selected,
  onSelect,
  placeholder = '탈퇴 사유를 선택해주세요',
  onOpenChange,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownArea}
        activeOpacity={0.9}
        onPress={() =>
          setOpen((prev) => {
            const next = !prev
            onOpenChange?.(next)
            return next
          })
        }
      >
        <Text style={styles.dropdownText}>{selected ? selected.title : placeholder}</Text>
        <MaterialIcons
          name="chevron-left"
          size={28}
          color="#46A1A6"
          style={{ transform: [{ rotate: open ? '90deg' : '-90deg' }] }}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownList}>
            {reasons.map((r, idx) => {
              const isLast = idx === reasons.length - 1

              return (
                <TouchableOpacity
                  key={r.key}
                  activeOpacity={0.9}
                  style={[styles.dropdownItem, !isLast && styles.divider]}
                  onPress={() => {
                    onSelect(r)
                    setOpen(false)
                    onOpenChange?.(false)
                  }}
                >
                  <Text style={styles.dropdownItemText}>{r.title}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 50,
  },

  dropdownArea: {
    width: '100%',
    backgroundColor: '#DDF4F6',
    borderRadius: 12,

    paddingVertical: 14,
    paddingHorizontal: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#46A1A6',
    fontWeight: 600,
  },

  btnArea: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 16,

    gap: 9,
  },

  dropdownOverlay: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,

    zIndex: 9999,
    elevation: 20,
  },

  dropdownList: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  dropdownItem: {
    height: 52,
    justifyContent: 'center',
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E7E9',
  },

  dropdownItemText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1D2736',
    fontWeight: 400,
  },
})
