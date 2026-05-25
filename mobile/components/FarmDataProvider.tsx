import { useEffect, useRef } from 'react'
import { useFarmStore } from '@/lib/store'
import { loadFarmState, saveFarmState } from '@/lib/api'
import { useAuth } from '@/lib/auth'

let saveTimer: ReturnType<typeof setTimeout> | null = null

export function FarmDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady } = useAuth()
  const loaded = useRef(false)
  const lastSig = useRef('')

  useEffect(() => {
    if (!isReady || !isAuthenticated) return

    let cancelled = false
    const hydrate = async () => {
      useFarmStore.getState().setLastError(null)
      try {
        const state = await loadFarmState()
        if (cancelled) return
        useFarmStore.getState().importFromBackup(state)
        lastSig.current = JSON.stringify(state.workers.length)
        loaded.current = true
      } catch (e) {
        if (!cancelled) {
          useFarmStore
            .getState()
            .setLastError(e instanceof Error ? e.message : 'Load failed')
        }
      } finally {
        if (!cancelled) useFarmStore.getState().setHydrated(true)
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [isReady, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    const unsub = useFarmStore.subscribe((state) => {
      if (!loaded.current || !state.isHydrated) return

      const sig = JSON.stringify({
        w: state.workers.length,
        r: state.dailyRecords.length,
        s: state.settings,
      })
      if (sig === lastSig.current) return

      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(async () => {
        useFarmStore.getState().setSyncing(true)
        try {
          await saveFarmState(useFarmStore.getState().toBackup())
          lastSig.current = sig
          useFarmStore.getState().setLastError(null)
        } catch (e) {
          useFarmStore
            .getState()
            .setLastError(e instanceof Error ? e.message : 'Save failed')
        } finally {
          useFarmStore.getState().setSyncing(false)
        }
      }, 900)
    })

    return () => {
      if (saveTimer) clearTimeout(saveTimer)
      unsub()
    }
  }, [isAuthenticated])

  return <>{children}</>
}
