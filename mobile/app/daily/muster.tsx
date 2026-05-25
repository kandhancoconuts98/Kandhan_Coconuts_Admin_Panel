import { useMemo, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { format } from 'date-fns'
import { useFarmStore } from '@/lib/store'
import { EMPTY_SELECTED_WORKER_IDS } from '@/lib/types'
import { Button, Loading, Screen, Subtitle } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function MusterScreen() {
  const workers = useFarmStore((s) => s.workers)
  const selectedWorkerIds = useFarmStore((s) => s.selectedWorkerIds)
  const selectWorkerForDate = useFarmStore((s) => s.selectWorkerForDate)
  const unselectWorkerForDate = useFarmStore((s) => s.unselectWorkerForDate)
  const selectAllWorkersForDate = useFarmStore((s) => s.selectAllWorkersForDate)
  const isHydrated = useFarmStore((s) => s.isHydrated)

  const [date] = useState(format(new Date(), 'yyyy-MM-dd'))
  const selected = selectedWorkerIds[date] ?? EMPTY_SELECTED_WORKER_IDS

  const activeWorkers = useMemo(
    () =>
      workers
        .filter((w) => w.status !== 'inactive')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [workers]
  )

  if (!isHydrated) return <Loading />

  const toggle = (id: string) => {
    if (selected.includes(id)) unselectWorkerForDate(id, date)
    else selectWorkerForDate(id, date)
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Subtitle>{`Muster — ${date}`}</Subtitle>
        <Button
          label="Select all"
          variant="outline"
          onPress={() => {
            selectAllWorkersForDate(date)
            Alert.alert('Done', 'All active workers selected for today.')
          }}
        />
      </View>
      <FlatList
        data={activeWorkers}
        keyExtractor={(w) => w.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const on = selected.includes(item.id)
          return (
            <Pressable
              style={[styles.row, on && styles.rowOn]}
              onPress={() => toggle(item.id)}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.badge, on && styles.badgeOn]}>
                {on ? 'Selected' : 'Tap to select'}
              </Text>
            </Pressable>
          )
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { padding: 16, gap: 12 },
  list: { padding: 16, paddingTop: 0, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowOn: { borderColor: colors.primary, backgroundColor: '#E8F5E9' },
  name: { fontSize: 16, fontWeight: '500', color: colors.text },
  badge: { fontSize: 12, color: colors.textMuted },
  badgeOn: { color: colors.primary, fontWeight: '600' },
})
