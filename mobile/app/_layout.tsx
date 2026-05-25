import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { AuthProvider } from '@/lib/auth'
import { FarmDataProvider } from '@/components/FarmDataProvider'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <AuthProvider>
      <FarmDataProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerTintColor: '#fff', headerStyle: { backgroundColor: '#2E7D32' } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="worker/[id]" options={{ title: 'Worker' }} />
          <Stack.Screen name="worker/new" options={{ title: 'Add worker' }} />
          <Stack.Screen name="farm/[id]" options={{ title: 'Farm' }} />
          <Stack.Screen name="daily/bulk" options={{ title: 'Bulk entry' }} />
          <Stack.Screen name="daily/muster" options={{ title: 'Muster roll' }} />
        </Stack>
      </FarmDataProvider>
    </AuthProvider>
  )
}
