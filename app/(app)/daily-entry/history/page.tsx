'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useFarmStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function EntryHistoryPage() {
  const [dateFilter, setDateFilter] = useState('')
  const workers = useFarmStore((s) => s.workers)
  const records = useFarmStore((s) => s.dailyRecords)
  const updateTreeCount = useFarmStore((s) => s.updateTreeCount)

  const rows = useMemo(() => {
    return records
      .filter((r) => !dateFilter || r.date === dateFilter)
      .map((r) => ({
        ...r,
        name: workers.find((w) => w.id === r.workerId)?.name ?? 'Unknown',
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [records, workers, dateFilter])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Entry History</h1>
      <p className="text-muted-foreground mb-6">Review and edit historical entries</p>
      <Input
        type="date"
        className="max-w-xs mb-6"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Trees</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={`${r.date}-${r.workerId}`}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-24 h-8"
                      defaultValue={r.treeCount}
                      onBlur={(e) =>
                        updateTreeCount(
                          r.workerId,
                          r.date,
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Delete
                    </Button>
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

