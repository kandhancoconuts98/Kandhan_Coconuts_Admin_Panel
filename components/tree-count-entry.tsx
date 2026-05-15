'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { useFarmStore, EMPTY_SELECTED_WORKER_IDS } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { CalendarIcon, TreePine, Save, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export function TreeCountEntry() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')
  const [date, setDate] = useState<Date>(
    dateParam ? parseISO(dateParam) : new Date()
  )
  const [treeCounts, setTreeCounts] = useState<Record<string, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()

  const dateStr = format(date, 'yyyy-MM-dd')

  const workers = useFarmStore((state) => state.workers)
  const selectedWorkerIds = useFarmStore((state) => {
    const ids = state.selectedWorkerIds[dateStr]
    return ids ?? EMPTY_SELECTED_WORKER_IDS
  })
  const dailyRecords = useFarmStore((state) => state.dailyRecords)
  const updateTreeCount = useFarmStore((state) => state.updateTreeCount)
  const unselectAllWorkersForDate = useFarmStore(
    (state) => state.unselectAllWorkersForDate
  )

  // Get workers for today, sorted A-Z
  const todaysWorkers = useMemo(() => {
    return workers
      .filter((w) => selectedWorkerIds.includes(w.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [workers, selectedWorkerIds])

  // Initialize tree counts from existing records (show empty if 0 / missing)
  const getExistingCount = (workerId: string): string => {
    const record = dailyRecords.find(
      (r) => r.workerId === workerId && r.date === dateStr
    )
    const v = record?.treeCount ?? 0
    return v > 0 ? String(v) : ''
  }

  const getCount = (workerId: string): string => {
    if (workerId in treeCounts) {
      return treeCounts[workerId]
    }
    return getExistingCount(workerId)
  }

  const handleCountChange = (workerId: string, value: string) => {
    setTreeCounts((prev) => ({
      ...prev,
      [workerId]: value,
    }))
    setSaved(false)
  }

  const parseCount = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return 0
    const n = parseInt(trimmed, 10)
    return Number.isFinite(n) ? Math.max(0, n) : 0
  }

  const handleSave = () => {
    todaysWorkers.forEach((worker) => {
      const count = parseCount(getCount(worker.id))
      updateTreeCount(worker.id, dateStr, count)
    })
    // clear today's selection for this date when returning back
    unselectAllWorkersForDate(dateStr)
    setConfirmOpen(false)
    setSaved(true)
    toast({
      title: 'Saved successfully!',
      description: `Tree counts for ${format(date, 'PPP')} have been saved.`,
    })
    window.setTimeout(() => {
      router.push('/')
    }, 400)
  }

  const totalTrees = todaysWorkers.reduce(
    (sum, worker) => sum + parseCount(getCount(worker.id)),
    0
  )

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tree Count Entry</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start sm:w-auto">
              <CalendarIcon className="mr-2 size-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d)
                  setTreeCounts({})
                  setSaved(false)
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Worker List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TreePine className="size-5 text-primary" />
              {"Today's Workers"}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total Trees:</span>
              <span className="font-semibold text-primary">{totalTrees}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {todaysWorkers.length === 0 ? (
            <div className="py-12 text-center">
              <TreePine className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No workers selected for this date.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Go to Daily Updates to select workers first.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <span className="font-medium text-foreground">
                    {worker.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                      Trees:
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={getCount(worker.id)}
                      onChange={(e) =>
                        handleCountChange(worker.id, e.target.value)
                      }
                      className="w-24 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {todaysWorkers.length > 0 && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full max-w-md"
            onClick={() => setConfirmOpen(true)}
          >
            {saved ? (
              <>
                <CheckCircle2 className="mr-2 size-5" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 size-5" />
                Save Tree Counts
              </>
            )}
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              {"Are you sure you want to save today's tree counts? This will update the records for"}{' '}
              <strong>{format(date, 'PPP')}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Yes, Save Counts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
