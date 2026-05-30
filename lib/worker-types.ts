import type { WorkerType } from '@/lib/store'

/** Map legacy DB values to current worker types */
export function normalizeWorkerType(type?: string | null): WorkerType {
  if (type === 'loader' || type === 'general') return 'loader'
  return 'climber'
}

export function isClimber(type?: string | null): boolean {
  return normalizeWorkerType(type) === 'climber'
}

export function isLoader(type?: string | null): boolean {
  return normalizeWorkerType(type) === 'loader'
}

export function workerTypeLabel(type?: string | null): string {
  return isLoader(type) ? 'Loader' : 'Tree climber'
}

/** Persist climber/loader in DB worker_type column */
export function workerTypeToDb(type?: WorkerType): string {
  return type === 'loader' ? 'loader' : 'climber'
}
