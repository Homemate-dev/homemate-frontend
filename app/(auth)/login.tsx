import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [authCode, setAuthCode] = useState<string | null>(null)
  const extra = Constants?.expoConfig?.extra ?? {}
  const { login } = useAuth()

  const KAKAO_REST_API_KEY = extra.KAKAO_REST_API_KEY || '767c656f116d3d699c2b979f9c77f0a6'
  const KAKAO_REDIRECT_URI = 'http://localhost:3000'


  const fetchKakaoToken = async (code: string) => {
    try {
      const response = await fetch(`https://homemate.io.kr/api/auth/login/kakao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorizationCode: code,
          redirectUri: KAKAO_REDIRECT_URI,
          codeVerifier: 'buxcAKiFCQ8k1smcNKr6pm83qFUEul8cj2uswyqg4',
        }),
      })

      const data = await response.json()

      if (data.accessToken) {
        await login(data.accessToken)
      }
    } catch (err) {
      console.error('로그인 중 오류 발생:', err)
    }
  }

  const handleKakaoLogin = async () => {
    try {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

      if (Platform.OS === 'web') {
        window.location.href = kakaoAuthUrl
        return
      }

      const result = await WebBrowser.openAuthSessionAsync(kakaoAuthUrl, KAKAO_REDIRECT_URI)
      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url)
        const code = parsed.queryParams?.code
        if (code) fetchKakaoToken(code)
      } else {
        console.warn('로그인 취소 또는 실패:', result.type)
      }
    } catch (error) {
      console.error('Kakao 로그인 중 오류 발생:', error)
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

      <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin}>
        <Image source={require('../../assets/images/icon/kakao.png')} style={styles.kakaoIcon} />
        <Text style={styles.kakaoText}>카카오톡으로 로그인</Text>
      </TouchableOpacity>

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
  footerText: {
    marginTop: hp('3%'),
    fontSize: hp('1.4%'),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
  link: { textDecorationLine: 'underline', color: '#fff' },
})
