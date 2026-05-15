import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { AuthGate } from '@/components/kandhan/auth-gate'
import { StoreHydration } from '@/components/store-hydration'
import { SupabaseAutoSync } from '@/components/supabase-auto-sync'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Kandhan Coconuts | Farm Management Simplified',
  description:
    'கந்தன் தென்னை — Coconut farm operations, worker management, salary & attendance',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <StoreHydration />
            <SupabaseAutoSync />
            <AuthGate>{children}</AuthGate>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
