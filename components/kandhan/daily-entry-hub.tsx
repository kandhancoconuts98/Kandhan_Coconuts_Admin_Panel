'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, AlertTriangle, Users, FileText } from 'lucide-react'
import { useFarmStore, EMPTY_SELECTED_WORKER_IDS } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function DailyEntryHub() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const workers = useFarmStore((s) => s.workers)
  const selected = useFarmStore((s) => {
    const ids = s.selectedWorkerIds[today]
    return ids ?? EMPTY_SELECTED_WORKER_IDS
  })
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const attendance = useFarmStore((s) => s.attendance[today] ?? {})

  const presentCount = selected.length
  const enteredCount = dailyRecords.filter(
    (r) => r.date === today && r.treeCount > 0
  ).length
  const pending = Math.max(0, presentCount - enteredCount)
  const missingWorkers = workers.filter(
    (w) => selected.includes(w.id) && !dailyRecords.some((r) => r.workerId === w.id && r.date === today && r.treeCount > 0)
  )

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Daily Entry</h1>
        <p className="text-muted-foreground">Operations center for {today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Workers selected" value={presentCount} />
        <StatCard icon={FileText} label="Entries today" value={enteredCount} />
        <StatCard icon={AlertTriangle} label="Pending" value={pending} tone="warning" />
      </div>

      <Link
        href="/daily-entry/bulk"
        className="block bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 text-center shadow-lg hover:opacity-95 transition-opacity"
      >
        <Calendar className="size-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">Start Daily Entry</h2>
        <p className="text-white/90">Open bulk entry table for all workers</p>
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Quick links</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/daily-entry/muster">Muster roll (select workers)</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/daily-entry/history">Entry history</Link>
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Missing entries</h3>
          {missingWorkers.length === 0 ? (
            <p className="text-sm text-muted-foreground">All selected workers have entries.</p>
          ) : (
            <ul className="space-y-2">
              {missingWorkers.slice(0, 5).map((w) => (
                <li key={w.id} className="text-sm flex justify-between">
                  <span>{w.name}</span>
                  <span className="text-warning">
                    {attendance[w.id] === 'leave' ? 'Leave' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  tone?: 'warning'
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <Icon className={`size-8 mb-3 ${tone === 'warning' ? 'text-warning' : 'text-primary'}`} />
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

