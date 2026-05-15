'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CalendarDays, TreePine, Wallet, Settings } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Daily Updates', icon: CalendarDays },
  { href: '/salaries', label: 'Salaries', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 py-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary">
              <TreePine className="size-5 text-primary-foreground" />
            </div>
            <span className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-lg font-semibold text-foreground">Coconest</span>
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                Farm Labor Manager
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
