import type { FarmBackupV1 } from '@/lib/store'
import { useFarmStore } from '@/lib/store'
import { farmBackupSignature } from '@/lib/farm-signature'

export { farmBackupSignature }

export function buildFarmBackup(): FarmBackupV1 {
  const s = useFarmStore.getState()
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
    salaryRuleHistory: s.salaryRuleHistory,
    dailyAdvances: s.dailyAdvances,
    loadTrips: s.loadTrips,
    dailyLoadLogs: s.dailyLoadLogs,
    salaryPayments: s.salaryPayments,
  }
}
