'use client'

import { use } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Edit, Phone } from 'lucide-react'
import { useFarmStore } from '@/lib/store'
import { getWorkerWeeklyStats, getWeekRange } from '@/lib/farm-utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const worker = useFarmStore((s) => s.workers.find((w) => w.id === id))
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const farms = useFarmStore((s) => s.farms)

  if (!worker) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Worker not found</p>
        <Button asChild><Link href="/workers">Back to workers</Link></Button>
      </div>
    )
  }

  const week = getWorkerWeeklyStats(worker.id, dailyRecords, settings)
  const { from, to } = getWeekRange()
  const chartData = dailyRecords
    .filter((r) => r.workerId === id && r.date >= from && r.date <= to)
    .map((r) => ({ day: format(new Date(r.date), 'EEE'), trees: r.treeCount }))

  const farmNames =
    worker.assignedFarmIds
      ?.map((fid) => farms.find((f) => f.id === fid)?.name)
      .filter(Boolean)
      .join(', ') || '—'

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {worker.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{worker.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Phone className="size-4" />
              {worker.phone ?? 'No phone'}
            </p>
            <Badge className="mt-2">{worker.status ?? 'active'}</Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={`/workers/${id}/edit`}>
            <Edit className="size-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Trees (week)', value: week.trees },
          { label: 'Net salary', value: `₹${Math.round(week.net)}` },
          { label: 'Gross', value: `₹${Math.round(week.gross)}` },
          { label: 'Farms', value: farmNames },
        ].map((c) => (
          <div key={c.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-2xl font-bold truncate">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Weekly productivity</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData.length ? chartData : [{ day: '—', trees: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="trees" fill="#2E7D32" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {worker.notes && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-muted-foreground">{worker.notes}</p>
        </div>
      )}
    </div>
  )
}
