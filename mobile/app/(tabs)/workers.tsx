import { useMemo, useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { getWorkerWeeklyStats } from '@/lib/farm-utils'
import { Input, Loading, Screen, Subtitle } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function WorkersScreen() {
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const isHydrated = useFarmStore((s) => s.isHydrated)
  const [search, setSearch] = useState('')

  const list = useMemo(() => {
    const q = search.trim().toLowerCase()
    return workers
      .filter((w) => !q || w.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [workers, search])

  if (!isHydrated) return <Loading />

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable style={styles.addBtn} onPress={() => router.push('/worker/new')}>
          <Text style={styles.addBtnText}>+ Add worker</Text>
        </Pressable>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search workers…"
          style={styles.search}
        />
        <Subtitle>{`${list.length} workers`}</Subtitle>
      </View>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const stats = getWorkerWeeklyStats(item.id, dailyRecords, settings)
          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
              onPress={() => router.push(`/worker/${item.id}`)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {stats.trees} trees · ₹{Math.round(stats.net)} net (week)
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          )
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No workers yet. Add from the web admin or sync from DB.</Text>
        }
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 8 },
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  search: { marginBottom: 8 },
  list: { padding: 16, paddingTop: 0, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 18 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.textMuted },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 24 },
})
