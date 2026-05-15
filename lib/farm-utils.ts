import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
} from 'date-fns'
import type { DailyRecord, Farm, Settings, Worker } from '@/lib/store'

export type AttendanceStatus = 'present' | 'absent' | 'leave'

export function getWeekRange(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return {
    from: format(start, 'yyyy-MM-dd'),
    to: format(end, 'yyyy-MM-dd'),
  }
}

export function getMonthRange(date = new Date()) {
  return {
    from: format(startOfMonth(date), 'yyyy-MM-dd'),
    to: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export function sumTreesForWorker(
  workerId: string,
  records: DailyRecord[],
  from: string,
  to: string
) {
  return records
    .filter(
      (r) =>
        r.workerId === workerId && r.date >= from && r.date <= to && r.treeCount > 0
    )
    .reduce((sum, r) => sum + r.treeCount, 0)
}

export function calcNetSalary(trees: number, settings: Settings) {
  return trees * (settings.ratePerTree - settings.pfPerTree)
}

export function calcGrossSalary(trees: number, settings: Settings) {
  return trees * settings.ratePerTree
}

export function calcPf(trees: number, settings: Settings) {
  return trees * settings.pfPerTree
}

export function getWorkerWeeklyStats(
  workerId: string,
  records: DailyRecord[],
  settings: Settings,
  date = new Date()
) {
  const { from, to } = getWeekRange(date)
  const trees = sumTreesForWorker(workerId, records, from, to)
  return {
    trees,
    gross: calcGrossSalary(trees, settings),
    net: calcNetSalary(trees, settings),
    pf: calcPf(trees, settings),
  }
}

export function getDashboardMetrics(
  workers: Worker[],
  records: DailyRecord[],
  attendance: Record<string, Record<string, AttendanceStatus>>,
  settings: Settings,
  date = new Date()
) {
  const { from, to } = getWeekRange(date)
  const weekRecords = records.filter((r) => r.date >= from && r.date <= to)
  const totalTrees = weekRecords.reduce((s, r) => s + r.treeCount, 0)
  const totalNet = weekRecords.reduce(
    (s, r) => s + calcNetSalary(r.treeCount, settings),
    0
  )

  const today = format(date, 'yyyy-MM-dd')
  const todayAttendance = attendance[today] ?? {}
  const absentToday = workers.filter(
    (w) => todayAttendance[w.id] === 'absent' || todayAttendance[w.id] === 'leave'
  ).length

  return {
    totalWorkers: workers.filter((w) => w.status !== 'inactive').length,
    totalTrees,
    weeklySalary: totalNet,
    absentWorkers: absentToday,
  }
}

export function getWeeklyChartData(records: DailyRecord[], date = new Date()) {
  const { from, to } = getWeekRange(date)
  const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) })
  return days.map((day) => {
    const d = format(day, 'yyyy-MM-dd')
    const dayRecords = records.filter((r) => r.date === d)
    const trees = dayRecords.reduce((s, r) => s + r.treeCount, 0)
    return {
      day: format(day, 'EEE'),
      trees,
      salary: dayRecords.reduce((s, r) => s + r.treeCount * 6, 0),
    }
  })
}

export function getFarmSalaryDistribution(
  farms: Farm[],
  records: DailyRecord[],
  farmAssignments: Record<string, Record<string, string[]>>,
  settings: Settings,
  date = new Date()
) {
  const { from, to } = getWeekRange(date)
  const weekRecords = records.filter((r) => r.date >= from && r.date <= to)

  return farms.map((farm) => {
    let trees = 0
    for (const record of weekRecords) {
      const dayAssign = farmAssignments[record.date]?.[record.workerId]
      if (dayAssign?.includes(farm.id)) {
        trees += record.treeCount
      }
    }
    if (trees === 0 && farms.length === 1) {
      trees = weekRecords.reduce((s, r) => s + r.treeCount, 0)
    }
    return {
      name: farm.name,
      value: calcGrossSalary(trees, settings),
    }
  })
}

export function getRecentActivity(
  workers: Worker[],
  records: DailyRecord[],
  farms: Farm[],
  farmAssignments: Record<string, Record<string, string[]>>,
  limit = 5
) {
  const sorted = [...records]
    .filter((r) => r.treeCount > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)

  return sorted.map((r) => {
    const worker = workers.find((w) => w.id === r.workerId)
    const farmIds = farmAssignments[r.date]?.[r.workerId]
    const farm = farmIds?.length
      ? farms.find((f) => f.id === farmIds[0])
      : farms[0]
    return {
      worker: worker?.name ?? 'Unknown',
      farm: farm?.name ?? '—',
      trees: r.treeCount,
      status: 'completed' as const,
      time: r.date,
    }
  })
}
