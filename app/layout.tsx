'use client'
import { ReactNode, useEffect, useState } from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
// eslint-disable-next-line camelcase
import { Bai_Jamjuree } from 'next/font/google'
import { Header } from '@/components/Header'
import { usePathname, useRouter } from 'next/navigation'
import { queryClient } from '@/api/QueryClient'
import { QueryClientProvider } from 'react-query'
import { AuthContextProvider } from '@/store/UseAuth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Cookies } from 'react-cookie'

const bai = Bai_Jamjuree({
  weight: '700',
  subsets: ['latin'],
})

interface AuthWrapperProps {
  children: ReactNode
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = new Cookies()
  const pathname = usePathname()

  function AuthWrapper({ children }: AuthWrapperProps) {
    const router = useRouter()
    const pathname = usePathname()
    const isAuthPage = pathname === '/admin'
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
      const token = cookies.get('token_panzer_admin')
      setIsAuthenticated(!!token)

      if (!token && !isAuthPage) {
        router.replace('/admin')
      }
    }, [router, isAuthPage])

    if (isAuthenticated === null) {
      return null
    }

    if (!isAuthenticated && !isAuthPage) {
      return null
    }

    if (isAuthenticated && isAuthPage) {
      router.replace('/admin/home')
      return null
    }

    return <>{children}</>
  }

  const hideNavigationBar = pathname === '/admin'

  return (
    <html lang="en">
      <body className={`${bai.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <AuthWrapper>
                {!hideNavigationBar && <Header />}
                {children}
                <ToastContainer />
              </AuthWrapper>
            </AuthContextProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
