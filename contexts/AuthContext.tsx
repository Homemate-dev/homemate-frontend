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
        const storedToken = await AsyncStorage.getItem('accessToken')
        if (storedToken) {
          console.log('Loaded token from AsyncStorage:', storedToken)
          setToken(storedToken)
          setAccessToken(storedToken)
        } else {
          console.log('No token found in AsyncStorage.')
        }
      } catch (e) {
        console.warn('Error loading token:', e)
      } finally {
        setLoading(false)
      }
    }

    loadToken()
  }, [])

  const login = async (token: string) => {
    console.log('Storing token in AsyncStorage:', token)
    await AsyncStorage.setItem('accessToken', token)

    const storedToken = await AsyncStorage.getItem('accessToken')
    console.log('Token after saving:', storedToken)

    setAccessToken(token)
  }

  const logout = async () => {
    console.log('Logging out...')
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
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
