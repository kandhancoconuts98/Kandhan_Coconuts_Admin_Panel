'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { useFarmStore } from '@/lib/store'
import { getWorkerWeeklyStats } from '@/lib/farm-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

export function WorkersView() {
  const workers = useFarmStore((s) => s.workers)
  const dailyRecords = useFarmStore((s) => s.dailyRecords)
  const settings = useFarmStore((s) => s.settings)
  const farms = useFarmStore((s) => s.farms)
  const removeWorker = useFarmStore((s) => s.removeWorker)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const rows = useMemo(() => {
    return workers
      .map((w) => {
        const stats = getWorkerWeeklyStats(w.id, dailyRecords, settings)
        const farmNames =
          w.assignedFarmIds
            ?.map((fid) => farms.find((f) => f.id === fid)?.name)
            .filter(Boolean) ?? []
        return { worker: w, stats, farmNames }
      })
      .filter(({ worker }) => {
        const matchSearch = worker.name.toLowerCase().includes(search.toLowerCase())
        const matchStatus =
          statusFilter === 'all' || (worker.status ?? 'active') === statusFilter
        return matchSearch && matchStatus
      })
      .sort((a, b) => a.worker.name.localeCompare(b.worker.name))
  }, [workers, dailyRecords, settings, farms, search, statusFilter])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Workers</h1>
          <p className="text-muted-foreground">Manage pluckers and farm staff</p>
        </div>
        <Button asChild>
          <Link href="/workers/new">
            <Plus className="size-4 mr-2" />
            Add Worker
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="leave">On leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Worker</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trees (week)</TableHead>
              <TableHead>Salary (week)</TableHead>
              <TableHead>Farms</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No workers yet. Add your first worker.
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ worker, stats, farmNames }) => (
                <TableRow key={worker.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {worker.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{worker.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {worker.phone ?? '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={worker.status ?? 'active'} />
                  </TableCell>
                  <TableCell>{stats.trees}</TableCell>
                  <TableCell>₹{Math.round(stats.net).toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {farmNames.length ? farmNames.join(', ') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/workers/${worker.id}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/workers/${worker.id}/edit`}>
                          <Edit className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteId(worker.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {rows.map(({ worker, stats }) => (
          <Link
            key={worker.id}
            href={`/workers/${worker.id}`}
            className="block bg-card rounded-xl border border-border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{worker.name}</span>
              <StatusBadge status={worker.status ?? 'active'} />
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.trees} trees · ₹{Math.round(stats.net).toLocaleString()} this week
            </p>
          </Link>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete worker?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the worker and their daily records permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) removeWorker(deleteId)
                setDeleteId(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-success/10 text-success',
    inactive: 'bg-muted text-muted-foreground',
    leave: 'bg-warning/10 text-warning',
  }
  return (
    <Badge variant="outline" className={map[status] ?? map.active}>
      {status}
    </Badge>
  )
}

