import { useMemo, useState } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { format } from 'date-fns'
import { useFarmStore } from '@/lib/store'
import { Button, Loading, Screen, Subtitle } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function BulkDailyEntryScreen() {
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const updateTreeCount = useFarmStore((s) => s.updateTreeCount)
  const isHydrated = useFarmStore((s) => s.isHydrated)

  const [date] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [counts, setCounts] = useState<Record<string, string>>({})

  const activeWorkers = useMemo(
    () =>
      workers
        .filter((w) => w.status !== 'inactive')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [workers]
  )

  if (!isHydrated) return <Loading />

  const getCount = (workerId: string) => {
    if (counts[workerId] !== undefined) return counts[workerId]
    const existing = dailyRecords.find(
      (r) => r.workerId === workerId && r.date === date && !r.farmId
    )
    return existing ? String(existing.treeCount) : ''
  }

  const saveAll = () => {
    let saved = 0
    for (const w of activeWorkers) {
      const raw = getCount(w.id).trim()
      if (!raw) continue
      const n = parseInt(raw, 10)
      if (Number.isNaN(n) || n < 0) continue
      updateTreeCount(w.id, date, n)
      saved++
    }
    Alert.alert('Saved', `Updated ${saved} worker entries for ${date}.`)
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Subtitle>Date: {date}</Subtitle>
        <Button label="Save all" onPress={saveAll} />
      </View>
      <FlatList
        data={activeWorkers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <TextInput
              style={styles.input}
              value={getCount(item.id)}
              onChangeText={(t) =>
                setCounts((prev) => ({ ...prev, [item.id]: t }))
              }
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        )}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  list: { padding: 16, paddingTop: 0, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  name: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.text },
  input: {
    width: 72,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
})
