'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Leaf, Users, FileText, DollarSign } from 'lucide-react';

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="0.5" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
            <Leaf className="w-12 h-12 text-[#2E7D32]" strokeWidth={2.5} />
          </div>
          <h1 className="text-white text-4xl font-bold mb-2 text-center">Kandhan Coconuts</h1>
          <h2 className="text-white/90 text-2xl font-semibold mb-4 text-center tamil">கந்தன் தென்னை</h2>
          <p className="text-white/80 text-center">Farm Management Simplified</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg mb-3">
              <Leaf className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Kandhan Coconuts</h1>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground mb-8">Sign in to manage your farm operations</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your email or phone"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary border-border rounded focus:ring-primary" />
                  <span className="ml-2 text-sm text-foreground">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                className="w-full bg-white border border-border text-foreground py-3 rounded-lg font-medium hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  Sign up
                </a>
              </p>
            </form>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-card rounded-lg p-4 border border-border text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-foreground mb-1">Manage Workers</h3>
              <p className="text-xs text-muted-foreground">Track attendance & productivity</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-foreground mb-1">Daily Entries</h3>
              <p className="text-xs text-muted-foreground">Record daily operations</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border text-center">
              <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-foreground mb-1">Salary Reports</h3>
              <p className="text-xs text-muted-foreground">Calculate & manage payroll</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
