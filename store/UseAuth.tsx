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
}

export const AuthContext = createContext({} as AuthContextProps)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { push } = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies(['token:panzer-admin'])

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!cookies['token:panzer-admin'],
  )

  useEffect(() => {
    const handleCookieChange = () => {
      if (!cookies['token:panzer-admin']) {
        setIsAuthenticated(false)
        api.defaults.headers.Authorization = ''
        push('/admin')
      } else {
        setIsAuthenticated(true)
        api.defaults.headers.Authorization = `Bearer ${cookies['token:panzer-admin']}`
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
      const tokenn = response.data.access
      setCookie('token:panzer-admin', tokenn, { maxAge: 60 * 30 })

      api.defaults.headers.Authorization = `Bearer ${tokenn}`
      setIsAuthenticated(true)
      push('/admin/home')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      err.response.status === 401
        ? toast.error(err.response.data.detail, {
            position: 'bottom-right',
            theme: 'dark',
            closeOnClick: true,
          })
        : toast.error('Ocorreu um erro inesperado com a API', {
            position: 'bottom-right',
            theme: 'dark',
            closeOnClick: true,
          })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignOut() {
    removeCookie('token:panzer-admin', { path: '/' })
    api.defaults.headers.Authorization = ''
    setIsAuthenticated(false)
    push('/admin')
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
