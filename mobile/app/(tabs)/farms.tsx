import { useMemo } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { Loading, Screen, Subtitle } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function FarmsScreen() {
  const farms = useFarmStore((s) => s.farms)
  const workers = useFarmStore((s) => s.workers)
  const isHydrated = useFarmStore((s) => s.isHydrated)

  const rows = useMemo(
    () =>
      farms.map((farm) => ({
        farm,
        assigned: workers.filter((w) => w.assignedFarmIds?.includes(farm.id)).length,
      })),
    [farms, workers]
  )

  if (!isHydrated) return <Loading />

  return (
    <Screen>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.farm.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Subtitle>{`${farms.length} farm locations`}</Subtitle>}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
            onPress={() => router.push(`/farm/${item.farm.id}`)}
          >
            <Text style={styles.name}>{item.farm.name}</Text>
            <Text style={styles.loc}>{item.farm.location}</Text>
            <View style={styles.row}>
              <Text style={styles.meta}>{item.farm.treeCount} trees</Text>
              <Text style={styles.meta}>{item.assigned} workers</Text>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  loc: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  meta: { fontSize: 13, color: colors.primary, fontWeight: '600' },
})
