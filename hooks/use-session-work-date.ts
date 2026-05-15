'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'

const HOUR_MS = 60 * 60 * 1000

/**
 * Keeps the selected work date in sync when the calendar day rolls while the
 * user had "today" selected (e.g. app left open past midnight).
 */
export function useSessionWorkDate(initial?: Date) {
  const [date, setDateInternal] = useState<Date>(() => initial ?? new Date())
  const naturalTodayRef = useRef(format(initial ?? new Date(), 'yyyy-MM-dd'))

  const setDate = (d: Date) => {
    setDateInternal(d)
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    if (format(d, 'yyyy-MM-dd') === todayStr) {
      naturalTodayRef.current = todayStr
    }
  }

  useEffect(() => {
    const tick = () => {
      const nowStr = format(new Date(), 'yyyy-MM-dd')
      if (nowStr !== naturalTodayRef.current) {
        const selStr = format(date, 'yyyy-MM-dd')
        if (selStr === naturalTodayRef.current) {
          setDateInternal(new Date())
        }
        naturalTodayRef.current = nowStr
      }
    }
    tick()
    const id = setInterval(tick, HOUR_MS)
    const onVis = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [date])

  return [date, setDate] as const
}
