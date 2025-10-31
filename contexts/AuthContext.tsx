import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { setAccessToken } from '@/libs/api/axios'

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
  login: (token: string, userData: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken')
        const storedUser = await AsyncStorage.getItem('user')

        if (storedToken) {
          setAccessToken(storedToken)
          setToken(storedToken)
        }

        if (storedUser) setUser(JSON.parse(storedUser))
      } catch (e) {
        console.warn('Error loading auth data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadAuthData()
  }, [])

  const login = async (token: string, userData: User) => {
    await AsyncStorage.setItem('accessToken', token)
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    setAccessToken(token)
    setToken(token)
    setUser(userData)
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    setAccessToken(null)
    await AsyncStorage.multiRemove(['accessToken', 'user'])
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
