import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/sbsApi.js'
import { AUTH_STORAGE_KEY } from '../utils/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const persisted = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return persisted ? JSON.parse(persisted) : null
  })

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [auth])

  const login = async (payload) => {
    const { data } = await authApi.login(payload)
    setAuth(data)
    return data
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    setAuth(data)
    return data
  }

  const logout = () => setAuth(null)

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated: Boolean(auth?.token),
        user: auth
          ? {
              id: auth.userId,
              email: auth.email,
              fullName: auth.fullName,
              role: auth.role,
            }
          : null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
