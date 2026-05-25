import { format } from 'date-fns'
import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { Button, Card, Loading, Screen, Subtitle, Title } from '@/components/ui'
import { colors } from '@/constants/theme'
import { EMPTY_SELECTED_WORKER_IDS } from '@/lib/types'

export default function DailyEntryScreen() {
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const selectedWorkerIds = useFarmStore((s) => s.selectedWorkerIds)
  const isHydrated = useFarmStore((s) => s.isHydrated)

  const today = format(new Date(), 'yyyy-MM-dd')
  const selected = selectedWorkerIds[today] ?? EMPTY_SELECTED_WORKER_IDS
  const enteredCount = dailyRecords.filter(
    (r) => r.date === today && r.treeCount > 0
  ).length

  if (!isHydrated) return <Loading />

  return (
    <Screen>
      <View style={styles.content}>
        <Card>
          <Title>Daily entry</Title>
          <Subtitle>Today: {today}</Subtitle>
          <View style={styles.stats}>
            <Text style={styles.stat}>Selected: {selected.length || workers.length}</Text>
            <Text style={styles.stat}>Entered: {enteredCount}</Text>
          </View>
          <View style={styles.btns}>
            <Button label="Muster roll" variant="outline" onPress={() => router.push('/daily/muster')} />
            <Button label="Bulk tree entry" onPress={() => router.push('/daily/bulk')} />
          </View>
        </Card>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  stats: { marginVertical: 16, gap: 6 },
  stat: { fontSize: 15, color: colors.text },
  btns: { gap: 10, marginTop: 8 },
})
