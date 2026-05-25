import { Redirect } from 'expo-router'
import { useAuth } from '@/lib/auth'
import { Loading } from '@/components/ui'

export default function Index() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) return <Loading />

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/(tabs)" />
}
