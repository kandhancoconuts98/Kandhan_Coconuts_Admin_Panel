'use client'

import { useEffect } from 'react'
import { useFarmStore } from '@/lib/store'

export function StoreHydration() {
  useEffect(() => {
    void useFarmStore.persist.rehydrate()
  }, [])
  return null
}
