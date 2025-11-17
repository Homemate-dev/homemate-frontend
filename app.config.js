import 'dotenv/config'

export default ({ config }) => ({
  ...config,

  // 알림 설정
  notification: {
    vapidPublicKey:
      'BLa4XgiuPsT4-9NPqs8xbdlYnUuRP_p2K9NqHTc0ofaxEBhfw5icOclS-vOso2v9aZR8RNkR9gs2GdUryxzx3eo',
  },

  // 플러그인
  plugins: ['expo-router', 'expo-notifications'],

  // extra 유지
  extra: {
    ...config.extra,
    KAKAO_REST_API_KEY: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
    KAKAO_REDIRECT_URI: process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI,
    KAKAO_CODE_VERIFIER: process.env.EXPO_PUBLIC_KAKAO_CODE_VERIFIER,
  },
})
