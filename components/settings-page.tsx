'use client'

import { useState, useEffect } from 'react'
import { useFarmStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Edit2, Save, X, Settings, Calculator } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export function SettingsPage() {
  const settings = useFarmStore((state) => state.settings)
  const updateSettings = useFarmStore((state) => state.updateSettings)
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [ratePerTree, setRatePerTree] = useState(settings.ratePerTree)
  const [pfPerTree, setPfPerTree] = useState(settings.pfPerTree)
  const [ratePerLoad, setRatePerLoad] = useState(settings.ratePerLoad)
  const [pfPerLoad, setPfPerLoad] = useState(settings.pfPerLoad)
  // Supabase sync is automatic now (no settings UI)

  const handleEdit = () => {
    setRatePerTree(settings.ratePerTree)
    setPfPerTree(settings.pfPerTree)
    setRatePerLoad(settings.ratePerLoad)
    setPfPerLoad(settings.pfPerLoad)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setRatePerTree(settings.ratePerTree)
    setPfPerTree(settings.pfPerTree)
    setRatePerLoad(settings.ratePerLoad)
    setPfPerLoad(settings.pfPerLoad)
    setIsEditing(false)
  }

  const handleSave = () => {
    updateSettings({ ratePerTree, pfPerTree, ratePerLoad, pfPerLoad })
    setIsEditing(false)
    toast({
      title: 'Settings saved!',
      description: 'Your rate settings have been updated successfully.',
    })
  }


  const netRate = settings.ratePerTree - settings.pfPerTree
  const editNetRate = ratePerTree - pfPerTree
  const netLoadRate = settings.ratePerLoad - settings.pfPerLoad
  const editNetLoadRate = ratePerLoad - pfPerLoad

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Rate Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5 text-primary" />
                Rate Configuration
              </CardTitle>
              <CardDescription className="mt-1">
                Configure the payment rates for tree harvesting work
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={handleEdit}>
                <Edit2 className="mr-2 size-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Rate per Tree */}
            <div className="space-y-2">
              <Label htmlFor="rate">Rate per Tree (₹)</Label>
              {isEditing ? (
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={ratePerTree}
                  onChange={(e) => setRatePerTree(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              ) : (
                <div className="flex h-10 items-center rounded-md border border-input bg-muted/50 px-3 text-lg font-medium">
                  ₹{settings.ratePerTree}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                The base rate paid per tree harvested
              </p>
            </div>

            {/* PF per Tree */}
            <div className="space-y-2">
              <Label htmlFor="pf">PF Deduction per Tree (₹)</Label>
              {isEditing ? (
                <Input
                  id="pf"
                  type="number"
                  min="0"
                  step="0.5"
                  value={pfPerTree}
                  onChange={(e) => setPfPerTree(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              ) : (
                <div className="flex h-10 items-center rounded-md border border-input bg-muted/50 px-3 text-lg font-medium">
                  ₹{settings.pfPerTree}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Provident Fund deduction per tree
              </p>
            </div>
          </div>

          <Separator />

          {/* Formula Display */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Calculator className="size-4" />
              Salary Calculation Formula
            </div>
            <div className="mt-3 space-y-2">
              <div className="rounded-md bg-card p-3 font-mono text-sm">
                <span className="text-primary">Total Salary</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-foreground">(Rate - PF) × Trees</span>
              </div>
              <div className="rounded-md bg-card p-3 font-mono text-sm">
                <span className="text-primary">Total Salary</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-foreground">
                  (₹{isEditing ? ratePerTree : settings.ratePerTree} - ₹
                  {isEditing ? pfPerTree : settings.pfPerTree}) × Trees
                </span>
              </div>
              <div className="rounded-md bg-card p-3 font-mono text-sm">
                <span className="text-primary">Total Salary</span>
                <span className="text-muted-foreground"> = </span>
                <span className="font-semibold text-accent">
                  ₹{isEditing ? editNetRate : netRate}
                </span>
                <span className="text-foreground"> × Trees</span>
              </div>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="text-sm font-medium text-foreground">
              Example Calculation
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              If a worker harvests <strong className="text-foreground">100 trees</strong>:
            </div>
            <div className="mt-2 text-lg font-semibold text-accent">
              Salary = ₹{isEditing ? editNetRate : netRate} × 100 = ₹
              {((isEditing ? editNetRate : netRate) * 100).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            Loader Rate Configuration
          </CardTitle>
          <CardDescription>
            Payment rates for workers paid by loads picked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate-load">Rate per Load (₹)</Label>
              {isEditing ? (
                <Input
                  id="rate-load"
                  type="number"
                  min="0"
                  step="0.5"
                  value={ratePerLoad}
                  onChange={(e) => setRatePerLoad(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              ) : (
                <div className="flex h-10 items-center rounded-md border border-input bg-muted/50 px-3 text-lg font-medium">
                  ₹{settings.ratePerLoad}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-load">PF Deduction per Load (₹)</Label>
              {isEditing ? (
                <Input
                  id="pf-load"
                  type="number"
                  min="0"
                  step="0.5"
                  value={pfPerLoad}
                  onChange={(e) => setPfPerLoad(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              ) : (
                <div className="flex h-10 items-center rounded-md border border-input bg-muted/50 px-3 text-lg font-medium">
                  ₹{settings.pfPerLoad}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-md bg-card p-3 font-mono text-sm">
            <span className="text-primary">Loader salary</span>
            <span className="text-muted-foreground"> = </span>
            <span className="font-semibold text-accent">
              ₹{isEditing ? editNetLoadRate : netLoadRate}
            </span>
            <span className="text-foreground"> × Loads</span>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Rate Settings</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <ul className="space-y-2">
            <li>
              <strong className="text-foreground">Rate per Tree:</strong> This is the gross amount paid to workers for each coconut tree they harvest.
            </li>
            <li>
              <strong className="text-foreground">PF Deduction:</strong> Provident Fund contribution that is deducted from each tree&apos;s payment to ensure workers have retirement savings.
            </li>
            <li>
              <strong className="text-foreground">Net Rate:</strong> The actual amount workers receive per tree after PF deduction.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
