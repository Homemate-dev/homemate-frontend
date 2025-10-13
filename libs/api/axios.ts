import axios, { AxiosRequestHeaders } from 'axios'

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL, // 모든 요청의 기본 주소
  timeout: 10000, // 10초 타임아웃
})

// ─────────────────────────────────────────────────────────────
// Axios 인터셉터 기반 인증 처리 로직
// 1) accessToken을 모든 요청 헤더(Authorization)에 자동 첨부
// 2) 401(Unauthorized) 발생 시 전역 콜백(onUnauthorized) 실행
//    → 로그인 만료, 토큰 재발급, 로그인 페이지 이동 등 공통 처리 가능
// ─────────────────────────────────────────────────────────────

let accessToken: string | null = null // 로그인 성공 후 받은 토큰을 임시로 보관(모든 요청에 자동 첨부하기 위함)
let onUnauthorized: (() => void) | null = null // 401(인증 만료) 발생 시 실행할 콜백 함수(예: 로그인 화면으로 이동)

/** 로그인 성공/앱 시작 시 토큰 주입 */
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

/** 401 발생 시 실행할 전역 콜백 등록 */
export const setOnUnauthorized = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

// Authorization 자동 첨부
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {}
    const headers = config.headers as AxiosRequestHeaders

    headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// Response Interceptor: 401 발생 시 공통 처리 (토큰 무효화 + 전역 콜백)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // 토큰 무효화
      accessToken = null
      // 전역 콜백 실행 (예: 로그인 화면 이동)
      onUnauthorized?.()
    }
    return Promise.reject(error)
  }
)
