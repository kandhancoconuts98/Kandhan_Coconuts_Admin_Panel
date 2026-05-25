import { NextResponse } from 'next/server'
import { loadFarmState, saveFarmState } from '@/lib/server/farm-db'
import { getOrgId } from '@/lib/server/org-id'
import type { FarmBackupV1 } from '@/lib/store'

export async function GET() {
  try {
    const orgId = getOrgId()
    const state = await loadFarmState(orgId)
    return NextResponse.json({ ok: true, orgId, state })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load farm data'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const orgId = getOrgId()
    const body = (await request.json()) as { state?: FarmBackupV1 }
    if (!body.state || body.state.version !== 1) {
      return NextResponse.json(
        { ok: false, error: 'Invalid farm state payload' },
        { status: 400 }
      )
    }
    await saveFarmState(body.state, orgId)
    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to save farm data'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
