'use client'

import { useState } from 'react'
import { Building2, Users, Shield, Globe, Palette } from 'lucide-react'
import { SettingsPage as RateSettings } from '@/components/settings-page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [langTamil, setLangTamil] = useState(false)

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Organization, users, and preferences</p>

      <Tabs defaultValue="organization">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="rates">Salary Rules</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Section icon={Building2} title="Organization">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Organization name</Label>
                <Input defaultValue="Kandhan Coconuts" />
              </div>
              <p className="text-sm text-muted-foreground tamil">கந்தன் தென்னை</p>
            </div>
          </Section>
          <Section icon={Users} title="Users">
            <p className="text-sm text-muted-foreground">
              Invite team members from your Supabase dashboard when backend auth is enabled.
            </p>
          </Section>
          <Section icon={Shield} title="Roles">
            <p className="text-sm text-muted-foreground">
              Admin, Supervisor, and Viewer roles — configure in a future release.
            </p>
          </Section>
        </TabsContent>

        <TabsContent value="rates">
          <RateSettings />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Section icon={Palette} title="Theme">
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark mode</span>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')}
              />
            </div>
          </Section>
          <Section icon={Globe} title="Language">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tamil labels</span>
              <Switch checked={langTamil} onCheckedChange={setLangTamil} />
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  )
}
