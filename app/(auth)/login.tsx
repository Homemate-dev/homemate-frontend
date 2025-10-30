import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import { setAccessToken } from '@/libs/api/axios'

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const KAKAO_REST_API_KEY = '767c656f116d3d699c2b979f9c77f0a6'
  const KAKAO_REDIRECT_URI = 'http://localhost:3000'
  const codeVerifier = 'buxcAKiNFcQ8Kslcm5NrKq6pm8JgFULeujc2usyw0g4'
  const codeChallenge = 'jrHilj7qFqhxKHKKM8AoQsqociZfnv-QJQjXrSyT0jU'

  const fetchKakaoToken = async (code: string | string[]) => {
    const codeString = Array.isArray(code) ? code[0] : code

    try {
      const response = await fetch(`https://homemate.io.kr/api/auth/login/kakao`, {
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
        console.log('Received Access Token:', data.accessToken)
        setAccessToken(data.accessToken)

        router.replace('./index')
      }
    } catch (err) {
      console.error('로그인 중 오류 발생:', err)
    }
  }

  const handleKakaoLogin = async () => {
    console.log('Initiating Kakao login...')
    setLoading(true)
    try {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`

      if (Platform.OS === 'web') {
        console.log('Web platform detected. Redirecting...')
        window.location.href = kakaoAuthUrl
        return
      }

      const result = await WebBrowser.openAuthSessionAsync(kakaoAuthUrl, KAKAO_REDIRECT_URI)
      console.log('WebBrowser result:', result)

      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url)
        const code = parsed.queryParams?.code
        if (code) {
          console.log('Authorization code:', code)
          await fetchKakaoToken(code)
        }
      } else {
        console.warn('로그인 취소 또는 실패:', result.type)
      }
    } catch (error) {
      console.error('Kakao 로그인 중 오류 발생:', error)
      alert('카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontFamily: 'PoetsenOne_400Regular' }]}>HOMEMATE</Text>
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
    paddingHorizontal: wp('8%'),
    height: '100vh',
  },
  logo: { fontSize: hp('4%'), color: '#fff', fontWeight: '700', marginBottom: hp('2%') },
  subtitle: { fontSize: hp('2%'), color: '#fff', marginBottom: hp('4%') },
  image: { width: wp('65%'), height: hp('40%'), marginBottom: hp('6%') },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#79D4D9',
    borderRadius: 100,
    paddingVertical: hp('1.8%'),
    width: wp('90%'),
    justifyContent: 'center',
  },
  kakaoIcon: { width: 24, height: 24, marginRight: 8 },
  kakaoText: { fontSize: hp('2%'), color: '#FFFFFF', fontWeight: '600' },
  loadingIndicator: {
    marginTop: hp('2%'),
  },
  footerText: {
    marginTop: hp('3%'),
    fontSize: hp('1.4%'),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
  link: { textDecorationLine: 'underline', color: '#fff' },
})
