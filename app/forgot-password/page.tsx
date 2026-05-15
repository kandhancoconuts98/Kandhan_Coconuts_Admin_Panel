'use client'

import Link from 'next/link'
import { Leaf, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary mb-3 shadow-lg">
            <Leaf className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-center mt-2">
            Enter your email and we&apos;ll send reset instructions
          </p>
        </div>
        <form
          className="bg-card rounded-2xl border border-border p-8 shadow-lg space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email or Phone</Label>
            <Input id="email" type="text" placeholder="you@example.com" />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </form>
      </div>
    </div>
  )
}
