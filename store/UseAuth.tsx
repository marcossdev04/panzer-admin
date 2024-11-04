/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/api/api'
import { useRouter } from 'next/navigation'
import { CookiesProvider, useCookies } from 'react-cookie'
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import { toast } from 'react-toastify'

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextProps {
  handleSignIn: (credentials: SignInCredentials) => void
  handleSignOut: () => void
  isLoading: boolean
  errorSignIn: string | null
  handleClearErrorSignIn: () => void
  isAuthenticated: boolean
  refreshToken: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextProps)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { push } = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies([
    'token_panzer_admin',
    'refresh_panzer_admin',
  ])

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!cookies.token_panzer_admin,
  )

  useEffect(() => {
    const handleCookieChange = () => {
      if (!cookies.token_panzer_admin) {
        setIsAuthenticated(false)
        api.defaults.headers.Authorization = ''
      } else {
        setIsAuthenticated(true)
        api.defaults.headers.Authorization = `Bearer ${cookies.token_panzer_admin}`
      }
    }
    handleCookieChange()

    const interval = setInterval(handleCookieChange, 3000)

    return () => clearInterval(interval)
  }, [cookies, push])

  async function handleSignIn({ email, password }: SignInCredentials) {
    setIsLoading(true)
    try {
      const response = await api.post('/api/token/', {
        email,
        password,
      })
      const accessToken = response.data.access
      const refreshToken = response.data.refresh
      setCookie('token_panzer_admin', accessToken, { maxAge: 60 * 60 })
      setCookie('refresh_panzer_admin', refreshToken, {
        maxAge: 60 * 60 * 24,
      })

      api.defaults.headers.Authorization = `Bearer ${accessToken}`
      setIsAuthenticated(true)
      push('/admin/home')
    } catch (err: any) {
      toast.error(
        err.response.data.error === 'Wrong password'
          ? 'Email ou senha incorreta'
          : err.response.data.error === 'The user is already logged in'
            ? 'Você já está logado'
            : 'Erro desconhecido',
        {
          position: 'bottom-right',
          theme: 'dark',
          closeOnClick: true,
        },
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignOut() {
    removeCookie('token_panzer_admin')
    removeCookie('refresh_panzer_admin')
    api.defaults.headers.Authorization = ''
    push('/admin')
    setIsAuthenticated(false)
  }

  async function refreshToken() {
    try {
      const refreshToken = cookies.refresh_panzer_admin
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post('/api/token/refresh/', {
        refresh: refreshToken,
      })
      const newAccessToken = response.data.access
      setCookie('token_panzer_admin', newAccessToken, { maxAge: 60 * 60 })
      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`
      setIsAuthenticated(true)
    } catch (err: any) {
      console.error('Failed to refresh token:', err)
      handleSignOut()
    }
  }

  function handleClearErrorSignIn() {
    setError('')
  }

  return (
    <AuthContext.Provider
      value={{
        handleSignIn,
        handleSignOut,
        isLoading,
        errorSignIn: error ? String(error) : null,
        handleClearErrorSignIn,
        isAuthenticated,
        refreshToken,
      }}
    >
      <CookiesProvider>{children}</CookiesProvider>
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext)

  return context
}
