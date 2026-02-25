declare module '@env' {
  export const KAKAO_REST_API_KEY: string;
  export const KAKAO_REDIRECT_URI: string;
}

declare module '*.mp4' {
  const src: number;
  export default src;
}
