'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFarmStore, type FarmBackupV1 } from '@/lib/store'

function buildBackup(): FarmBackupV1 {
  const s = useFarmStore.getState()
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    workers: s.workers,
    dailyRecords: s.dailyRecords,
    selectedWorkerIds: s.selectedWorkerIds,
    settings: {
      ratePerTree: s.settings.ratePerTree,
      pfPerTree: s.settings.pfPerTree,
    },
  }
}

export function SupabaseAutoSync() {
  const importFromBackup = useFarmStore((st) => st.importFromBackup)
  const suppressNextSave = useRef(false)

  const enabled = useMemo(() => {
    // Only a UX hint; actual requirement is server env vars.
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch('/api/supabase/backup', { method: 'GET' })
        const data = (await res.json()) as {
          ok?: boolean
          backup?: FarmBackupV1
        }
        if (!res.ok || !data.backup) return
        if (cancelled) return
        suppressNextSave.current = true
        importFromBackup(data.backup)
      } catch {
        // ignore; offline / env not set / no row yet
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [importFromBackup])

  useEffect(() => {
    if (!enabled) return

    let timeout: number | null = null
    const unsub = useFarmStore.subscribe(() => {
      // Avoid instantly writing back the exact data we just loaded.
      if (suppressNextSave.current) {
        suppressNextSave.current = false
        return
      }
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(async () => {
        try {
          await fetch('/api/supabase/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ backup: buildBackup() }),
          })
        } catch {
          // ignore (offline)
        }
      }, 800)
    })

    return () => {
      if (timeout) window.clearTimeout(timeout)
      unsub()
    }
  }, [enabled])

  return null
}

