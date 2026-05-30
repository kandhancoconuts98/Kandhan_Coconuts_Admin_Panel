'use client'

import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Minus, Plus } from 'lucide-react'
import { useFarmStore } from '@/lib/store'
import { workerTypeLabel } from '@/lib/worker-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type PendingAdjust = { workerId: string; mode: 'add' | 'subtract' }

export function AdvancesSection() {
  const workers = useFarmStore((s) => s.workers)
  const dailyAdvances = useFarmStore((s) => s.dailyAdvances)
  const adjustDailyAdvance = useFarmStore((s) => s.adjustDailyAdvance)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [pending, setPending] = useState<PendingAdjust | null>(null)
  const [amountInput, setAmountInput] = useState('')

  const rows = useMemo(
    () =>
      workers
        .filter((w) => w.status !== 'inactive')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [workers]
  )

  const recentByWorker = useMemo(() => {
    const from = format(subDays(new Date(date), 30), 'yyyy-MM-dd')
    const map = new Map<string, number>()
    for (const a of dailyAdvances) {
      if (a.date >= from && a.date <= date) {
        map.set(a.workerId, (map.get(a.workerId) ?? 0) + a.amount)
      }
    }
    return map
  }, [dailyAdvances, date])

  const startAdjust = (workerId: string, mode: 'add' | 'subtract') => {
    setPending({ workerId, mode })
    setAmountInput('')
  }

  const cancelAdjust = () => {
    setPending(null)
    setAmountInput('')
  }

  const applyAdjust = () => {
    if (!pending) return
    const amt = parseFloat(amountInput)
    if (!amt || amt <= 0) return
    const delta = pending.mode === 'add' ? amt : -amt
    adjustDailyAdvance(pending.workerId, date, delta)
    cancelAdjust()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Advances</h2>
        <p className="text-sm text-muted-foreground">
          Record advances here only. Click + or −, enter the amount, then apply.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              cancelAdjust()
            }}
            className="w-auto"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Advance today (₹)</TableHead>
              <TableHead>30-day total (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((w) => {
              const todayAmt =
                dailyAdvances.find((a) => a.workerId === w.id && a.date === date)?.amount ?? 0
              const isPending = pending?.workerId === w.id
              return (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {workerTypeLabel(w.workerType)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9 shrink-0"
                          onClick={() => startAdjust(w.id, 'subtract')}
                          disabled={todayAmt <= 0}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <div className="min-w-[5rem] text-center font-semibold tabular-nums">
                          {todayAmt > 0 ? `₹${todayAmt.toLocaleString()}` : '—'}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9 shrink-0"
                          onClick={() => startAdjust(w.id, 'add')}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      {isPending && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            autoFocus
                            className="w-32 h-9"
                            placeholder="Amount ₹"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') applyAdjust()
                              if (e.key === 'Escape') cancelAdjust()
                            }}
                          />
                          <Button type="button" size="sm" onClick={applyAdjust}>
                            {pending.mode === 'add' ? 'Add' : 'Reduce'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={cancelAdjust}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    ₹{Math.round(recentByWorker.get(w.id) ?? 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
