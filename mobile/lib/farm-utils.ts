import { format, startOfWeek, endOfWeek } from 'date-fns'
import type { AttendanceStatus, DailyRecord, Settings, Worker } from './types'

export function getWeekRange(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return {
    from: format(start, 'yyyy-MM-dd'),
    to: format(end, 'yyyy-MM-dd'),
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
