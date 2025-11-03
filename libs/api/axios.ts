import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

console.log('🌐 API Base URL:', BASE_URL)

/** ─────────────────────────────────────────────────────────────
 *  Axios 인스턴스
 *  ────────────────────────────────────────────────────────────*/
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

/** ─────────────────────────────────────────────────────────────
 *  전역 인증 상태 (메모리) + 핸들러
 *  ────────────────────────────────────────────────────────────*/
let accessToken: string | null = null
let refreshToken: string | null = null
let onUnauthorized: (() => void) | null = null

// refresh 동시요청 방지(single-flight)
let refreshingPromise: Promise<string | null> | null = null

/** 토큰 주입/정리 */
export const setAccessToken = (token: string | null) => {
  accessToken = token
}
export const setRefreshToken = (token: string | null) => {
  refreshToken = token
}
export const clearAuthTokens = () => {
  accessToken = null
  refreshToken = null
}

/** 401/419 최종 실패 시 호출할 전역 콜백(예: 로그인 화면 이동) */
export const setOnUnauthorized = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

/** 유효 문자열 검사 */
const isBad = (v: any) => !v || v === 'null' || v === 'undefined'

/** ─────────────────────────────────────────────────────────────
 *  요청 인터셉터: Authorization 자동 첨부
 *  ────────────────────────────────────────────────────────────*/
api.interceptors.request.use((config) => {
  // headers가 AxiosHeaders(클래스)든, 평범한 객체든 안전하게 다루기
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : AxiosHeaders.from(config.headers || {})

  if (!isBad(accessToken)) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  } else {
    headers.delete('Authorization')
  }

  // ✅ Axios 타입에 맞게 AxiosHeaders 인스턴스로 대입
  config.headers = headers
  return config
})

/** ─────────────────────────────────────────────────────────────
 *  refresh 로직 (단일 비행)
 *  ────────────────────────────────────────────────────────────*/
async function refreshIfNeeded(): Promise<string | null> {
  if (isBad(refreshToken)) return null

  if (!refreshingPromise) {
    refreshingPromise = api
      .post('/auth/refresh', { refreshToken }) // ← 필요 시 엔드포인트/바디 수정
      .then((res) => {
        const newAccess = (res.data?.accessToken as string) || null
        // 선택: 백엔드가 새 refreshToken도 주면 같이 갱신
        const newRefresh = (res.data?.refreshToken as string) || null
        if (newAccess) setAccessToken(newAccess)
        if (newRefresh) setRefreshToken(newRefresh)
        return newAccess
      })
      .catch(() => null)
      .finally(() => {
        refreshingPromise = null
      })
  }

  return refreshingPromise
}

/** ─────────────────────────────────────────────────────────────
 *  응답 인터셉터: 401/419 → refresh → 원요청 1회 재시도
 *  ────────────────────────────────────────────────────────────*/
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined

    // 네트워크 완전 실패거나 원본 요청 없음 → 그대로 전달
    if (!original) return Promise.reject(error)

    // 인증 만료로 간주할 상태코드
    const isAuthExpired = status === 401 || status === 419

    if (isAuthExpired && !original._retried) {
      // 중복 재시도 방지 플래그
      original._retried = true

      const newAccess = await refreshIfNeeded()
      if (newAccess) {
        // 새 토큰으로 Authorization 교체 후 재시도
        // original.headers가 AxiosHeaders일 수도, 평범한 객체일 수도 있으므로 안전 처리
        const retryHeaders =
          original.headers instanceof AxiosHeaders
            ? original.headers
            : AxiosHeaders.from(original.headers || {})

        retryHeaders.set('Authorization', `Bearer ${newAccess}`)
        original.headers = retryHeaders

        return api.request(original)
      }

      // refresh 실패 → 토큰 정리 + 콜백 호출
      clearAuthTokens()
      onUnauthorized?.()
    }

    // 그 외는 원래 에러 반환
    return Promise.reject(error)
  }
)
