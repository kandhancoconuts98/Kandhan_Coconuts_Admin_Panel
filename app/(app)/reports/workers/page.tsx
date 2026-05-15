'use client'

import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { useFarmStore } from '@/lib/store'
import { calcNetSalary } from '@/lib/farm-utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function WorkerReportsPage() {
  const workers = useFarmStore((s) => s.workers)
  const records = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const from = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const to = format(endOfMonth(new Date()), 'yyyy-MM-dd')

  const ranking = useMemo(() => {
    return workers
      .map((w) => {
        const trees = records
          .filter((r) => r.workerId === w.id && r.date >= from && r.date <= to)
          .reduce((s, r) => s + r.treeCount, 0)
        return { name: w.name.split(' ')[0], trees, salary: calcNetSalary(trees, settings) }
      })
      .filter((r) => r.trees > 0)
      .sort((a, b) => b.trees - a.trees)
  }, [workers, records, settings, from, to])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Worker Reports</h1>
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Productivity ranking (this month)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ranking} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="trees" fill="#2E7D32" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
