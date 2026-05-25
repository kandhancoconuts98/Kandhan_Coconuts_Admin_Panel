import type { FarmBackupV1 } from './types'

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '')

export function getApiBaseUrl(): string {
  return API_URL
}

export function isApiConfigured(): boolean {
  return API_URL.length > 0 && !API_URL.includes('YOUR-')
}

export async function loadFarmState(): Promise<FarmBackupV1> {
  if (!isApiConfigured()) {
    throw new Error(
      'Set EXPO_PUBLIC_API_URL in mobile/.env (your Next.js server, e.g. http://192.168.1.5:3000)'
    )
  }

  const res = await fetch(`${API_URL}/api/farm`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  const data = (await res.json()) as {
    ok?: boolean
    state?: FarmBackupV1
    error?: string
  }
  if (!res.ok || !data.state) {
    throw new Error(data.error ?? `Failed to load farm data (${res.status})`)
  }
  return data.state
}

export async function saveFarmState(state: FarmBackupV1): Promise<void> {
  if (!isApiConfigured()) return

  const res = await fetch(`${API_URL}/api/farm`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })
  const data = (await res.json()) as { ok?: boolean; error?: string }
  if (!res.ok) {
    throw new Error(data.error ?? `Failed to save (${res.status})`)
  }
}
