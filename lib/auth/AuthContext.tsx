'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedAuth = localStorage.getItem('auth')
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)
          setUser(authData.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Valid credentials
    const VALID_EMAIL = 'mayank@gmail.com'
    const VALID_PASSWORD = 'mayank@123'

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Validate credentials
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      throw new Error('Invalid email or password')
    }

    const userData = { email }
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('auth', JSON.stringify({ user: userData }))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
