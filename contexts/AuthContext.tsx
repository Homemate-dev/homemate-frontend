import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { setAccessToken } from '@/libs/api/axios'

type AuthContextType = {
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const stored = await AsyncStorage.getItem('accessToken')
        if (stored) {
          setToken(stored)
          setAccessToken(stored)
        }
      } catch (e) {
        console.warn('토큰 불러오기 실패:', e)
      } finally {
        setLoading(false)
      }
    }
    loadToken()
  }, [])

  const login = async (newToken: string) => {
    setToken(newToken)
    setAccessToken(newToken)
    await AsyncStorage.setItem('accessToken', newToken)
  }

  const logout = async () => {
    setToken(null)
    setAccessToken(null)
    await AsyncStorage.removeItem('accessToken')
  }

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용 가능합니다.')
  return ctx
}
