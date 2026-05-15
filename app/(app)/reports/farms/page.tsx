'use client'

import { useFarmStore } from '@/lib/store'
import { getFarmSalaryDistribution } from '@/lib/farm-utils'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#2E7D32', '#4CAF50', '#A5D6A7', '#22C55E']

export default function FarmReportsPage() {
  const farms = useFarmStore((s) => s.farms)
  const records = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const assignments = useFarmStore((s) => s.farmAssignments)

  const data = getFarmSalaryDistribution(farms, records, assignments, settings)

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Farm Reports</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Salary by farm (week)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Farm overview</h3>
          <ul className="space-y-3">
            {farms.map((f) => (
              <li key={f.id} className="flex justify-between text-sm border-b border-border pb-2">
                <span className="font-medium">{f.name}</span>
                <span className="text-muted-foreground">
                  {f.treeCount} trees · {f.location}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
