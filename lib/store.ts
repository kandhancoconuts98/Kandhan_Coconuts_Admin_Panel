import { create } from 'zustand'
import { farmBackupSignature, farmStateSignature } from '@/lib/farm-signature'
import { defaultSettings, normalizeLoadTrips, normalizeWorkers } from '@/lib/operations-utils'
import { normalizeWorkerType } from '@/lib/worker-types'

export type WorkerStatus = 'active' | 'inactive' | 'leave'
export type WorkerType = 'climber' | 'loader'
export type AttendanceStatus = 'present' | 'absent' | 'leave'

export interface DailyAdvance {
  date: string
  workerId: string
  amount: number
}

export interface LoadTrip {
  id: string
  date: string
  vehicleNumber: string
  loadCount: number
  dieselAmount: number
  workerIds: string[]
  /** Per-worker advance on this trip (optional) */
  workerAdvances: Record<string, number>
}

export interface DailyLoadLog {
  date: string
  notes?: string
}

export interface SalaryPayment {
  workerId: string
  periodFrom: string
  periodTo: string
  paidAmount: number
  deductAdvance?: boolean
}

export interface Worker {
  id: string
  name: string
  phone?: string
  workerType?: WorkerType
  status?: WorkerStatus
  joiningDate?: string
  salaryCategory?: string
  village?: string
  district?: string
  address?: string
  notes?: string
  assignedFarmIds?: string[]
}

export interface Farm {
  id: string
  name: string
  location: string
  treeCount: number
  imageUrl?: string
}

export interface DailyRecord {
  date: string
  workerId: string
  treeCount: number
  farmId?: string
  notes?: string
}

export interface Settings {
  ratePerTree: number
  pfPerTree: number
  ratePerLoad: number
  pfPerLoad: number
}

export interface SalaryRuleHistory {
  id: string
  ratePerTree: number
  pfPerTree: number
  effectiveDate: string
  changedAt: string
}

/** Stable fallbacks for `useFarmStore` selectors (never inline `|| []` / `?? {}`) */
export const EMPTY_SELECTED_WORKER_IDS: string[] = []
export const EMPTY_FARM_IDS: string[] = []
export const EMPTY_ATTENDANCE_DAY: Record<string, AttendanceStatus> = {}
export const EMPTY_FARM_ASSIGNMENTS_DAY: Record<string, string[]> = {}

export interface FarmBackupV1 {
  version: 1
  updatedAt: string
  workers: Worker[]
  dailyRecords: DailyRecord[]
  selectedWorkerIds: Record<string, string[]>
  settings: { ratePerTree: number; pfPerTree: number; ratePerLoad?: number; pfPerLoad?: number }
  farms?: Farm[]
  attendance?: Record<string, Record<string, AttendanceStatus>>
  farmAssignments?: Record<string, Record<string, string[]>>
  salaryRuleHistory?: SalaryRuleHistory[]
  dailyAdvances?: DailyAdvance[]
  loadTrips?: LoadTrip[]
  dailyLoadLogs?: DailyLoadLog[]
  salaryPayments?: SalaryPayment[]
}

const DEFAULT_FARMS: Farm[] = [
  { id: 'farm-a', name: 'Farm A', location: 'North Block', treeCount: 450 },
  { id: 'farm-b', name: 'Farm B', location: 'East Grove', treeCount: 320 },
  { id: 'farm-c', name: 'Farm C', location: 'South Field', treeCount: 580 },
  { id: 'farm-d', name: 'Farm D', location: 'West Palm', treeCount: 410 },
]

interface FarmStore {
  workers: Worker[]
  farms: Farm[]
  dailyRecords: DailyRecord[]
  settings: Settings
  selectedWorkerIds: Record<string, string[]>
  attendance: Record<string, Record<string, AttendanceStatus>>
  farmAssignments: Record<string, Record<string, string[]>>
  salaryRuleHistory: SalaryRuleHistory[]
  dailyAdvances: DailyAdvance[]
  loadTrips: LoadTrip[]
  dailyLoadLogs: DailyLoadLog[]
  salaryPayments: SalaryPayment[]

  addWorker: (worker: Omit<Worker, 'id'> & { name: string }) => string
  updateWorker: (id: string, partial: Partial<Worker>) => void
  importWorkerNames: (names: string[]) => void
  removeWorker: (id: string) => void
  addFarm: (farm: Omit<Farm, 'id'>) => string
  updateFarm: (id: string, partial: Partial<Farm>) => void
  removeFarm: (id: string) => void
  selectWorkerForDate: (workerId: string, date: string) => void
  unselectWorkerForDate: (workerId: string, date: string) => void
  selectAllWorkersForDate: (date: string) => void
  unselectAllWorkersForDate: (date: string) => void
  updateTreeCount: (workerId: string, date: string, count: number, farmId?: string) => void
  setDailyAdvance: (workerId: string, date: string, amount: number) => void
  adjustDailyAdvance: (workerId: string, date: string, delta: number) => void
  setSalaryPayment: (
    workerId: string,
    periodFrom: string,
    periodTo: string,
    partial: { paidAmount?: number; deductAdvance?: boolean }
  ) => void
  addLoadTrip: (trip: Omit<LoadTrip, 'id'>) => string
  updateLoadTrip: (id: string, partial: Partial<Omit<LoadTrip, 'id'>>) => void
  removeLoadTrip: (id: string) => void
  setDailyLoadLog: (date: string, partial: Partial<Omit<DailyLoadLog, 'date'>>) => void
  setAttendance: (workerId: string, date: string, status: AttendanceStatus) => void
  setFarmAssignment: (workerId: string, date: string, farmIds: string[]) => void
  updateSettings: (partial: Partial<Settings>) => void
  importFromBackup: (backup: FarmBackupV1) => void
  getWorkersForDate: (date: string) => Worker[]
  getRecordsForDateRange: (from: string, to: string) => DailyRecord[]
}

export const useFarmStore = create<FarmStore>()((set, get) => ({
      workers: [],
      farms: DEFAULT_FARMS,
      dailyRecords: [],
      settings: defaultSettings(),
      selectedWorkerIds: {},
      attendance: {},
      farmAssignments: {},
      salaryRuleHistory: [],
      dailyAdvances: [],
      loadTrips: [],
      dailyLoadLogs: [],
      salaryPayments: [],

      addWorker: (worker) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        set((state) => ({
          workers: [
            ...state.workers,
            {
              id,
              status: 'active',
              ...worker,
              workerType: normalizeWorkerType(worker.workerType ?? 'climber'),
            },
          ],
        }))
        return id
      },

      updateWorker: (id, partial) => {
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === id ? { ...w, ...partial } : w
          ),
        }))
      },

      importWorkerNames: (names) => {
        set((state) => {
          const existingLower = new Set(
            state.workers.map((w) => w.name.toLowerCase())
          )
          const additions: Worker[] = []
          for (const raw of names) {
            const name = raw.trim()
            if (!name) continue
            const lower = name.toLowerCase()
            if (existingLower.has(lower)) continue
            existingLower.add(lower)
            additions.push({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              name,
              status: 'active',
              workerType: 'climber',
            })
          }
          if (additions.length === 0) return state
          return { workers: [...state.workers, ...additions] }
        })
      },

      removeWorker: (id) => {
        set((state) => {
          const nextSelected: Record<string, string[]> = {}
          for (const [date, ids] of Object.entries(state.selectedWorkerIds)) {
            const filtered = ids.filter((x) => x !== id)
            if (filtered.length) nextSelected[date] = filtered
          }
          const nextAttendance: Record<string, Record<string, AttendanceStatus>> = {}
          for (const [date, map] of Object.entries(state.attendance)) {
            const { [id]: _, ...rest } = map
            if (Object.keys(rest).length) nextAttendance[date] = rest
          }
          const nextAssignments: Record<string, Record<string, string[]>> = {}
          for (const [date, map] of Object.entries(state.farmAssignments)) {
            const { [id]: _, ...rest } = map
            if (Object.keys(rest).length) nextAssignments[date] = rest
          }
          return {
            workers: state.workers.filter((w) => w.id !== id),
            dailyRecords: state.dailyRecords.filter((r) => r.workerId !== id),
            dailyAdvances: state.dailyAdvances.filter((a) => a.workerId !== id),
            loadTrips: state.loadTrips.map((t) => ({
              ...t,
              workerIds: t.workerIds.filter((wid) => wid !== id),
              workerAdvances: Object.fromEntries(
                Object.entries(t.workerAdvances).filter(([wid]) => wid !== id)
              ),
            })),
            salaryPayments: state.salaryPayments.filter((p) => p.workerId !== id),
            selectedWorkerIds: nextSelected,
            attendance: nextAttendance,
            farmAssignments: nextAssignments,
          }
        })
      },

      addFarm: (farm) => {
        const id = `farm-${Date.now()}`
        set((state) => ({
          farms: [...state.farms, { ...farm, id }],
        }))
        return id
      },

      updateFarm: (id, partial) => {
        set((state) => ({
          farms: state.farms.map((f) => (f.id === id ? { ...f, ...partial } : f)),
        }))
      },

      removeFarm: (id) => {
        set((state) => ({
          farms: state.farms.filter((f) => f.id !== id),
          workers: state.workers.map((w) => ({
            ...w,
            assignedFarmIds: w.assignedFarmIds?.filter((fid) => fid !== id),
          })),
        }))
      },

      selectWorkerForDate: (workerId, date) => {
        set((state) => {
          const currentSelected = state.selectedWorkerIds[date] || []
          if (currentSelected.includes(workerId)) return state
          return {
            selectedWorkerIds: {
              ...state.selectedWorkerIds,
              [date]: [...currentSelected, workerId],
            },
          }
        })
      },

      unselectWorkerForDate: (workerId, date) => {
        set((state) => {
          const currentSelected = state.selectedWorkerIds[date] || []
          return {
            selectedWorkerIds: {
              ...state.selectedWorkerIds,
              [date]: currentSelected.filter((id) => id !== workerId),
            },
          }
        })
      },

      selectAllWorkersForDate: (date) => {
        set((state) => ({
          selectedWorkerIds: {
            ...state.selectedWorkerIds,
            [date]: state.workers
              .filter((w) => w.status !== 'inactive')
              .map((w) => w.id),
          },
        }))
      },

      unselectAllWorkersForDate: (date) => {
        set((state) => ({
          selectedWorkerIds: { ...state.selectedWorkerIds, [date]: [] },
        }))
      },

      updateTreeCount: (workerId, date, count, farmId) => {
        set((state) => {
          const existingIndex = state.dailyRecords.findIndex(
            (r) =>
              r.workerId === workerId &&
              r.date === date &&
              (farmId ? r.farmId === farmId : !r.farmId)
          )
          if (existingIndex >= 0) {
            const newRecords = [...state.dailyRecords]
            newRecords[existingIndex] = {
              ...newRecords[existingIndex],
              treeCount: count,
            }
            return { dailyRecords: newRecords }
          }
          return {
            dailyRecords: [
              ...state.dailyRecords,
              { date, workerId, treeCount: count, farmId },
            ],
          }
        })
      },

      setDailyAdvance: (workerId, date, amount) => {
        set((state) => {
          const rest = state.dailyAdvances.filter(
            (a) => !(a.workerId === workerId && a.date === date)
          )
          if (!amount || amount <= 0) {
            return { dailyAdvances: rest }
          }
          return {
            dailyAdvances: [...rest, { workerId, date, amount }],
          }
        })
      },

      adjustDailyAdvance: (workerId, date, delta) => {
        if (!delta) return
        set((state) => {
          const current =
            state.dailyAdvances.find(
              (a) => a.workerId === workerId && a.date === date
            )?.amount ?? 0
          const next = Math.max(0, current + delta)
          const rest = state.dailyAdvances.filter(
            (a) => !(a.workerId === workerId && a.date === date)
          )
          if (next <= 0) {
            return { dailyAdvances: rest }
          }
          return {
            dailyAdvances: [...rest, { workerId, date, amount: next }],
          }
        })
      },

      setSalaryPayment: (workerId, periodFrom, periodTo, partial) => {
        set((state) => {
          const existing = state.salaryPayments.find(
            (p) =>
              p.workerId === workerId &&
              p.periodFrom === periodFrom &&
              p.periodTo === periodTo
          )
          const paidAmount = partial.paidAmount ?? existing?.paidAmount ?? 0
          const deductAdvance =
            partial.deductAdvance ?? existing?.deductAdvance ?? false
          const rest = state.salaryPayments.filter(
            (p) =>
              !(
                p.workerId === workerId &&
                p.periodFrom === periodFrom &&
                p.periodTo === periodTo
              )
          )
          if (!paidAmount && !deductAdvance) {
            return { salaryPayments: rest }
          }
          return {
            salaryPayments: [
              ...rest,
              {
                workerId,
                periodFrom,
                periodTo,
                paidAmount,
                deductAdvance,
              },
            ],
          }
        })
      },

      addLoadTrip: (trip) => {
        const id = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        set((state) => ({
          loadTrips: [
            ...state.loadTrips,
            {
              ...trip,
              id,
              dieselAmount: trip.dieselAmount ?? 0,
              workerAdvances: trip.workerAdvances ?? {},
            },
          ],
        }))
        return id
      },

      updateLoadTrip: (id, partial) => {
        set((state) => ({
          loadTrips: state.loadTrips.map((t) =>
            t.id === id ? { ...t, ...partial } : t
          ),
        }))
      },

      removeLoadTrip: (id) => {
        set((state) => ({
          loadTrips: state.loadTrips.filter((t) => t.id !== id),
        }))
      },

      setDailyLoadLog: (date, partial) => {
        set((state) => {
          const existing = state.dailyLoadLogs.find((l) => l.date === date)
          const next: DailyLoadLog = {
            date,
            notes: partial.notes ?? existing?.notes,
          }
          const rest = state.dailyLoadLogs.filter((l) => l.date !== date)
          if (!next.notes) {
            return { dailyLoadLogs: rest }
          }
          return { dailyLoadLogs: [...rest, next] }
        })
      },

      setAttendance: (workerId, date, status) => {
        set((state) => {
          const day = state.attendance[date] ?? EMPTY_ATTENDANCE_DAY
          if (day[workerId] === status) return state
          return {
            attendance: {
              ...state.attendance,
              [date]: { ...day, [workerId]: status },
            },
          }
        })
      },

      setFarmAssignment: (workerId, date, farmIds) => {
        set((state) => {
          const day = state.farmAssignments[date] ?? EMPTY_FARM_ASSIGNMENTS_DAY
          const prev = day[workerId]
          if (
            prev &&
            prev.length === farmIds.length &&
            prev.every((id, i) => id === farmIds[i])
          ) {
            return state
          }
          return {
            farmAssignments: {
              ...state.farmAssignments,
              [date]: { ...day, [workerId]: farmIds },
            },
          }
        })
      },

      updateSettings: (partial) => {
        set((state) => {
          const merged: Settings = { ...state.settings, ...partial }
          if (
            merged.ratePerTree === state.settings.ratePerTree &&
            merged.pfPerTree === state.settings.pfPerTree &&
            merged.ratePerLoad === state.settings.ratePerLoad &&
            merged.pfPerLoad === state.settings.pfPerLoad
          ) {
            return state
          }
          const historyEntry: SalaryRuleHistory = {
            id: Date.now().toString(),
            ratePerTree: merged.ratePerTree,
            pfPerTree: merged.pfPerTree,
            effectiveDate: new Date().toISOString().split('T')[0],
            changedAt: new Date().toISOString(),
          }
          return {
            settings: merged,
            salaryRuleHistory: [historyEntry, ...state.salaryRuleHistory].slice(
              0,
              20
            ),
          }
        })
      },

      importFromBackup: (backup) => {
        set((state) => {
          const nextSettings = defaultSettings(backup.settings)
          const nextFarms = backup.farms?.length ? backup.farms : state.farms
          const nextAttendance = backup.attendance ?? state.attendance
          const nextFarmAssignments =
            backup.farmAssignments ?? state.farmAssignments
          const nextHistory =
            backup.salaryRuleHistory ?? state.salaryRuleHistory
          const nextWorkers = normalizeWorkers(backup.workers)
          const nextAdvances = backup.dailyAdvances ?? []
          const nextTrips = normalizeLoadTrips(backup.loadTrips ?? [])
          const nextLoadLogs = backup.dailyLoadLogs ?? []
          const nextSalaryPayments = backup.salaryPayments ?? []

          const incomingSig = farmBackupSignature({
            version: 1,
            updatedAt: backup.updatedAt,
            workers: nextWorkers,
            dailyRecords: backup.dailyRecords,
            selectedWorkerIds: backup.selectedWorkerIds,
            settings: nextSettings,
            farms: nextFarms,
            attendance: nextAttendance,
            farmAssignments: nextFarmAssignments,
            salaryRuleHistory: nextHistory,
            dailyAdvances: nextAdvances,
            loadTrips: nextTrips,
            dailyLoadLogs: nextLoadLogs,
            salaryPayments: nextSalaryPayments,
          })
          const currentSig = farmStateSignature({
            workers: state.workers,
            dailyRecords: state.dailyRecords,
            selectedWorkerIds: state.selectedWorkerIds,
            settings: state.settings,
            farms: state.farms,
            attendance: state.attendance,
            farmAssignments: state.farmAssignments,
            salaryRuleHistory: state.salaryRuleHistory,
            dailyAdvances: state.dailyAdvances,
            loadTrips: state.loadTrips,
            dailyLoadLogs: state.dailyLoadLogs,
            salaryPayments: state.salaryPayments,
          })
          if (incomingSig === currentSig) return state

          return {
            workers: nextWorkers,
            dailyRecords: backup.dailyRecords,
            selectedWorkerIds: backup.selectedWorkerIds,
            farms: nextFarms,
            attendance: nextAttendance,
            farmAssignments: nextFarmAssignments,
            salaryRuleHistory: nextHistory,
            settings: nextSettings,
            dailyAdvances: nextAdvances,
            loadTrips: nextTrips,
            dailyLoadLogs: nextLoadLogs,
            salaryPayments: nextSalaryPayments,
          }
        })
      },

      getWorkersForDate: (date) => {
        const state = get()
        const selectedIds = state.selectedWorkerIds[date] || []
        return state.workers.filter((w) => selectedIds.includes(w.id))
      },

      getRecordsForDateRange: (from, to) => {
        const state = get()
        return state.dailyRecords.filter((r) => r.date >= from && r.date <= to)
      },
}))
