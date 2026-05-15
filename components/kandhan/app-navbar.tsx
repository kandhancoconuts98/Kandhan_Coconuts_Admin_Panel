'use client'

import { Bell, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppNavbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-border bg-card px-4 lg:px-8">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search workers, farms..."
          className="pl-10 bg-input-background border-border"
        />
      </div>
      <Button variant="ghost" size="icon" className="relative shrink-0">
        <Bell className="size-5" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0"
          >
            A
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Organization</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
