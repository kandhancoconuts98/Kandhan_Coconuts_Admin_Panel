'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useShallow } from 'zustand/react/shallow'
import { Calendar, Search, Save, TreePine } from 'lucide-react'
import {
  useFarmStore,
  EMPTY_ATTENDANCE_DAY,
  EMPTY_FARM_ASSIGNMENTS_DAY,
} from '@/lib/store'
import type { AttendanceStatus } from '@/lib/store'
import { calcNetSalary } from '@/lib/farm-utils'
import { isClimber } from '@/lib/worker-types'
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

export function ClimbersDailyEntry() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  const {
    workers,
    farms,
    settings,
    dailyRecords,
    attendance,
    farmAssignmentsDay,
  } = useFarmStore(
    useShallow((s) => ({
      workers: s.workers,
      farms: s.farms,
      settings: s.settings,
      dailyRecords: s.dailyRecords,
      attendance: s.attendance[date] ?? EMPTY_ATTENDANCE_DAY,
      farmAssignmentsDay: s.farmAssignments[date] ?? EMPTY_FARM_ASSIGNMENTS_DAY,
    }))
  )

  const updateTreeCount = useFarmStore((s) => s.updateTreeCount)
  const setAttendance = useFarmStore((s) => s.setAttendance)
  const setFarmAssignment = useFarmStore((s) => s.setFarmAssignment)

  const climbers = useMemo(() => {
    let list = workers.filter((w) => w.status !== 'inactive' && isClimber(w.workerType))
    if (search) {
      list = list.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()))
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [workers, search])

  const getTrees = (workerId: string) =>
    dailyRecords.find((r) => r.workerId === workerId && r.date === date && !r.farmId)
      ?.treeCount ?? 0

  const getFarmId = (workerId: string) =>
    farmAssignmentsDay[workerId]?.[0] ?? farms[0]?.id ?? ''

  const totals = useMemo(() => {
    let trees = 0
    for (const w of climbers) {
      if ((attendance[w.id] ?? 'present') === 'present') trees += getTrees(w.id)
    }
    return { trees, salary: calcNetSalary(trees, settings) }
  }, [climbers, dailyRecords, date, attendance, settings])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-28">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <TreePine className="size-5" />
            <span className="text-sm font-medium">Tree climbers</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold">Climbers daily entry</h1>
          <p className="text-muted-foreground">Trees climbed and attendance</p>
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
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search climbers..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              {['Climber', 'Farm', 'Trees', 'Status'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {climbers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-muted-foreground">
                  No tree climbers. Add workers with type &quot;Tree climber&quot;.
                </td>
              </tr>
            ) : (
              climbers.map((w) => (
                <tr key={w.id} className="border-t border-border hover:bg-muted/20">
                  <td className="py-3 px-4 font-medium">{w.name}</td>
                  <td className="py-3 px-4">
                    <Select
                      value={getFarmId(w.id)}
                      onValueChange={(fid) => setFarmAssignment(w.id, date, [fid])}
                    >
                      <SelectTrigger className="h-9 w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {farms.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      type="number"
                      min={0}
                      className="w-24 h-9"
                      placeholder="0"
                      value={getTrees(w.id) || ''}
                      onChange={(e) =>
                        updateTreeCount(w.id, date, parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={attendance[w.id] ?? 'present'}
                      onValueChange={(v) => setAttendance(w.id, date, v as AttendanceStatus)}
                    >
                      <SelectTrigger className="h-9 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Advances are recorded under Workers → Advances, not here.
      </p>

      <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-8 z-30">
        <div className="bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center gap-4 max-w-3xl lg:ml-auto">
          <div className="flex gap-6 text-sm flex-1">
            <span><strong>{totals.trees}</strong> trees</span>
            <span>Est. <strong>₹{Math.round(totals.salary).toLocaleString()}</strong></span>
          </div>
          <Button
            onClick={() =>
              toast({ title: 'Saved', description: `Climber entry saved for ${date}` })
            }
          >
            <Save className="size-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
