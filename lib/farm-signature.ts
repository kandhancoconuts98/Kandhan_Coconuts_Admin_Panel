import type { FarmBackupV1 } from '@/lib/store'

export function farmStateSignature(state: {
  workers: FarmBackupV1['workers']
  dailyRecords: FarmBackupV1['dailyRecords']
  selectedWorkerIds: FarmBackupV1['selectedWorkerIds']
  settings: FarmBackupV1['settings']
  farms?: FarmBackupV1['farms']
  attendance?: FarmBackupV1['attendance']
  farmAssignments?: FarmBackupV1['farmAssignments']
  salaryRuleHistory?: FarmBackupV1['salaryRuleHistory']
}): string {
  return JSON.stringify({
    workers: state.workers,
    dailyRecords: state.dailyRecords,
    selectedWorkerIds: state.selectedWorkerIds,
    settings: state.settings,
    farms: state.farms,
    attendance: state.attendance,
    farmAssignments: state.farmAssignments,
    salaryRuleHistory: state.salaryRuleHistory,
  })
}

export function farmBackupSignature(backup: FarmBackupV1): string {
  return farmStateSignature(backup)
}
