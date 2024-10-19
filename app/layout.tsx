'use client'

import { useEffect } from 'react'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = new Cookies()
  const token = cookies.get('token:panzer-admin')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!token && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [token, pathname, router])

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
              {pathname === '/admin' ? '' : <Header />}
              {children}
            </AuthContextProvider>
          </QueryClientProvider>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
