import { useState } from 'react'
import { Alert, ScrollView, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useFarmStore } from '@/lib/store'
import { Button, Input, Screen, Title } from '@/components/ui'
import { colors } from '@/constants/theme'

export default function NewWorkerScreen() {
  const addWorker = useFarmStore((s) => s.addWorker)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [village, setVillage] = useState('')

  const save = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      Alert.alert('Name required', 'Enter the worker name.')
      return
    }
    const id = addWorker({
      name: trimmed,
      phone: phone.trim() || undefined,
      village: village.trim() || undefined,
    })
    Alert.alert('Saved', `${trimmed} added.`)
    router.replace(`/worker/${id}`)
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title>Add worker</Title>
        <Input value={name} onChangeText={setName} placeholder="Full name *" />
        <Input value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
        <Input value={village} onChangeText={setVillage} placeholder="Village" />
        <Button label="Save worker" onPress={save} />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 4, backgroundColor: colors.background },
})
