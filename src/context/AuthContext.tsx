import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadJson, saveJson } from '../services/storage'

interface AuthContextValue {
  isAuthenticated: boolean
  email: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(() =>
    loadJson<string | null>('auth-email', null),
  )

  const login = useCallback((nextEmail: string, password: string) => {
    if (!nextEmail.trim() || !password.trim()) return false
    setEmail(nextEmail.trim())
    saveJson('auth-email', nextEmail.trim())
    return true
  }, [])

  const logout = useCallback(() => {
    setEmail(null)
    saveJson('auth-email', null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(email),
      email,
      login,
      logout,
    }),
    [email, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
