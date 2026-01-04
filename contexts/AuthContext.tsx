// contexts/AuthContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { api, setAccessToken, setOnTokenRefreshed, setOnUnauthorized } from '@/libs/api/axios'

/**
 * 로그인 응답에서 받는 토큰 타입
 * - accessToken: API 요청할 때 쓰는 짧은 토큰
 * - refreshToken: accessToken 만료 시 새 accessToken을 발급받는 토큰
 */
type LoginTokens = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn?: number
  refreshTokenExpiresIn?: number
}

/**
 * 서버에서 내려주는 유저 정보 타입
 */
type User = {
  id: number
  nickname: string
  email?: string
  profileImage?: string
}

/**
 * AuthContext가 외부로 제공할 값들
 */
type AuthContextType = {
  token: string | null // 현재 accessToken(앱에서 로그인 여부 판단에 사용)
  user: User | null // 현재 유저
  loading: boolean // 앱 시작 시 "자동 로그인 체크 중" 여부
  verified: boolean // 토큰 검증까지 완료됐는지 여부(/users/me 성공 여부)
  login: (token: LoginTokens, userData: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

/**
 * 저장소 래퍼
 * - web: localStorage 사용
 * - native(iOS/Android): AsyncStorage 사용
 *
 * 목적:
 * "플랫폼이 달라도 동일한 함수(storage.getItem/setItem)로 저장/조회" 가능하게 함
 */
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.localStorage.getItem(key)
    }
    return AsyncStorage.getItem(key)
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
      return
    }
    return AsyncStorage.setItem(key, value)
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
      return
    }
    return AsyncStorage.removeItem(key)
  },
  multiRemove: async (keys: string[]) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      keys.forEach((k) => window.localStorage.removeItem(k))
      return
    }
    return AsyncStorage.multiRemove(keys)
  },
}

/**
 * localStorage에 "null" / "undefined" 문자열이 저장돼있는 케이스 방어
 * (백엔드/프론트 디버깅 과정에서 종종 이런 값이 들어가기도 함)
 */
const isInvalid = (v: any) => !v || v === 'null' || v === 'undefined'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // accessToken을 React state로도 들고 있음 (UI 분기, 라우팅 분기에 사용)
  const [token, setToken] = useState<string | null>(null)

  // 유저 정보 state
  const [user, setUser] = useState<User | null>(null)

  // 앱 시작 시 "저장된 토큰으로 자동 로그인 확인 중" 상태
  const [loading, setLoading] = useState(true)

  // /users/me 검증 성공 여부
  const [verified, setVerified] = useState(false)

  /**
   * axios 쪽 "전역 콜백" 세팅
   * - onUnauthorized: refresh 실패(=세션 만료) 시 호출됨
   * - onTokenRefreshed: refresh 성공 후 새 토큰을 storage에도 저장하게 함
   *
   * 목적:
   * axios interceptor에서 refresh가 돌아가도
   * "storage는 최신 refreshToken으로 갱신"되게 유지하기 위함
   */
  useEffect(() => {
    // refresh 실패하면 앱에서 강제 로그아웃 처리
    setOnUnauthorized(async () => {
      await storage.multiRemove(['accessToken', 'user'])
      setAccessToken(null) // axios 메모리 토큰 제거
      setToken(null) // React state 토큰 제거
      setUser(null) // 유저 제거
      setVerified(false) // 검증 상태 false
    })

    // refresh 성공하면 storage에도 최신 토큰을 저장
    setOnTokenRefreshed(async ({ accessToken }) => {
      await storage.setItem('accessToken', accessToken)
    })
  }, [])

  /**
   * 앱 시작(최초 1회) 자동 로그인 복원 로직
   *
   * 목표:
   * 1) storage에서 토큰 읽기
   * 2) axios 메모리에 토큰 세팅
   * 3) /users/me 호출 → 성공하면 verified=true → 로그인 상태 유지
   * 4) 실패하면(=refresh까지 실패) → 저장소/메모리 정리 → 비로그인 처리
   */
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        setVerified(false) // 시작할 때는 검증 전 상태로 초기화

        // 1️⃣ 저장소에서 기존 로그인 정보 로드
        const [storedAccess, storedUser] = await Promise.all([
          storage.getItem('accessToken'),
          storage.getItem('user'),
        ])

        // 2️⃣ user가 저장돼있으면 일단 화면에 빠르게 반영
        // (단, verified가 true는 아니고, /users/me 성공해야 "진짜 로그인"이 됨)
        if (!user && storedUser && !isInvalid(storedUser)) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {
            // 저장된 user가 깨진 JSON이면 무시
          }
        }

        // 3️⃣ accessToken도 axios 메모리에 세팅
        // (있으면 우선 붙여서 /users/me를 시도)
        if (!isInvalid(storedAccess)) {
          setAccessToken(storedAccess as string)
          setToken(storedAccess as string)
        } else {
          setAccessToken(null)
          setToken(null)
        }

        /**
         * access 유무와 상관없이 /users/me를 한 번 호출
         *
         * - accessToken이 유효하면: 바로 성공
         * - accessToken이 만료되었으면: interceptor가 refresh 시도 → 성공하면 재시도 성공
         * - refresh도 실패하면: 여기서 최종 실패로 떨어짐 → 아래 catch에서 로그아웃 정리
         */
        //4️⃣ 실제 인증 여부 판단은 /users/me
        const { data } = await api.get<User>('/users/me')

        // 여기까지 오면 "검증 완료된 로그인 상태"
        setUser(data)
        setVerified(true)
      } catch {
        // 여기로 왔다는 건: access도 실패했고 refresh도 실패한 상황
        await storage.multiRemove(['accessToken', 'user'])
        setAccessToken(null)
        setToken(null)
        setUser(null)
        setVerified(false)
      } finally {
        // 자동 로그인 체크 끝
        setLoading(false)
      }
    }

    loadAuthData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * 로그인 성공 시 호출
   * - storage에 토큰 저장 (재접속 시 유지 목적)
   * - axios 메모리에 토큰 세팅 (즉시 API 호출 가능)
   * - React state 업데이트 (UI 로그인 상태로 전환)
   */
  const login = async (tokens: LoginTokens, userData: User) => {
    await storage.setItem('accessToken', tokens.accessToken)
    await storage.setItem('user', JSON.stringify(userData))

    setAccessToken(tokens.accessToken)

    setToken(tokens.accessToken)
    setUser(userData)

    // "로그인 직후"는 서버에서 막 토큰을 받은 상태라 검증 완료로 간주
    setVerified(true)
  }

  /**
   * 유저 정보 부분 업데이트 (닉네임 변경 등)
   * - state 갱신 + storage에도 같이 저장해서 앱 재시작 시에도 반영되게 함
   */
  const updateUser = async (userData: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...(prev ?? ({} as User)), ...userData } as User
      storage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  /**
   * 로그아웃
   * - state 초기화
   * - axios 메모리 토큰 제거
   * - storage 토큰 제거
   */
  const logout = async () => {
    setToken(null)
    setUser(null)
    setVerified(false)

    setAccessToken(null)

    await storage.multiRemove(['accessToken', 'user'])
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, verified, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * AuthContext 쉽게 쓰려고 만든 커스텀 훅
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
