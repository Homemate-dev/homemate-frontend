import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import WithdrawReasonDropdown from '@/components/withdraw/WithdrawReasonDropdown'
import { WITHDRAW_REASONS, WithdrawReasonConfig } from '@/constants/withdrawReasons'
import { useMyPage } from '@/libs/hooks/mypage/useMyPage'

export default function WithdrawScreen() {
  const { data: user } = useMyPage()

  // 상태
  const [selected, setSelected] = useState<WithdrawReasonConfig | null>(null)
  const [reasonText, setReasonText] = useState('')

  // 변수
  const userName = user?.nickname ?? '사용자'
  const inputConfig = selected?.input
  const showInput = Boolean(inputConfig?.enabled)

  const isRequiredInput = Boolean(inputConfig?.enabled && inputConfig?.required)
  const hasRequiredText = reasonText.trim().length > 0

  const isIosSafariPwa = useMemo(() => {
    if (Platform.OS !== 'web') return false
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return false

    const ua = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/i.test(ua)

    // iOS Safari만 더 타이트하게
    const isSafari =
      /Safari/i.test(ua) &&
      /Version\//i.test(ua) &&
      !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua)

    // 홈 화면(PWA)로 실행 중인지
    const isStandalone =
      // iOS Safari 홈화면 실행 감지
      (navigator as any).standalone === true ||
      // 표준 display-mode
      window.matchMedia?.('(display-mode: standalone)')?.matches === true

    return isIOS && isSafari && isStandalone
  }, [])

  const ctx = useMemo(() => ({ isIosSafari: isIosSafariPwa }), [isIosSafariPwa])

  const canSubmit = useMemo(() => {
    if (!selected) return false
    if (!isRequiredInput) return true

    return hasRequiredText
  }, [selected, isRequiredInput, hasRequiredText])

  return (
    <>
      <StatusBar backgroundColor="#F8F8FA" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbView}
      >
        <View style={styles.wrapper}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 헤더 */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)/mypage')}
                style={styles.headerBack}
              >
                <MaterialIcons name="chevron-left" size={28} color="#686F79" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>회원 탈퇴</Text>
            </View>

            {/* 상단 설명 */}
            <Text style={styles.titleDesc}>홈메이트를 떠나시는 이유가 궁금해요</Text>
            <Text style={styles.desc}>
              홈메이트와 함께 해주셔서 감사했습니다.{'\n'}더 나은 모습으로 찾아뵐 수 있도록, {'\n'}
              홈메이트를 떠나는 이유를 알려주세요.{'\n'}
              {userName}님의 소중한 의견을 귀 기울여 듣겠습니다.
            </Text>

            {/* 드롭다운 */}

            <WithdrawReasonDropdown
              reasons={WITHDRAW_REASONS}
              selected={selected}
              onSelect={(next) => {
                setSelected(next)
                setReasonText('')
              }}
            />

            {/* 선택 후 안내 문구 */}
            {selected && (
              <View style={styles.guideBox}>
                {selected.blocks
                  .filter((b) => (b.visibleIf ? b.visibleIf(ctx) : true))
                  .map((b, idx) => {
                    if (b.type === 'text') {
                      return (
                        <Text key={`text-${idx}`} style={styles.guideText}>
                          {b.value(userName, ctx)}
                        </Text>
                      )
                    }

                    // chips
                    const items = b.items(ctx)
                    if (!items.length) return null

                    return (
                      <View key={`chips-${idx}`} style={styles.chipWrap}>
                        {items.map((l) => (
                          <TouchableOpacity
                            key={l.url}
                            activeOpacity={0.9}
                            style={styles.chip}
                            onPress={() => Linking.openURL(l.url)}
                          >
                            <Text style={styles.chipText}>{l.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )
                  })}

                {showInput && (
                  <View style={styles.inputArea}>
                    <TextInput
                      value={reasonText}
                      onChangeText={setReasonText}
                      placeholder={inputConfig!.placeholder}
                      placeholderTextColor="#9B9FA6"
                      style={[
                        styles.input,
                        Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                      ]}
                      maxLength={500}
                      multiline
                      underlineColorAndroid="transparent"
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.btnArea}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cancelBtn}
              onPress={() => router.replace('/(tabs)/mypage')}
              //   disabled={submitting}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.withdrawBtn, canSubmit && styles.withdrawBtnActive]}
            >
              <Text style={[styles.withdrawText, canSubmit && styles.withdrawTextActive]}>
                회원 탈퇴
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  kbView: { flex: 1, backgroundColor: '#F8F8FA' },
  wrapper: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 20,
  },

  scroll: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#F8F8FA',
  },
  scrollContent: {
    paddingBottom: 120, // 하단 버튼 영역 만큼 확보
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
    position: 'relative',
    height: 62,
  },
  headerBack: { position: 'absolute', left: 0 },
  headerTitle: { fontSize: 20, fontWeight: 600 as any, color: '#111111' },

  titleDesc: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 27,
    marginBottom: 16,
  },
  desc: {
    fontSize: 14,
    lineHeight: 21,
    color: '#686F79',
    marginBottom: 34,
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

  guideBox: {
    marginTop: 12,
    paddingHorizontal: 5,
  },
  guideText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    marginHorizontal: 4,
    marginBottom: 8,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    backgroundColor: '#EBEBEB',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,

    marginBottom: 8,
  },

  chipText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
  },

  inputArea: {
    marginTop: 6,
  },

  input: {
    backgroundColor: '#EBEBEB',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    minHeight: 120,

    fontSize: 14,
    lineHeight: 21,
    textAlignVertical: 'top',
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

  cancelBtn: {
    flex: 1,
    backgroundColor: '#E6E7E9',

    paddingVertical: 14,

    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 600,
    color: '#686F79',
  },

  withdrawBtn: {
    flex: 1,
    backgroundColor: '#CDCFD2',

    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 600,
    color: '#9B9FA6',
  },

  withdrawBtnActive: {
    backgroundColor: '#57C9D0',
  },
  withdrawTextActive: {
    color: '#FFFFFF',
  },
})
