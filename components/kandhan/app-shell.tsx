'use client'

import { AppSidebar } from '@/components/kandhan/app-sidebar'
import { AppNavbar } from '@/components/kandhan/app-navbar'
import { MobileNav } from '@/components/kandhan/mobile-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AppNavbar />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
