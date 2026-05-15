'use client'

import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { useSessionWorkDate } from '@/hooks/use-session-work-date'
import {
  useFarmStore,
  EMPTY_SELECTED_WORKER_IDS,
  type Worker,
} from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarIcon, Plus, Minus, UserPlus, Users, FileUp, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function parseWorkerNamesFromCsv(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const names: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let cell = line.includes(',') ? line.split(',')[0] : line
    cell = cell.replace(/^"|"$/g, '').trim()
    if (i === 0 && /^name$/i.test(cell)) continue
    if (cell) names.push(cell)
  }
  return names
}

export function DailyUpdates() {
  const [date, setDate] = useSessionWorkDate()
  const [newWorkerName, setNewWorkerName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Worker | null>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  const dateStr = format(date, 'yyyy-MM-dd')

  const workers = useFarmStore((state) => state.workers)
  const selectedWorkerIds = useFarmStore((state) => {
    const ids = state.selectedWorkerIds[dateStr]
    return ids ?? EMPTY_SELECTED_WORKER_IDS
  })
  const selectWorkerForDate = useFarmStore((state) => state.selectWorkerForDate)
  const unselectWorkerForDate = useFarmStore(
    (state) => state.unselectWorkerForDate
  )
  const selectAllWorkersForDate = useFarmStore(
    (state) => state.selectAllWorkersForDate
  )
  const unselectAllWorkersForDate = useFarmStore(
    (state) => state.unselectAllWorkersForDate
  )
  const addWorker = useFarmStore((state) => state.addWorker)
  const importWorkerNames = useFarmStore((state) => state.importWorkerNames)
  const removeWorker = useFarmStore((state) => state.removeWorker)

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      importWorkerNames(parseWorkerNamesFromCsv(text))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const selectedWorkers = workers.filter((w) =>
    selectedWorkerIds.includes(w.id)
  )
  const availableWorkers = workers.filter(
    (w) => !selectedWorkerIds.includes(w.id)
  )

  // Sort: available workers first, then selected (disabled) workers at bottom
  const sortedAllWorkers = [
    ...availableWorkers.sort((a, b) => a.name.localeCompare(b.name)),
    ...selectedWorkers.sort((a, b) => a.name.localeCompare(b.name)),
  ]

  const handleAddWorker = () => {
    if (newWorkerName.trim()) {
      addWorker({ name: newWorkerName.trim() })
      setNewWorkerName('')
      setDialogOpen(false)
    }
  }

  const openDelete = (worker: Worker) => {
    setDeleteTarget(worker)
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    removeWorker(deleteTarget.id)
    setDeleteTarget(null)
    setDeleteOpen(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col pb-28">
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleCsvChange}
      />
      <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Daily Updates</h1>
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
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* All Workers Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="size-5 text-primary" />
                All Workers
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => csvInputRef.current?.click()}
                >
                  <FileUp className="mr-1 size-4" />
                  Import CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectAllWorkersForDate(dateStr)}
                  disabled={availableWorkers.length === 0}
                >
                  Add All
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="mr-1 size-4" />
                      Add Worker
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Worker</DialogTitle>
                      <DialogDescription>
                        Enter the name of the new worker to add to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Worker Name</Label>
                        <Input
                          id="name"
                          value={newWorkerName}
                          onChange={(e) => setNewWorkerName(e.target.value)}
                          placeholder="Enter worker name"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddWorker()
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddWorker}>Add Worker</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              {sortedAllWorkers.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No workers added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {sortedAllWorkers.map((worker) => {
                    const isSelected = selectedWorkerIds.includes(worker.id)
                    return (
                      <WorkerRow
                        key={worker.id}
                        worker={worker}
                        disabled={isSelected}
                        action="add"
                        onAction={() => selectWorkerForDate(worker.id, dateStr)}
                        onDelete={() => openDelete(worker)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Workers Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="size-5 text-primary" />
                {"Today's Workers"}
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-normal text-primary">
                  {selectedWorkers.length}
                </span>
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => unselectAllWorkersForDate(dateStr)}
                disabled={selectedWorkers.length === 0}
              >
                Remove All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              {selectedWorkers.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No workers selected for today
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedWorkers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((worker) => (
                      <WorkerRow
                        key={worker.id}
                        worker={worker}
                        action="remove"
                        onAction={() =>
                          unselectWorkerForDate(worker.id, dateStr)
                        }
                      />
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete worker?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  This will permanently delete{' '}
                  <strong>{deleteTarget.name}</strong> and all tree count records
                  linked to this worker.
                </>
              ) : (
                'This will permanently delete the worker and all related records.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sticky proceed */}
      <div className="sticky bottom-0 z-20 mt-auto border-t border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="w-full max-w-md"
            disabled={selectedWorkers.length === 0}
          >
            <Link
              href={`/tree-count?date=${dateStr}`}
              className={cn(
                selectedWorkers.length === 0 && 'pointer-events-none opacity-50'
              )}
            >
              Proceed to Tree Count Entry
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkerRow({
  worker,
  disabled = false,
  action,
  onAction,
  onDelete,
}: {
  worker: Worker
  disabled?: boolean
  action: 'add' | 'remove'
  onAction: () => void
  onDelete?: () => void
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors',
        disabled
          ? 'border-muted bg-muted/50 text-muted-foreground'
          : 'border-border bg-card hover:bg-muted/30'
      )}
    >
      <span className={cn('font-medium', disabled && 'line-through')}>
        {worker.name}
      </span>
      <div className="flex items-center gap-2">
        {action === 'add' && onDelete && (
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={onDelete}
            disabled={false}
            title="Delete worker"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant={action === 'add' ? 'default' : 'outline'}
          className={cn(
            'size-8',
            action === 'remove' &&
              'hover:bg-destructive hover:text-destructive-foreground'
          )}
          disabled={disabled}
          onClick={onAction}
        >
          {action === 'add' ? (
            <Plus className="size-4" />
          ) : (
            <Minus className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
