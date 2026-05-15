'use client'

import Link from 'next/link'
import { Users, Calendar, MapPin, Wallet, BarChart3 } from 'lucide-react'

const cards = [
  { href: '/reports/workers', title: 'Worker Reports', desc: 'Productivity & salary ranking', icon: Users },
  { href: '/reports/attendance', title: 'Attendance Reports', desc: 'Heatmaps & leave analysis', icon: Calendar },
  { href: '/reports/farms', title: 'Farm Reports', desc: 'Cost & allocation analytics', icon: MapPin },
  { href: '/salary', title: 'Financial Reports', desc: 'Weekly payroll exports', icon: Wallet },
]

export default function ReportsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Reports</h1>
      <p className="text-muted-foreground mb-8">Analytics and exports</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow group"
          >
            <c.icon className="size-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 bg-card rounded-xl border border-border p-6 flex items-center gap-4">
        <BarChart3 className="size-12 text-primary" />
        <div>
          <h3 className="font-semibold">KPI overview</h3>
          <p className="text-sm text-muted-foreground">
            Use Dashboard for live metrics and export salary from Weekly Salary.
          </p>
        </div>
      </div>
    </div>
  )
}
