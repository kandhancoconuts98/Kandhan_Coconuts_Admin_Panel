import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/server/supabase'
import type { FarmBackupV1 } from '@/lib/store'

export const runtime = 'nodejs'

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function getFarmId() {
  const farmId = (process.env.COCONEST_FARM_ID ?? '').trim()
  if (!farmId) {
    throw new Error('Missing COCONEST_FARM_ID env var')
  }
  return farmId
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

export async function GET(request: Request) {
  try {
    const farmId = getFarmId()

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('farm_backups')
      .select('data')
      .eq('farm_id', farmId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data?.data) return jsonError('No backup found for this farmId', 404)

    return NextResponse.json({ ok: true, backup: data.data })
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
    const farmId = getFarmId()
    if (!isBackupV1(body.backup)) return jsonError('Invalid backup', 400)

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('farm_backups').upsert({
      farm_id: farmId,
      data: body.backup,
      updated_at: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return jsonError(msg, 500)
  }
}

