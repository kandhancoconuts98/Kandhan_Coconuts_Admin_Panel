'use client'

import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useFarmStore } from '@/lib/store'
import { calcNetSalary } from '@/lib/farm-utils'

export default function MonthlySalaryPage() {
  const workers = useFarmStore((s) => s.workers)
  const records = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)

  const chartData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    })
    return months.map((m) => {
      const from = format(startOfMonth(m), 'yyyy-MM-dd')
      const to = format(endOfMonth(m), 'yyyy-MM-dd')
      const trees = records
        .filter((r) => r.date >= from && r.date <= to)
        .reduce((s, r) => s + r.treeCount, 0)
      return {
        month: format(m, 'MMM'),
        salary: calcNetSalary(trees, settings),
        trees,
      }
    })
  }, [records, settings])

  const ranking = useMemo(() => {
    const from = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const to = format(endOfMonth(new Date()), 'yyyy-MM-dd')
    return workers
      .map((w) => {
        const trees = records
          .filter((r) => r.workerId === w.id && r.date >= from && r.date <= to)
          .reduce((s, r) => s + r.treeCount, 0)
        return { name: w.name, trees, salary: calcNetSalary(trees, settings) }
      })
      .filter((r) => r.trees > 0)
      .sort((a, b) => b.trees - a.trees)
      .slice(0, 10)
  }, [workers, records, settings])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Monthly Salary</h1>
        <p className="text-muted-foreground">Trends and worker ranking</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Salary trend (6 months)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="salary" fill="#2E7D32" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Top workers this month</h3>
        <ol className="space-y-2">
          {ranking.map((r, i) => (
            <li key={r.name} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
              <span>
                #{i + 1} {r.name}
              </span>
              <span className="font-medium">
                {r.trees} trees · ₹{Math.round(r.salary).toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
