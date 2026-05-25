import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { getWorkerWeeklyStats } from '@/lib/farm-utils'
import { Card, Loading, Screen, Subtitle, Title } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function WorkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const isHydrated = useFarmStore((s) => s.isHydrated)

  const worker = useMemo(
    () => workers.find((w) => w.id === id),
    [workers, id]
  )

  if (!isHydrated) return <Loading />
  if (!worker) {
    return (
      <Screen style={styles.center}>
        <Text>Worker not found</Text>
      </Screen>
    )
  }

  const stats = getWorkerWeeklyStats(worker.id, dailyRecords, settings)
  const recent = dailyRecords
    .filter((r) => r.workerId === worker.id && r.treeCount > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Title>{worker.name}</Title>
          <Subtitle>{worker.status ?? 'active'} · {worker.workerType ?? 'plucker'}</Subtitle>
        </Card>

        <View style={styles.metrics}>
          <Card style={styles.metric}>
            <Text style={styles.metricVal}>{stats.trees}</Text>
            <Text style={styles.metricLbl}>Trees (week)</Text>
          </Card>
          <Card style={styles.metric}>
            <Text style={styles.metricVal}>₹{Math.round(stats.net)}</Text>
            <Text style={styles.metricLbl}>Net (week)</Text>
          </Card>
        </View>

        <Card>
          <Title>Recent entries</Title>
          {recent.length === 0 ? (
            <Subtitle>No entries yet</Subtitle>
          ) : (
            recent.map((r) => (
              <View key={`${r.date}-${r.farmId ?? ''}`} style={styles.row}>
                <Text style={styles.date}>{r.date}</Text>
                <Text style={styles.trees}>{r.treeCount} trees</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 16 },
  center: { justifyContent: 'center', alignItems: 'center' },
  metrics: { flexDirection: 'row', gap: 12 },
  metric: { flex: 1, alignItems: 'center' },
  metricVal: { fontSize: 24, fontWeight: '700', color: colors.primary },
  metricLbl: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: { color: colors.text },
  trees: { fontWeight: '600', color: colors.primary },
})
