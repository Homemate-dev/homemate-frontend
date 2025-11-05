import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!
  const KAKAO_WEB_REDIRECT_URI = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI!
  const KAKAO_NATIVE_REDIRECT_URI = 'homematefrontend://'
  const KAKAO_REDIRECT_URI =
    Platform.OS === 'web' ? KAKAO_WEB_REDIRECT_URI : KAKAO_NATIVE_REDIRECT_URI

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!

  const codeVerifier = 'buxcAKiNFcQ8Kslcm5NrKq6pm8JgFULeujc2usyw0g4'
  const codeChallenge = 'jrHilj7qFqhxKHKKM8AoQsqociZfnv-QJQjXrSyT0jU'

  useEffect(() => {
    if (Platform.OS === 'web') {
      const parsed = Linking.parse(window.location.href)
      const raw = parsed.queryParams?.code
      const code = Array.isArray(raw) ? raw[0] : raw
      if (code) fetchKakaoToken(code)
    }
  }, [])

  const fetchKakaoToken = async (code: string | string[]) => {
    const codeString = Array.isArray(code) ? code[0] : code

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/login/kakao`, {
        // CHANGED
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorizationCode: codeString,
          redirectUri: KAKAO_REDIRECT_URI,
          codeVerifier: codeVerifier,
        }),
      })

      const data = await response.json()

      if (data.accessToken) {
        await login(data.accessToken, data.user)
        router.replace('/home')
      } else {
        alert('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (err) {
      console.error('로그인 오류:', err)
      alert('카카오 로그인 중 문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    setLoading(true)
    try {
      const kakaoAuthUrl =
        `https://kauth.kakao.com/oauth/authorize` +
        `?client_id=${KAKAO_REST_API_KEY}` +
        `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
        `&response_type=code` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`

      if (Platform.OS === 'web') {
        window.location.href = kakaoAuthUrl
        return
      }

      const result = await WebBrowser.openAuthSessionAsync(kakaoAuthUrl, KAKAO_REDIRECT_URI)
      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url)
        const raw = parsed.queryParams?.code
        const code = Array.isArray(raw) ? raw[0] : raw
        if (code) await fetchKakaoToken(code)
      }
    } catch (error) {
      console.error('Kakao 로그인 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo/logo-white.png')}
        style={{ width: 208, height: 40, marginBottom: 24 }}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>주기적인 청소생활 시작</Text>

      <Image
        source={require('../../assets/images/start/mop.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin} disabled={loading}>
        <Image source={require('../../assets/images/icon/kakao.png')} style={styles.kakaoIcon} />
        <Text style={styles.kakaoText}>카카오톡으로 로그인</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#57C9D0" style={styles.loadingIndicator} />
      )}

      <Text style={styles.footerText}>
        서비스 시작은 <Text style={styles.link}>서비스 이용약관{'\n'}</Text>
        <Text style={styles.link}>개인정보 처리방침</Text> 동의를 의미합니다
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#57C9D0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
  },

  subtitle: { fontFamily: 'SeoulNamsanEB', fontSize: 20, color: '#fff', marginBottom: 48 },
  image: { width: 200, height: 300, marginBottom: 48 },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#79D4D9',
    borderRadius: 100,
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 44,
  },
  kakaoIcon: { width: 32, height: 32, marginRight: 8 },
  kakaoText: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingIndicator: { marginTop: hp('2%') },
  footerText: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  link: { textDecorationLine: 'underline', color: '#fff' },
})
