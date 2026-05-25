import { format } from 'date-fns'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { getDashboardMetrics } from '@/lib/farm-utils'
import { Button, Card, Loading, MetricCard, Screen, Subtitle, Title } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function DashboardScreen() {
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const attendance = useFarmStore((s) => s.attendance)
  const isHydrated = useFarmStore((s) => s.isHydrated)
  const lastError = useFarmStore((s) => s.lastError)
  const isSyncing = useFarmStore((s) => s.isSyncing)

  if (!isHydrated) return <Loading />

  const metrics = getDashboardMetrics(workers, dailyRecords, attendance, settings)
  const today = format(new Date(), 'EEEE, MMM d')

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Kandhan Coconuts</Text>
          <Text style={styles.heroSub}>{today}</Text>
          {isSyncing && <Text style={styles.sync}>Saving…</Text>}
          {lastError && <Text style={styles.error}>{lastError}</Text>}
        </View>

        <View style={styles.metrics}>
          <MetricCard label="Active workers" value={metrics.totalWorkers} />
          <MetricCard label="Trees (week)" value={metrics.totalTrees} />
          <MetricCard label="Salary (week)" value={`₹${Math.round(metrics.weeklySalary)}`} />
          <MetricCard label="Absent today" value={metrics.absentWorkers} />
        </View>

        <Card style={styles.actions}>
          <Title>Quick actions</Title>
          <View style={styles.gap}>
            <Button label="Daily entry" onPress={() => router.push('/daily/bulk')} />
            <Button
              label="View workers"
              variant="outline"
              onPress={() => router.push('/(tabs)/workers')}
            />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: colors.white },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  sync: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
  error: { fontSize: 12, color: '#FECACA', marginTop: 8 },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  actions: { gap: 12 },
  gap: { marginTop: 12, gap: 10 },
})
