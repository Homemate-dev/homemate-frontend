// src/components/TabSafeScroll.tsx
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { PropsWithChildren } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = PropsWithChildren<{ contentContainerStyle?: ViewStyle }>

/**
 * TabSafeScroll
 * - 스크롤뷰 콘텐츠가 탭바에 가리지 않게 자동으로 하단 여백(paddingBottom)을 추가
 * - 모든 탭 화면에서 이 랩퍼로 감싸주면 안전함
 */
export default function TabSafeScroll({ children, contentContainerStyle }: Props) {
  const tabBarHeight = useBottomTabBarHeight()
  const { bottom } = useSafeAreaInsets()

  return (
    <ScrollView
      className="flex-1 bg-[#F8F8FA] px-5"
      contentContainerStyle={{
        paddingBottom: tabBarHeight + bottom + 12, // 탭바 높이 + 안전영역 + 여유 여백
        ...contentContainerStyle,
      }}
      keyboardShouldPersistTaps="handled" // 키보드 열려도 클릭 가능하게
    >
      {children}
    </ScrollView>
  )
}
