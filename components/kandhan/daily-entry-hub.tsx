'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { TreePine, Truck, Calendar, History } from 'lucide-react'
import { useFarmStore } from '@/lib/store'
import { getDailyLoadTotals } from '@/lib/operations-utils'
import { isClimber, isLoader } from '@/lib/worker-types'
import { Button } from '@/components/ui/button'

export function DailyEntryHub() {
  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  const { workers, dailyRecords, loadTrips } = useFarmStore(
    useShallow((s) => ({
      workers: s.workers,
      dailyRecords: s.dailyRecords,
      loadTrips: s.loadTrips,
    }))
  )

  const stats = useMemo(() => {
    const climbers = workers.filter((w) => isClimber(w.workerType))
    const loaders = workers.filter((w) => isLoader(w.workerType))
    const treesToday = dailyRecords
      .filter((r) => r.date === today)
      .reduce((s, r) => s + r.treeCount, 0)
    const loadTotals = getDailyLoadTotals(loadTrips, today)
    return {
      climbers: climbers.length,
      loaders: loaders.length,
      treesToday,
      loadsToday: loadTotals.loads,
    }
  }, [workers, dailyRecords, loadTrips, today])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Daily Entry</h1>
        <p className="text-muted-foreground">Operations for {today}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MiniStat label="Climbers" value={stats.climbers} />
        <MiniStat label="Loaders" value={stats.loaders} />
        <MiniStat label="Trees today" value={stats.treesToday} />
        <MiniStat label="Loads today" value={stats.loadsToday} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/daily-entry/climbers"
          className="block bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-8 shadow-lg hover:opacity-95 transition-opacity"
        >
          <TreePine className="size-12 mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">Tree climbers</h2>
          <p className="text-white/90 text-sm mb-4">
            Trees climbed, farm assignment, and attendance.
          </p>
        </Link>

        <Link
          href="/daily-entry/loads"
          className="block bg-card border-2 border-primary/30 rounded-2xl p-8 shadow-sm hover:border-primary transition-colors"
        >
          <Truck className="size-12 mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Loads</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Vehicle number, load count, workers on vehicle, and diesel.
          </p>
          <p className="text-sm text-primary font-medium">
            {stats.loadsToday} loads logged today
          </p>
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">More</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/daily-entry/muster">
              <Calendar className="size-4 mr-2" />
              Muster roll
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/daily-entry/history">
              <History className="size-4 mr-2" />
              History
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/daily-entry/bulk">Legacy bulk entry</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
