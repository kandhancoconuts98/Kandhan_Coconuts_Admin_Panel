import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/lib/auth'
import { Button, Input, Screen } from '@/components/ui'
import { colors } from '@/constants/theme'
import { isApiConfigured, getApiBaseUrl } from '@/lib/api'

export default function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@kandhan.com')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    await login()
    router.replace('/(tabs)')
  }

  return (
    <Screen style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <View style={styles.hero}>
          <Text style={styles.brand}>Kandhan Coconuts</Text>
          <Text style={styles.tamil}>கந்தன் தென்னை</Text>
          <Text style={styles.tagline}>Farm Management</Text>
        </View>

        <View style={styles.form}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button label="Sign in" onPress={handleLogin} />
          {!isApiConfigured() && (
            <Text style={styles.warn}>
              Set EXPO_PUBLIC_API_URL in mobile/.env to your Next.js server.
            </Text>
          )}
          {isApiConfigured() && (
            <Text style={styles.api}>API: {getApiBaseUrl()}</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primary,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    marginBottom: 32,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },
  tamil: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  warn: {
    marginTop: 12,
    fontSize: 12,
    color: colors.warning,
    textAlign: 'center',
  },
  api: {
    marginTop: 8,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
})
