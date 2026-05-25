'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useFarmStore, type FarmBackupV1 } from '@/lib/store'
import { buildFarmBackup, farmBackupSignature } from '@/lib/farm-backup'

export function FarmDbSync() {
  const hydrated = useRef(false)
  const lastSavedSig = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch('/api/farm', { method: 'GET', cache: 'no-store' })
        const data = (await res.json()) as {
          ok?: boolean
          state?: FarmBackupV1
          error?: string
        }
        if (cancelled) return
        if (!res.ok) {
          toast.error(
            data.error?.includes('SUPABASE_SERVICE_ROLE_KEY')
              ? 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the dev server.'
              : data.error ?? 'Could not load farm data from the database.'
          )
          hydrated.current = true
          return
        }
        if (!data.state) return

        const sig = farmBackupSignature(data.state)
        lastSavedSig.current = sig
        useFarmStore.getState().importFromBackup(data.state)
        hydrated.current = true
      } catch {
        hydrated.current = true
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let timeout: number | null = null

    const unsub = useFarmStore.subscribe(() => {
      if (!hydrated.current) return

      const sig = farmBackupSignature(buildFarmBackup())
      if (sig === lastSavedSig.current) return

      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(async () => {
        const backup = buildFarmBackup()
        const nextSig = farmBackupSignature(backup)
        if (nextSig === lastSavedSig.current) return

        try {
          const res = await fetch('/api/farm', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: backup }),
          })
          if (res.ok) lastSavedSig.current = nextSig
        } catch {
          // offline
        }
      }, 800)
    })

    return () => {
      if (timeout) window.clearTimeout(timeout)
      unsub()
    }
  }, [])

  return null
}
