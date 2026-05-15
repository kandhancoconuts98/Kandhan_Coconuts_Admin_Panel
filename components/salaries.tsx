'use client'

import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useFarmStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CalendarIcon, Download, FileSpreadsheet, FileText, Wallet } from 'lucide-react'

export function Salaries() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()))
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()))

  const workers = useFarmStore((state) => state.workers)
  const dailyRecords = useFarmStore((state) => state.dailyRecords)
  const settings = useFarmStore((state) => state.settings)

  const fromStr = format(fromDate, 'yyyy-MM-dd')
  const toStr = format(toDate, 'yyyy-MM-dd')

  // Calculate salary data: net = (rate - PF) × trees; total PF = pfPerTree × trees
  const salaryData = useMemo(() => {
    const filteredRecords = dailyRecords.filter(
      (r) => r.date >= fromStr && r.date <= toStr
    )

    const workerTotals = new Map<string, number>()

    filteredRecords.forEach((record) => {
      const current = workerTotals.get(record.workerId) || 0
      workerTotals.set(record.workerId, current + record.treeCount)
    })

    return workers
      .map((worker) => {
        const treeCount = workerTotals.get(worker.id) || 0
        const totalPf = treeCount * settings.pfPerTree
        const netSalary =
          treeCount * (settings.ratePerTree - settings.pfPerTree)
        return {
          id: worker.id,
          name: worker.name,
          treeCount,
          totalPf,
          netSalary,
        }
      })
      .filter((w) => w.treeCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [workers, dailyRecords, settings, fromStr, toStr])

  const totalTrees = salaryData.reduce((sum, w) => sum + w.treeCount, 0)
  const totalPf = salaryData.reduce((sum, w) => sum + w.totalPf, 0)
  const totalNetSalary = salaryData.reduce((sum, w) => sum + w.netSalary, 0)

  const csvEscape = (v: string | number) => {
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const exportCSV = () => {
    const headers = [
      'Worker Name',
      'Total Trees',
      'Total PF (₹)',
      'Net Salary (₹)',
    ]
    const rows = salaryData.map((w) => [
      w.name,
      w.treeCount,
      w.totalPf,
      w.netSalary,
    ])
    rows.push(['Total', totalTrees, totalPf, totalNetSalary])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(csvEscape).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `salaries_${fromStr}_to_${toStr}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(15)
    doc.text('Coconest: Farm Labor Manager', 14, 16)
    doc.setFontSize(10)
    doc.text(
      `Salaries — ${format(fromDate, 'PPP')} to ${format(toDate, 'PPP')}`,
      14,
      23
    )
    doc.text(
      `Rate/tree: ₹${settings.ratePerTree}   PF/tree: ₹${settings.pfPerTree}`,
      14,
      29
    )

    autoTable(doc, {
      startY: 34,
      head: [['Worker', 'Total Trees', 'Total PF (₹)', 'Net Salary (₹)']],
      body: salaryData.map((w) => [
        w.name,
        String(w.treeCount),
        String(w.totalPf),
        String(w.netSalary),
      ]),
      foot: [['Total', String(totalTrees), String(totalPf), String(totalNetSalary)]],
      showFoot: 'lastPage',
      headStyles: { fillColor: [45, 80, 22] },
      footStyles: {
        fillColor: [232, 240, 224],
        textColor: [20, 20, 20],
        fontStyle: 'bold',
      },
    })

    doc.save(`salaries_${fromStr}_to_${toStr}.pdf`)
  }

  const exportGoogleSheets = () => {
    const data = [
      ['Worker Name', 'Total Trees', 'Total PF (₹)', 'Net Salary (₹)'],
      ...salaryData.map((w) => [
        w.name,
        w.treeCount.toString(),
        w.totalPf.toString(),
        w.netSalary.toString(),
      ]),
      ['Total', totalTrees.toString(), totalPf.toString(), totalNetSalary.toString()],
    ]

    const csvContent = data.map((row) => row.join('\t')).join('\n')

    void navigator.clipboard.writeText(csvContent)
    alert('Data copied to clipboard! Paste it into a new Google Sheet.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Salaries Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 size-4" />
                From: {format(fromDate, 'MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(d) => d && setFromDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">—</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 size-4" />
                To: {format(toDate, 'MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(d) => d && setToDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              Total Workers
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {salaryData.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              Total Trees
            </div>
            <div className="mt-1 text-2xl font-bold text-primary">
              {totalTrees.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              Total PF (period)
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              ₹{totalPf.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              Net Salary (period)
            </div>
            <div className="mt-1 text-2xl font-bold text-accent">
              ₹{totalNetSalary.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="size-5 text-primary" />
              Salary Details
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={salaryData.length === 0}>
                  <Download className="mr-2 size-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportCSV}>
                  <FileSpreadsheet className="mr-2 size-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}>
                  <FileText className="mr-2 size-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportGoogleSheets}>
                  <FileSpreadsheet className="mr-2 size-4" />
                  Copy for Google Sheets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {salaryData.length === 0 ? (
            <div className="py-12 text-center">
              <Wallet className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No salary data for this period.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead className="text-right">Total Trees</TableHead>
                    <TableHead className="text-right">Total PF (₹)</TableHead>
                    <TableHead className="text-right">Net Salary (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryData.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">
                        {worker.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {worker.treeCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{worker.totalPf.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-accent">
                        ₹{worker.netSalary.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">
                      {totalTrees.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{totalPf.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-accent">
                      ₹{totalNetSalary.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
