import { create } from 'zustand'
import type {
  AttendanceStatus,
  DailyRecord,
  Farm,
  FarmBackupV1,
  Settings,
  Worker,
} from './types'

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
  isHydrated: boolean
  isSyncing: boolean
  lastError: string | null

  importFromBackup: (backup: FarmBackupV1) => void
  setHydrated: (v: boolean) => void
  setSyncing: (v: boolean) => void
  setLastError: (msg: string | null) => void
  updateTreeCount: (
    workerId: string,
    date: string,
    count: number,
    farmId?: string
  ) => void
  addWorker: (worker: Omit<Worker, 'id'> & { name: string }) => string
  updateWorker: (id: string, partial: Partial<Worker>) => void
  updateSettings: (partial: Partial<Settings>) => void
  selectWorkerForDate: (workerId: string, date: string) => void
  unselectWorkerForDate: (workerId: string, date: string) => void
  selectAllWorkersForDate: (date: string) => void
  setAttendance: (workerId: string, date: string, status: AttendanceStatus) => void
  toBackup: () => FarmBackupV1
}

export const useFarmStore = create<FarmStore>((set, get) => ({
  workers: [],
  farms: DEFAULT_FARMS,
  dailyRecords: [],
  settings: { ratePerTree: 25, pfPerTree: 2 },
  selectedWorkerIds: {},
  attendance: {},
  farmAssignments: {},
  isHydrated: false,
  isSyncing: false,
  lastError: null,

  setHydrated: (v) => set({ isHydrated: v }),
  setSyncing: (v) => set({ isSyncing: v }),
  setLastError: (msg) => set({ lastError: msg }),

  importFromBackup: (backup) => {
    set({
      workers: backup.workers,
      dailyRecords: backup.dailyRecords,
      selectedWorkerIds: backup.selectedWorkerIds,
      farms: backup.farms?.length ? backup.farms : DEFAULT_FARMS,
      attendance: backup.attendance ?? {},
      farmAssignments: backup.farmAssignments ?? {},
      settings: backup.settings,
    })
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
      workers: state.workers.map((w) => (w.id === id ? { ...w, ...partial } : w)),
    }))
  },

  updateSettings: (partial) => {
    set((state) => ({
      settings: { ...state.settings, ...partial },
    }))
  },

  selectWorkerForDate: (workerId, date) => {
    set((state) => {
      const current = state.selectedWorkerIds[date] || []
      if (current.includes(workerId)) return state
      return {
        selectedWorkerIds: {
          ...state.selectedWorkerIds,
          [date]: [...current, workerId],
        },
      }
    })
  },

  unselectWorkerForDate: (workerId, date) => {
    set((state) => ({
      selectedWorkerIds: {
        ...state.selectedWorkerIds,
        [date]: (state.selectedWorkerIds[date] || []).filter((id) => id !== workerId),
      },
    }))
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

  setAttendance: (workerId, date, status) => {
    set((state) => {
      const day = state.attendance[date] || {}
      return {
        attendance: {
          ...state.attendance,
          [date]: { ...day, [workerId]: status },
        },
      }
    })
  },

  toBackup: () => {
    const s = get()
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      workers: s.workers,
      dailyRecords: s.dailyRecords,
      selectedWorkerIds: s.selectedWorkerIds,
      settings: s.settings,
      farms: s.farms,
      attendance: s.attendance,
      farmAssignments: s.farmAssignments,
    }
  },
}))
