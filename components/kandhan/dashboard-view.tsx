'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
  Users,
  TreeDeciduous,
  DollarSign,
  UserX,
  Plus,
  TrendingUp,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useFarmStore } from '@/lib/store'
import {
  getDashboardMetrics,
  getWeeklyChartData,
  getFarmSalaryDistribution,
  getRecentActivity,
} from '@/lib/farm-utils'

const COLORS = ['#2E7D32', '#4CAF50', '#A5D6A7', '#22C55E']

export function DashboardView() {
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const farms = useFarmStore((s) => s.farms)
  const attendance = useFarmStore((s) => s.attendance)
  const farmAssignments = useFarmStore((s) => s.farmAssignments)

  const metrics = getDashboardMetrics(
    workers,
    dailyRecords,
    attendance,
    settings
  )
  const weeklyData = getWeeklyChartData(dailyRecords)
  const salaryDistribution = getFarmSalaryDistribution(
    farms,
    dailyRecords,
    farmAssignments,
    settings
  )
  const recentActivity = getRecentActivity(
    workers,
    dailyRecords,
    farms,
    farmAssignments
  )

  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 lg:p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-white/90 mb-1">Kandhan Coconuts — Farm Management</p>
          <p className="text-white/80 text-sm mb-6">{today}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/workers/new"
              className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="size-4" />
              Add Worker
            </Link>
            <Link
              href="/daily-entry/bulk"
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Plus className="size-4" />
              Add Daily Entry
            </Link>
            <Link
              href="/salary"
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <DollarSign className="size-4" />
              View Salary
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            icon={Users}
            iconClass="bg-primary/10 text-primary"
            value={metrics.totalWorkers}
            label="Total Workers"
          />
          <MetricCard
            icon={TreeDeciduous}
            iconClass="bg-secondary/10 text-secondary"
            value={metrics.totalTrees.toLocaleString()}
            label="Trees This Week"
          />
          <MetricCard
            icon={DollarSign}
            iconClass="bg-warning/10 text-warning"
            value={`₹${Math.round(metrics.weeklySalary).toLocaleString()}`}
            label="Weekly Salary"
          />
          <MetricCard
            icon={UserX}
            iconClass="bg-destructive/10 text-destructive"
            value={metrics.absentWorkers}
            label="Absent Today"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Weekly Productivity">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="trees" stroke="#2E7D32" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Salary Distribution by Farm">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={salaryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(e) => e.name}
                  outerRadius={80}
                  dataKey="value"
                >
                  {salaryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Weekly Salary Trend">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="salary" fill="#2E7D32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm">No entries yet. Start daily entry.</p>
          ) : (
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  {['Worker', 'Farm', 'Trees', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((a, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{a.worker}</td>
                    <td className="py-3 px-4">{a.farm}</td>
                    <td className="py-3 px-4">{a.trees}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertCard tone="warning" title="Missing Entries" text="Review workers without today's entry" href="/daily-entry" />
          <AlertCard tone="info" title="Daily Entry" text="Record tree counts for all workers" href="/daily-entry/bulk" />
          <AlertCard tone="success" title="Salary" text="View weekly payroll summary" href="/salary" />
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  iconClass,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
  value: string | number
  label: string
}) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`size-12 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="size-6" />
        </div>
        <span className="flex items-center gap-1 text-success text-sm font-medium">
          <TrendingUp className="size-4" />
        </span>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}

function AlertCard({
  tone,
  title,
  text,
  href,
}: {
  tone: 'warning' | 'info' | 'success'
  title: string
  text: string
  href: string
}) {
  const styles = {
    warning: 'bg-warning/10 border-warning/20 text-warning',
    info: 'bg-info/10 border-info/20 text-info',
    success: 'bg-success/10 border-success/20 text-success',
  }
  return (
    <Link href={href} className={`rounded-xl p-4 border block hover:opacity-90 ${styles[tone].split(' ').slice(2).join(' ')} ${styles[tone].split(' ').slice(0, 2).join(' ')}`}>
      <h4 className={`font-semibold mb-2 ${tone === 'warning' ? 'text-warning' : tone === 'info' ? 'text-info' : 'text-success'}`}>{title}</h4>
      <p className="text-sm text-foreground">{text}</p>
    </Link>
  )
}



