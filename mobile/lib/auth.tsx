import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const AUTH_KEY = 'kandhan-auth'

interface AuthContextValue {
  isAuthenticated: boolean
  isReady: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((v) => {
      setIsAuthenticated(v === 'true')
      setIsReady(true)
    })
  }, [])

  const login = useCallback(async () => {
    await AsyncStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
