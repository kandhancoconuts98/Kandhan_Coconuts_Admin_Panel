import { NextResponse } from 'next/server'
import { loadFarmState, saveFarmState } from '@/lib/server/farm-db'
import { getOrgId } from '@/lib/server/org-id'
import type { FarmBackupV1 } from '@/lib/store'

export const runtime = 'nodejs'

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function isBackupV1(x: unknown): x is FarmBackupV1 {
  if (!x || typeof x !== 'object') return false
  const b = x as FarmBackupV1
  return (
    b.version === 1 &&
    typeof b.updatedAt === 'string' &&
    Array.isArray(b.workers) &&
    Array.isArray(b.dailyRecords) &&
    typeof b.selectedWorkerIds === 'object' &&
    typeof b.settings === 'object'
  )
}

export async function GET() {
  try {
    const orgId = getOrgId()
    const state = await loadFarmState(orgId)
    return NextResponse.json({ ok: true, backup: state })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return jsonError(msg, 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      backup?: unknown
    }
    const orgId = getOrgId()
    if (!isBackupV1(body.backup)) return jsonError('Invalid backup', 400)

    await saveFarmState(body.backup, orgId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return jsonError(msg, 500)
  }
}

