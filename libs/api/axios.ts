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

let onTokenRefreshed:
  | ((tokens: { accessToken: string; refreshToken?: string | null }) => Promise<void> | void)
  | null = null

export const setOnTokenRefreshed = (fn: typeof onTokenRefreshed) => {
  onTokenRefreshed = fn
}

// refresh 동시요청 방지(single-flight)
let refreshingPromise: Promise<string | null> | null = null

/** 토큰 주입/정리 */
export const setAccessToken = (token: string | null) => {
  accessToken = token
}
export const setRefreshToken = (_token: string | null) => {}
export const clearAuthTokens = () => {
  accessToken = null
}

export const getAccessToken = () => accessToken

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

  //  refresh 호출인지 판단 (필요에 따라 절대경로/쿼리 포함 케이스 보완)
  const url = config.url || ''
  const isRefreshCall = /\/auth\/refresh(\b|\/|\?)/.test(url)

  //  외부에서 명시적으로 스킵하고 싶은 경우를 위한 escape hatch
  const skipAuth = (headers.get?.('x-skip-auth') ?? headers['x-skip-auth']) === '1'
  if (skipAuth) {
    headers.delete('x-skip-auth')
    config.headers = headers
    return config
  }

  if (isRefreshCall) {
    // httpOnly 쿠키 방식: refresh는 쿠키로 처리 → Authorization 붙이지 않음
    headers.delete('Authorization')
  } else {
    // 그 외 모든 API에는 accessToken
    if (!isBad(accessToken)) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    } else {
      headers.delete('Authorization')
    }
  }

  // Axios 타입에 맞게 AxiosHeaders 인스턴스로 대입
  config.headers = headers
  return config
})

/** ─────────────────────────────────────────────────────────────
 *  refresh 로직
 *  ────────────────────────────────────────────────────────────*/

async function refreshIfNeeded(): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = api
      .post('/auth/refresh', undefined, { withCredentials: true }) // httpOnly 쿠키 저장/전송 허용
      .then(async (res) => {
        // 스펙에 맞춰 파싱
        const data = res.data as {
          tokenType?: string
          accessToken?: string
          accessTokenExpiresIn?: number
          refreshToken?: string
          refreshTokenExpiresIn?: number
        }

        const newAccess = data.accessToken ?? null

        if (newAccess) setAccessToken(newAccess)

        // storage 동기화 콜백 호출
        if (newAccess) {
          await onTokenRefreshed?.({ accessToken: newAccess, refreshToken: null })
        }

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
    if (!original) return Promise.reject(error)

    const isRefreshEndpoint = /\/auth\/refresh(\b|\/|\?)/.test(original.url || '')

    // 1) refresh 요청 자체가 실패했다면 → 즉시 로그아웃
    if (isRefreshEndpoint) {
      clearAuthTokens()
      onUnauthorized?.()
      return Promise.reject(error)
    }

    // 2) 인증 만료로 간주할 케이스 (백엔드가 500을 던지는 경우를 포함)
    const isAuthExpired = status === 401 || status === 419 || status === 403
    const treatAsAuthFail = isAuthExpired || status === 500

    if (treatAsAuthFail && !original._retried) {
      original._retried = true

      const newAccess = await refreshIfNeeded()
      if (newAccess) {
        const retryHeaders =
          original.headers instanceof AxiosHeaders
            ? original.headers
            : AxiosHeaders.from(original.headers || {})
        retryHeaders.set('Authorization', `Bearer ${newAccess}`)
        original.headers = retryHeaders
        return api.request(original)
      }

      // 3) refresh 실패 → 즉시 로그아웃
      clearAuthTokens()
      onUnauthorized?.()
    }

    return Promise.reject(error)
  }
)
