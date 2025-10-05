import { Image, Pressable } from 'react-native'

const CHECKED = require('../assets/images/checkbox/checkbox-checked.png')
const EMPTY = require('../assets/images/checkbox/checkbox-empty.png')

type CheckboxProps = {
  checked: boolean
  onChange?: (next: boolean) => void
  disabled?: boolean
  size?: number
}

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  size = 22,
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange?.(!checked)}
      style={{ width: size, height: size }}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <Image
        source={checked ? CHECKED : EMPTY}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Pressable>
  )
}
