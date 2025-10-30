import 'dotenv/config'

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    KAKAO_REST_API_KEY: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
    KAKAO_REDIRECT_URI: process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI,
    KAKAO_CODE_VERIFIER: process.env.EXPO_PUBLIC_KAKAO_CODE_VERIFIER,
  },
})
