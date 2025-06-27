import { useState, useEffect, createContext, useContext } from 'react'
import { apiService } from '@/lib/api'

interface User {
  id: number
  nome: string
  email: string
  tipo_usuario: 'ADMIN' | 'CLIENT' | 'SUPPLIER'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo e validar
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          apiService.setToken(token)
          const response = await apiService.getProfile()
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('auth_token')
          apiService.removeToken()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password)
      const { token, user: userData } = response.data || response
      
      apiService.setToken(token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    apiService.removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}