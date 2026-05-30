import type {
  DailyAdvance,
  DailyLoadLog,
  FarmBackupV1,
  LoadTrip,
  SalaryPayment,
  Settings,
  Worker,
} from '@/lib/store'
import { normalizeWorkerType } from '@/lib/worker-types'

export function normalizeWorkers(workers: Worker[]): Worker[] {
  return workers.map((w) => ({
    ...w,
    workerType: normalizeWorkerType(w.workerType),
  }))
}

export function defaultSettings(partial?: Partial<Settings>): Settings {
  return {
    ratePerTree: partial?.ratePerTree ?? 25,
    pfPerTree: partial?.pfPerTree ?? 2,
    ratePerLoad: partial?.ratePerLoad ?? 0,
    pfPerLoad: partial?.pfPerLoad ?? 0,
  }
}

export function getAdvance(
  advances: DailyAdvance[],
  workerId: string,
  date: string
): number {
  return advances.find((a) => a.workerId === workerId && a.date === date)?.amount ?? 0
}

export function getLoadsForWorkerOnDate(
  trips: LoadTrip[],
  workerId: string,
  date: string
): number {
  return trips
    .filter((t) => t.date === date && t.workerIds.includes(workerId))
    .reduce((sum, t) => sum + t.loadCount, 0)
}

export function getDailyLoadTotals(trips: LoadTrip[], date: string) {
  const dayTrips = trips.filter((t) => t.date === date)
  return {
    trips: dayTrips.length,
    loads: dayTrips.reduce((s, t) => s + t.loadCount, 0),
    dieselAmount: dayTrips.reduce((s, t) => s + (t.dieselAmount ?? 0), 0),
  }
}

export function normalizeLoadTrip(trip: LoadTrip): LoadTrip {
  return {
    ...trip,
    dieselAmount: trip.dieselAmount ?? 0,
    workerAdvances: trip.workerAdvances ?? {},
  }
}

export function normalizeLoadTrips(trips: LoadTrip[]): LoadTrip[] {
  return trips.map(normalizeLoadTrip)
}

export function getAdvanceTotalForPeriod(
  advances: DailyAdvance[],
  workerId: string,
  from: string,
  to: string
): number {
  return advances
    .filter(
      (a) =>
        a.workerId === workerId && a.date >= from && a.date <= to && a.amount > 0
    )
    .reduce((sum, a) => sum + a.amount, 0)
}

export function getSalaryRecord(
  payments: SalaryPayment[],
  workerId: string,
  from: string,
  to: string
): SalaryPayment | undefined {
  return payments.find(
    (p) =>
      p.workerId === workerId && p.periodFrom === from && p.periodTo === to
  )
}

export function getSalaryPayment(
  payments: SalaryPayment[],
  workerId: string,
  from: string,
  to: string
): number {
  return getSalaryRecord(payments, workerId, from, to)?.paidAmount ?? 0
}

export function normalizeDailyLoadLog(
  log: DailyLoadLog & { dieselAmount?: number; dieselLiters?: number }
): DailyLoadLog {
  return {
    date: log.date,
    notes: log.notes,
  }
}

export function normalizeDailyLoadLogs(
  logs: (DailyLoadLog & { dieselAmount?: number; dieselLiters?: number })[]
): DailyLoadLog[] {
  return logs.map(normalizeDailyLoadLog)
}

export function buildExtendedBackupSlice(data: FarmBackupV1) {
  return {
    dailyAdvances: data.dailyAdvances ?? [],
    loadTrips: data.loadTrips ?? [],
    dailyLoadLogs: data.dailyLoadLogs ?? [],
    salaryPayments: data.salaryPayments ?? [],
    settings: data.settings,
  }
}
