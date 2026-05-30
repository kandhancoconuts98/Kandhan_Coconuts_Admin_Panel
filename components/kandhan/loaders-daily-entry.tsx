'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format, subDays } from 'date-fns'
import { useShallow } from 'zustand/react/shallow'
import { Calendar, Plus, Save, Truck, Trash2 } from 'lucide-react'
import { useFarmStore } from '@/lib/store'
import { isLoader } from '@/lib/worker-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function LoadersDailyEntry() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const { toast } = useToast()

  const { workers, loadTrips, settings } = useFarmStore(
    useShallow((s) => ({
      workers: s.workers,
      loadTrips: s.loadTrips,
      settings: s.settings,
    }))
  )

  const addLoadTrip = useFarmStore((s) => s.addLoadTrip)
  const updateLoadTrip = useFarmStore((s) => s.updateLoadTrip)
  const removeLoadTrip = useFarmStore((s) => s.removeLoadTrip)

  const loaders = useMemo(
    () =>
      workers
        .filter((w) => w.status !== 'inactive' && isLoader(w.workerType))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [workers]
  )

  const dayTrips = useMemo(
    () => loadTrips.filter((t) => t.date === date),
    [loadTrips, date]
  )

  const addTrip = () => {
    addLoadTrip({
      date,
      vehicleNumber: '',
      loadCount: 0,
      dieselAmount: 0,
      workerIds: [],
      workerAdvances: {},
    })
  }

  const toggleWorker = (tripId: string, workerId: string, checked: boolean) => {
    const trip = loadTrips.find((t) => t.id === tripId)
    if (!trip) return
    const workerIds = checked
      ? [...trip.workerIds, workerId]
      : trip.workerIds.filter((id) => id !== workerId)
    updateLoadTrip(tripId, { workerIds })
  }

  const totalLoads = dayTrips.reduce((s, t) => s + t.loadCount, 0)
  const totalDiesel = dayTrips.reduce((s, t) => s + (t.dieselAmount ?? 0), 0)

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-28 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Truck className="size-5" />
            <span className="text-sm font-medium">Loaders</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold">Loads daily entry</h1>
          <p className="text-muted-foreground">Vehicle trips, loads, and diesel per vehicle</p>
        </div>
        <Link href="/daily-entry" className="text-sm text-primary hover:underline">
          ← Daily entry hub
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Calendar className="size-4 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          />
        </div>
        <Button variant="outline" onClick={addTrip}>
          <Plus className="size-4 mr-2" />
          Add vehicle trip
        </Button>
      </div>

      {dayTrips.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No load trips for this date. Click &quot;Add vehicle trip&quot; to start.
        </div>
      ) : (
        dayTrips.map((trip) => (
          <div key={trip.id} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-end justify-between">
              <div className="flex flex-wrap gap-4 flex-1">
                <div className="space-y-1 min-w-[160px]">
                  <Label>Vehicle number</Label>
                  <Input
                    placeholder="TN 01 AB 1234"
                    value={trip.vehicleNumber}
                    onChange={(e) =>
                      updateLoadTrip(trip.id, { vehicleNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1 w-32">
                  <Label>Loads count</Label>
                  <Input
                    type="number"
                    min={0}
                    value={trip.loadCount || ''}
                    onChange={(e) =>
                      updateLoadTrip(trip.id, {
                        loadCount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-1 w-36">
                  <Label>Diesel spent (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={trip.dieselAmount || ''}
                    onChange={(e) =>
                      updateLoadTrip(trip.id, {
                        dieselAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeLoadTrip(trip.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div>
              <Label className="mb-3 block">Workers on this vehicle</Label>
              {loaders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No loaders registered.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {loaders.map((w) => {
                    const selected = trip.workerIds.includes(w.id)
                    return (
                      <div
                        key={w.id}
                        className={`flex items-center gap-3 border rounded-lg p-3 ${
                          selected ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <Checkbox
                          id={`${trip.id}-${w.id}`}
                          checked={selected}
                          onCheckedChange={(c) =>
                            toggleWorker(trip.id, w.id, c === true)
                          }
                        />
                        <Label htmlFor={`${trip.id}-${w.id}`} className="font-medium truncate">
                          {w.name}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <p className="text-sm text-muted-foreground">
        Advances are recorded under Workers → Advances, not here.
      </p>

      <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-8 z-30">
        <div className="bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center gap-4 max-w-3xl lg:ml-auto">
          <div className="flex gap-6 text-sm flex-1">
            <span><strong>{dayTrips.length}</strong> trips</span>
            <span><strong>{totalLoads}</strong> loads</span>
            <span><strong>₹{totalDiesel.toLocaleString()}</strong> diesel</span>
            {settings.ratePerLoad > 0 && (
              <span>Rate ₹{settings.ratePerLoad}/load</span>
            )}
          </div>
          <Button
            onClick={() =>
              toast({ title: 'Saved', description: `Load entry saved for ${date}` })
            }
          >
            <Save className="size-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
