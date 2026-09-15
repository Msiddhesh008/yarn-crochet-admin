import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearSession,
  getStoredEmail,
  getStoredToken,
  loginRequest,
  setSession,
} from '../services/api'

interface AuthContextValue {
  isAuthenticated: boolean
  email: string | null
  ready: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(() => getStoredEmail())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getStoredToken()
    const storedEmail = getStoredEmail()
    if (!token || !storedEmail) {
      clearSession()
      setEmail(null)
    }
    setReady(true)
  }, [])

  const login = useCallback(async (nextEmail: string, password: string) => {
    if (!nextEmail.trim() || !password.trim()) return false
    try {
      const result = await loginRequest(nextEmail.trim(), password)
      setSession(result.token, result.email)
      setEmail(result.email)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setEmail(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(email && getStoredToken()),
      email,
      ready,
      login,
      logout,
    }),
    [email, ready, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
