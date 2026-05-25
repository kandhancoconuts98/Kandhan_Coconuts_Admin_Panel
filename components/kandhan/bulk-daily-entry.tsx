'use client'

import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { format } from 'date-fns'
import { Calendar, Search, Save, Plus, Trash2 } from 'lucide-react'
import {
  useFarmStore,
  EMPTY_SELECTED_WORKER_IDS,
  EMPTY_ATTENDANCE_DAY,
  EMPTY_FARM_ASSIGNMENTS_DAY,
} from '@/lib/store'
import type { AttendanceStatus } from '@/lib/store'
import { calcNetSalary } from '@/lib/farm-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export function BulkDailyEntry() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [farmFilter, setFarmFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  const {
    workers,
    farms,
    settings,
    dailyRecords,
    selectedWorkerIds,
    attendance,
    farmAssignments,
  } = useFarmStore(
    useShallow((s) => ({
      workers: s.workers,
      farms: s.farms,
      settings: s.settings,
      dailyRecords: s.dailyRecords,
      selectedWorkerIds:
        s.selectedWorkerIds[date] ?? EMPTY_SELECTED_WORKER_IDS,
      attendance: s.attendance[date] ?? EMPTY_ATTENDANCE_DAY,
      farmAssignments: s.farmAssignments[date] ?? EMPTY_FARM_ASSIGNMENTS_DAY,
    }))
  )

  const updateTreeCount = useFarmStore((s) => s.updateTreeCount)
  const setAttendance = useFarmStore((s) => s.setAttendance)
  const setFarmAssignment = useFarmStore((s) => s.setFarmAssignment)
  const selectAllWorkersForDate = useFarmStore((s) => s.selectAllWorkersForDate)

  const activeWorkers = useMemo(() => {
    let list = workers.filter((w) => w.status !== 'inactive')
    if (selectedWorkerIds.length === 0 && list.length > 0) {
      return list
    }
    if (selectedWorkerIds.length > 0) {
      list = list.filter((w) => selectedWorkerIds.includes(w.id))
    }
    if (search) {
      list = list.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [workers, selectedWorkerIds, search])

  const getTrees = (workerId: string) => {
    const record = dailyRecords.find(
      (r) => r.workerId === workerId && r.date === date && !r.farmId
    )
    return record?.treeCount ?? 0
  }

  const getStatus = (workerId: string): AttendanceStatus =>
    attendance[workerId] ?? 'present'

  const getFarmId = (workerId: string) =>
    farmAssignments[workerId]?.[0] ?? farms[0]?.id ?? ''

  const totals = useMemo(() => {
    let trees = 0
    for (const w of activeWorkers) {
      if (getStatus(w.id) === 'present') trees += getTrees(w.id)
    }
    return {
      workers: activeWorkers.length,
      trees,
      salary: calcNetSalary(trees, settings),
    }
  }, [activeWorkers, dailyRecords, date, attendance, settings])

  const handleSave = () => {
    toast({
      title: 'Daily entry saved',
      description: `${totals.trees} trees recorded for ${date}`,
    })
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-28">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Bulk Daily Entry</h1>
          <p className="text-muted-foreground">Fast operational data entry</p>
        </div>
        <Link href="/daily-entry" className="text-sm text-primary hover:underline">
          ← Daily entry hub
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Calendar className="size-4 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          />
        </div>
        <Select value={farmFilter} onValueChange={setFarmFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Farm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All farms</SelectItem>
            {farms.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => selectAllWorkersForDate(date)}>
          Select all
        </Button>
      </div>

      <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/40 sticky top-0">
            <tr>
              {['Worker', 'Farm', 'Trees', 'Status', 'Notes'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeWorkers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  No workers.{' '}
                  <Link href="/workers/new" className="text-primary underline">
                    Add workers
                  </Link>{' '}
                  or use{' '}
                  <Link href="/daily-entry" className="text-primary underline">
                    daily hub
                  </Link>{' '}
                  to select muster.
                </td>
              </tr>
            ) : (
              activeWorkers.map((w) => (
                <EntryRow
                  key={w.id}
                  name={w.name}
                  farmId={getFarmId(w.id)}
                  farms={farms}
                  trees={getTrees(w.id)}
                  status={getStatus(w.id)}
                  onFarmChange={(fid) => setFarmAssignment(w.id, date, [fid])}
                  onTreesChange={(n) => updateTreeCount(w.id, date, n)}
                  onStatusChange={(s) => setAttendance(w.id, date, s)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {activeWorkers.map((w) => (
          <div key={w.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
            <p className="font-semibold">{w.name}</p>
            <Select
              value={getFarmId(w.id)}
              onValueChange={(fid) => setFarmAssignment(w.id, date, [fid])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {farms.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              placeholder="Trees climbed"
              value={getTrees(w.id) || ''}
              onChange={(e) =>
                updateTreeCount(w.id, date, parseInt(e.target.value, 10) || 0)
              }
            />
            <Select
              value={getStatus(w.id)}
              onValueChange={(s) =>
                setAttendance(w.id, date, s as AttendanceStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-8 lg:w-auto z-30">
        <div className="bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center gap-4 max-w-3xl lg:ml-auto">
          <div className="flex gap-6 text-sm flex-1">
            <span>
              <strong>{totals.workers}</strong> workers
            </span>
            <span>
              <strong>{totals.trees}</strong> trees
            </span>
            <span>
              Est. <strong>₹{Math.round(totals.salary).toLocaleString()}</strong>
            </span>
          </div>
          <Button onClick={handleSave} className="w-full sm:w-auto shadow-lg">
            <Save className="size-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  )
}

function EntryRow({
  name,
  farmId,
  farms,
  trees,
  status,
  onFarmChange,
  onTreesChange,
  onStatusChange,
}: {
  name: string
  farmId: string
  farms: { id: string; name: string }[]
  trees: number
  status: AttendanceStatus
  onFarmChange: (id: string) => void
  onTreesChange: (n: number) => void
  onStatusChange: (s: AttendanceStatus) => void
}) {
  const statusColors = {
    present: 'text-success border-success/30 bg-success/5',
    absent: 'text-destructive border-destructive/30 bg-destructive/5',
    leave: 'text-warning border-warning/30 bg-warning/5',
  }

  return (
    <tr className="border-t border-border hover:bg-muted/20">
      <td className="py-3 px-4 font-medium">{name}</td>
      <td className="py-3 px-4">
        <Select value={farmId} onValueChange={onFarmChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {farms.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="py-3 px-4">
        <Input
          type="number"
          min={0}
          className="w-24 h-9"
          value={trees || ''}
          onChange={(e) => onTreesChange(parseInt(e.target.value, 10) || 0)}
          disabled={status !== 'present'}
        />
      </td>
      <td className="py-3 px-4">
        <Select value={status} onValueChange={(v) => onStatusChange(v as AttendanceStatus)}>
          <SelectTrigger className={`h-9 w-[120px] ${statusColors[status]}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="leave">Leave</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="py-3 px-4 text-muted-foreground text-sm">—</td>
    </tr>
  )
}

