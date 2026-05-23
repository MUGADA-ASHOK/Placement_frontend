import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/services'
import { storage } from '../utils/storage'
import { ROLE_ROUTES } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authApi.login({ email, password })
      const { accessToken, refreshToken, email: userEmail, role } = data.data
      storage.set(accessToken, refreshToken, { email: userEmail, role })
      setUser({ email: userEmail, role })
      return { success: true, redirectTo: ROLE_ROUTES[role] || '/login' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = storage.getRefresh()
    try { await authApi.logout(refreshToken) } catch {}
    storage.clear()
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const role = user?.role

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
