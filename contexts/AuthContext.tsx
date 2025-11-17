// contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { api, setAccessToken, setOnUnauthorized, setRefreshToken } from '@/libs/api/axios'

type LoginTokens = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn?: number
  refreshTokenExpiresIn?: number
}

type User = {
  id: number
  nickname: string
  email?: string
  profileImage?: string
}

type AuthContextType = {
  token: string | null
  user: User | null
  loading: boolean
  verified: boolean
  login: (token: LoginTokens, userData: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

/** 웹은 localStorage, 네이티브는 AsyncStorage 사용 */
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

const isInvalid = (v: any) => !v || v === 'null' || v === 'undefined'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // ✅ 리프레시 실패(401/419) 시 자동 로그아웃
    setOnUnauthorized(async () => {
      await storage.multiRemove(['accessToken', 'refreshToken', 'user'])
      setAccessToken(null)
      setRefreshToken(null)
      setToken(null)
      setUser(null)
      setVerified(false)
    })
  }, [])

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // ✅ refreshToken도 함께 복원
        const [storedAccess, storedRefresh, storedUser] = await Promise.all([
          storage.getItem('accessToken'),
          storage.getItem('refreshToken'),
          storage.getItem('user'),
        ])

        if (!isInvalid(storedAccess)) {
          setAccessToken(storedAccess as string)
          setToken(storedAccess as string)

          if (!isInvalid(storedRefresh)) {
            setRefreshToken(storedRefresh as string)
          }

          // ✅ 토큰 유효성 확인
          try {
            const { data } = await api.get<User>('/users/me')
            setUser(data)
            setVerified(true)
          } catch {
            // 검증 실패 → 정리
            await storage.multiRemove(['accessToken', 'refreshToken', 'user'])
            setAccessToken(null)
            setRefreshToken(null)
            setToken(null)
            setUser(null)
            setVerified(false)
          }
        } else {
          await storage.multiRemove(['accessToken', 'refreshToken', 'user'])
          setAccessToken(null)
          setRefreshToken(null)
          setToken(null)
          setUser(null)
          setVerified(false)
        }

        // (옵션) 저장된 user를 파싱만 우선 반영하고 싶다면 아래 사용
        if (!user && storedUser && !isInvalid(storedUser)) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {}
        }
      } finally {
        setLoading(false)
      }
    }
    loadAuthData()
  }, [])

  const login = async (tokens: LoginTokens, userData: User) => {
    await storage.setItem('accessToken', tokens.accessToken)
    await storage.setItem('refreshToken', tokens.refreshToken)
    await storage.setItem('user', JSON.stringify(userData))
    setAccessToken(tokens.accessToken)
    setRefreshToken(tokens.refreshToken)
    setToken(tokens.accessToken)
    setUser(userData)
    setVerified(true) // 로그인 직후는 검증 완료로 간주
  }

  const updateUser = async (userData: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...(prev ?? ({} as User)), ...userData } as User
      storage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    setVerified(false)
    setAccessToken(null)
    setRefreshToken(null)
    await storage.multiRemove(['accessToken', 'refreshToken', 'user'])
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, verified, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
