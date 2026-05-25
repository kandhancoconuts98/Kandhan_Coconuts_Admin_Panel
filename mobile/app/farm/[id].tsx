import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { Card, Loading, Screen, Subtitle, Title } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const farms = useFarmStore((s) => s.farms)
  const workers = useFarmStore((s) => s.workers)
  const isHydrated = useFarmStore((s) => s.isHydrated)

  const farm = useMemo(() => farms.find((f) => f.id === id), [farms, id])
  const assigned = useMemo(
    () => workers.filter((w) => w.assignedFarmIds?.includes(id)),
    [workers, id]
  )

  if (!isHydrated) return <Loading />
  if (!farm) {
    return (
      <Screen style={styles.center}>
        <Text>Farm not found</Text>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Title>{farm.name}</Title>
          <Subtitle>{farm.location}</Subtitle>
          <Text style={styles.trees}>{farm.treeCount} trees</Text>
        </Card>
        <Card>
          <Title>Assigned workers</Title>
          {assigned.length === 0 ? (
            <Subtitle>No workers assigned</Subtitle>
          ) : (
            assigned.map((w) => (
              <Text key={w.id} style={styles.worker}>
                {w.name}
              </Text>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  trees: { fontSize: 20, fontWeight: '700', color: colors.primary, marginTop: 12 },
  worker: { fontSize: 15, color: colors.text, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
})
