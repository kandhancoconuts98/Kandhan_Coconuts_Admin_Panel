import { create } from 'zustand'
import { farmBackupSignature, farmStateSignature } from '@/lib/farm-signature'

export type WorkerStatus = 'active' | 'inactive' | 'leave'
export type WorkerType = 'plucker' | 'general'
export type AttendanceStatus = 'present' | 'absent' | 'leave'

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
  settings: { ratePerTree: number; pfPerTree: number }
  farms?: Farm[]
  attendance?: Record<string, Record<string, AttendanceStatus>>
  farmAssignments?: Record<string, Record<string, string[]>>
  salaryRuleHistory?: SalaryRuleHistory[]
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
      settings: { ratePerTree: 25, pfPerTree: 2 },
      selectedWorkerIds: {},
      attendance: {},
      farmAssignments: {},
      salaryRuleHistory: [],

      addWorker: (worker) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        set((state) => ({
          workers: [
            ...state.workers,
            {
              id,
              status: 'active',
              workerType: 'plucker',
              ...worker,
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
              workerType: 'plucker',
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
            merged.pfPerTree === state.settings.pfPerTree
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
          const nextSettings = {
            ratePerTree: backup.settings.ratePerTree,
            pfPerTree: backup.settings.pfPerTree,
          }
          const nextFarms = backup.farms?.length ? backup.farms : state.farms
          const nextAttendance = backup.attendance ?? state.attendance
          const nextFarmAssignments =
            backup.farmAssignments ?? state.farmAssignments
          const nextHistory =
            backup.salaryRuleHistory ?? state.salaryRuleHistory

          const incomingSig = farmBackupSignature({
            version: 1,
            updatedAt: backup.updatedAt,
            workers: backup.workers,
            dailyRecords: backup.dailyRecords,
            selectedWorkerIds: backup.selectedWorkerIds,
            settings: nextSettings,
            farms: nextFarms,
            attendance: nextAttendance,
            farmAssignments: nextFarmAssignments,
            salaryRuleHistory: nextHistory,
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
          })
          if (incomingSig === currentSig) return state

          return {
            workers: backup.workers,
            dailyRecords: backup.dailyRecords,
            selectedWorkerIds: backup.selectedWorkerIds,
            farms: nextFarms,
            attendance: nextAttendance,
            farmAssignments: nextFarmAssignments,
            salaryRuleHistory: nextHistory,
            settings: nextSettings,
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
