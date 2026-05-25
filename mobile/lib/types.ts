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

export interface FarmBackupV1 {
  version: 1
  updatedAt: string
  workers: Worker[]
  dailyRecords: DailyRecord[]
  selectedWorkerIds: Record<string, string[]>
  settings: Settings
  farms?: Farm[]
  attendance?: Record<string, Record<string, AttendanceStatus>>
  farmAssignments?: Record<string, Record<string, string[]>>
  salaryRuleHistory?: SalaryRuleHistory[]
}

export const EMPTY_SELECTED_WORKER_IDS: string[] = []
export const EMPTY_ATTENDANCE_DAY: Record<string, AttendanceStatus> = {}
