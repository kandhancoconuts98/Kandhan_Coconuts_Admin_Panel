'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { SplashScreen } from '@/components/kandhan/splash-screen'
import { LoginScreen } from '@/components/kandhan/login-screen'

const PUBLIC_PATHS = ['/login', '/forgot-password']

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady, login } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!isReady || showSplash) return
    if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/login')
    }
    if (isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isReady, pathname, router, showSplash])

  if (!isReady || showSplash) {
    return <SplashScreen />
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    if (pathname === '/login') {
      return <LoginScreen onLogin={login} />
    }
    return children
  }

  if (!isAuthenticated) {
    return <SplashScreen />
  }

  return <>{children}</>
}
