import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import { getApiBaseUrl, isApiConfigured } from '@/lib/api'
import { Button, Card, Input, Loading, Screen, Subtitle, Title } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function SettingsScreen() {
  const settings = useFarmStore((s) => s.settings)
  const updateSettings = useFarmStore((s) => s.updateSettings)
  const isHydrated = useFarmStore((s) => s.isHydrated)
  const { logout } = useAuth()
  const [rate, setRate] = useState(String(settings.ratePerTree))
  const [pf, setPf] = useState(String(settings.pfPerTree))

  if (!isHydrated) return <Loading />

  const saveRates = () => {
    const ratePerTree = Number(rate)
    const pfPerTree = Number(pf)
    if (Number.isNaN(ratePerTree) || Number.isNaN(pfPerTree)) {
      Alert.alert('Invalid values', 'Enter valid numbers for rate and PF.')
      return
    }
    updateSettings({ ratePerTree, pfPerTree })
    Alert.alert('Saved', 'Salary rules updated.')
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Title>Salary rules</Title>
          <Subtitle>Rate per tree and PF deduction</Subtitle>
          <Input
            value={rate}
            onChangeText={setRate}
            placeholder="Rate per tree (₹)"
            keyboardType="numeric"
          />
          <Input
            value={pf}
            onChangeText={setPf}
            placeholder="PF per tree (₹)"
            keyboardType="numeric"
          />
          <Button label="Save rules" onPress={saveRates} />
        </Card>

        <Card style={styles.card}>
          <Title>API connection</Title>
          <Text style={styles.api}>
            {isApiConfigured() ? getApiBaseUrl() : 'EXPO_PUBLIC_API_URL not set'}
          </Text>
          <Text style={styles.hint}>
            Native app talks to your Next.js server (same database as web).
          </Text>
        </Card>

        <Button label="Sign out" variant="danger" onPress={handleLogout} />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { marginTop: 0 },
  api: { fontSize: 13, color: colors.text, marginTop: 8 },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
})
