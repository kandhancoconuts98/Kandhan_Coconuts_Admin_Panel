'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  MapPin,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workers', label: 'Workers', icon: Users },
  { href: '/daily-entry', label: 'Daily Entry', icon: FileText },
  { href: '/salary', label: 'Salary', icon: DollarSign },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/farms', label: 'Farms', icon: MapPin },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Leaf className="size-6 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              Kandhan Coconuts
            </h1>
            <p className="text-xs text-muted-foreground tamil">கந்தன் தென்னை</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-primary font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground truncate">
              admin@kandhan.com
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="size-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
