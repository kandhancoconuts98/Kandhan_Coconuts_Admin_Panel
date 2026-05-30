'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format, subDays } from 'date-fns'
import { useFarmStore } from '@/lib/store'
import { getDailyLoadTotals } from '@/lib/operations-utils'
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

export function LoadsSummarySection() {
  const loadTrips = useFarmStore((s) => s.loadTrips)
  const [days, setDays] = useState(14)

  const dailyRows = useMemo(() => {
    const out: { date: string; loads: number; trips: number; dieselAmount: number }[] = []
    for (let i = 0; i < days; i++) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
      const totals = getDailyLoadTotals(loadTrips, d)
      if (totals.loads || totals.trips || totals.dieselAmount) {
        out.push({
          date: d,
          loads: totals.loads,
          trips: totals.trips,
          dieselAmount: totals.dieselAmount,
        })
      }
    }
    return out
  }, [loadTrips, days])

  const vehicleRows = useMemo(() => {
    const from = format(subDays(new Date(), days - 1), 'yyyy-MM-dd')
    return loadTrips
      .filter((t) => t.date >= from)
      .sort((a, b) => b.date.localeCompare(a.date) || a.vehicleNumber.localeCompare(b.vehicleNumber))
  }, [loadTrips, days])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Loads & diesel</h2>
        <p className="text-sm text-muted-foreground">
          Diesel is recorded per vehicle in{' '}
          <Link href="/daily-entry/loads" className="text-primary underline">
            Loads entry
          </Link>
          .
        </p>
      </div>

      <div className="space-y-1">
        <Label>Days to show</Label>
        <Input
          type="number"
          min={7}
          max={90}
          className="w-24"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10) || 14)}
        />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold">Daily totals</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Trips</TableHead>
              <TableHead>Total loads</TableHead>
              <TableHead>Total diesel (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dailyRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No load data yet.
                </TableCell>
              </TableRow>
            ) : (
              dailyRows.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell>{r.trips}</TableCell>
                  <TableCell>{r.loads}</TableCell>
                  <TableCell>
                    {r.dieselAmount ? `₹${r.dieselAmount.toLocaleString()}` : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold">By vehicle</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Loads</TableHead>
              <TableHead>Diesel spent (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No vehicle trips yet.
                </TableCell>
              </TableRow>
            ) : (
              vehicleRows.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.date}</TableCell>
                  <TableCell>{trip.vehicleNumber || '—'}</TableCell>
                  <TableCell>{trip.loadCount}</TableCell>
                  <TableCell>
                    {trip.dieselAmount ? `₹${trip.dieselAmount.toLocaleString()}` : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
