export default ({ config }) => ({
  ...config,
  extra: {
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
    KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
  },
});
