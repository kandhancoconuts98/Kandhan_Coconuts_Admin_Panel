'use client'

import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useFarmStore } from '@/lib/store'
import {
  getAdvanceTotalForPeriod,
  getSalaryRecord,
} from '@/lib/operations-utils'
import { isLoader } from '@/lib/worker-types'
import { calcNetSalary, calcNetSalaryFromLoads } from '@/lib/farm-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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

type SalaryRow = {
  id: string
  name: string
  isLoaderWorker: boolean
  units: number
  totalPf: number
  netSalary: number
  totalAdvance: number
  deductAdvance: boolean
  needToPay: number
  paidAmount: number
}

export function Salaries() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()))
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()))

  const workers = useFarmStore((state) => state.workers)
  const dailyRecords = useFarmStore((state) => state.dailyRecords)
  const loadTrips = useFarmStore((state) => state.loadTrips)
  const dailyAdvances = useFarmStore((state) => state.dailyAdvances)
  const salaryPayments = useFarmStore((state) => state.salaryPayments)
  const settings = useFarmStore((state) => state.settings)
  const setSalaryPayment = useFarmStore((state) => state.setSalaryPayment)

  const fromStr = format(fromDate, 'yyyy-MM-dd')
  const toStr = format(toDate, 'yyyy-MM-dd')

  const salaryData = useMemo((): SalaryRow[] => {
    const filteredRecords = dailyRecords.filter(
      (r) => r.date >= fromStr && r.date <= toStr
    )
    const workerTrees = new Map<string, number>()
    filteredRecords.forEach((record) => {
      workerTrees.set(
        record.workerId,
        (workerTrees.get(record.workerId) || 0) + record.treeCount
      )
    })

    return workers
      .map((worker) => {
        const loader = isLoader(worker.workerType)
        let units = 0
        let netSalary = 0
        let totalPf = 0

        if (loader) {
          for (const trip of loadTrips) {
            if (
              trip.date >= fromStr &&
              trip.date <= toStr &&
              trip.workerIds.includes(worker.id)
            ) {
              units += trip.loadCount
            }
          }
          netSalary = calcNetSalaryFromLoads(units, settings)
          totalPf = units * settings.pfPerLoad
        } else {
          units = workerTrees.get(worker.id) || 0
          netSalary = calcNetSalary(units, settings)
          totalPf = units * settings.pfPerTree
        }

        const totalAdvance = getAdvanceTotalForPeriod(
          dailyAdvances,
          worker.id,
          fromStr,
          toStr
        )
        const salaryRecord = getSalaryRecord(
          salaryPayments,
          worker.id,
          fromStr,
          toStr
        )
        const deductAdvance = salaryRecord?.deductAdvance ?? false
        const needToPay = deductAdvance
          ? Math.max(0, netSalary - totalAdvance)
          : netSalary
        const paidAmount = salaryRecord?.paidAmount ?? 0

        return {
          id: worker.id,
          name: worker.name,
          isLoaderWorker: loader,
          units,
          totalPf,
          netSalary,
          totalAdvance,
          deductAdvance,
          needToPay,
          paidAmount,
        }
      })
      .filter((w) => w.units > 0 || w.totalAdvance > 0 || w.paidAmount > 0)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [
    workers,
    dailyRecords,
    loadTrips,
    dailyAdvances,
    salaryPayments,
    settings,
    fromStr,
    toStr,
  ])

  const totals = useMemo(() => {
    return salaryData.reduce(
      (acc, w) => ({
        units: acc.units + w.units,
        pf: acc.pf + w.totalPf,
        net: acc.net + w.netSalary,
        advances: acc.advances + w.totalAdvance,
        needToPay: acc.needToPay + w.needToPay,
        paid: acc.paid + w.paidAmount,
      }),
      { units: 0, pf: 0, net: 0, advances: 0, needToPay: 0, paid: 0 }
    )
  }, [salaryData])

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
      'Trees/Loads',
      'Net Salary (₹)',
      'Advance (₹)',
      'Need to Pay (₹)',
      'Paid (₹)',
    ]
    const rows = salaryData.map((w) => [
      w.name,
      w.units,
      w.netSalary,
      w.totalAdvance,
      w.needToPay,
      w.paidAmount,
    ])
    rows.push([
      'Total',
      totals.units,
      totals.net,
      totals.advances,
      totals.needToPay,
      totals.paid,
    ])

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

    autoTable(doc, {
      startY: 28,
      head: [
        [
          'Worker',
          'Units',
          'Net (₹)',
          'Advance (₹)',
          'Need to pay (₹)',
          'Paid (₹)',
        ],
      ],
      body: salaryData.map((w) => [
        w.name,
        String(w.units),
        String(w.netSalary),
        String(w.totalAdvance),
        String(w.needToPay),
        String(w.paidAmount),
      ]),
      foot: [
        [
          'Total',
          String(totals.units),
          String(totals.net),
          String(totals.advances),
          String(totals.needToPay),
          String(totals.paid),
        ],
      ],
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
      [
        'Worker Name',
        'Trees/Loads',
        'Net Salary (₹)',
        'Advance (₹)',
        'Need to Pay (₹)',
        'Paid (₹)',
      ],
      ...salaryData.map((w) => [
        w.name,
        w.units.toString(),
        w.netSalary.toString(),
        w.totalAdvance.toString(),
        w.needToPay.toString(),
        w.paidAmount.toString(),
      ]),
      [
        'Total',
        totals.units.toString(),
        totals.net.toString(),
        totals.advances.toString(),
        totals.needToPay.toString(),
        totals.paid.toString(),
      ],
    ]

    const csvContent = data.map((row) => row.join('\t')).join('\n')
    void navigator.clipboard.writeText(csvContent)
    alert('Data copied to clipboard! Paste it into a new Google Sheet.')
  }

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Workers</div>
            <div className="mt-1 text-2xl font-bold">{salaryData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Net salary</div>
            <div className="mt-1 text-2xl font-bold text-primary">
              ₹{Math.round(totals.net).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Advances</div>
            <div className="mt-1 text-2xl font-bold">
              ₹{Math.round(totals.advances).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Need to pay</div>
            <div className="mt-1 text-2xl font-bold text-accent">
              ₹{Math.round(totals.needToPay).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Paid</div>
            <div className="mt-1 text-2xl font-bold text-success">
              ₹{Math.round(totals.paid).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <p className="text-muted-foreground">No salary data for this period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead className="text-right">Trees / loads</TableHead>
                    <TableHead className="text-right">Net salary (₹)</TableHead>
                    <TableHead className="text-right">Advance (₹)</TableHead>
                    <TableHead className="text-center">Deduct</TableHead>
                    <TableHead className="text-right">Need to pay (₹)</TableHead>
                    <TableHead className="text-right">Paid amount (₹)</TableHead>
                    <TableHead className="text-right">Balance (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryData.map((worker) => {
                    const balance = worker.needToPay - worker.paidAmount
                    return (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell className="text-right">
                          {worker.units.toLocaleString()}
                          <span className="text-xs text-muted-foreground ml-1">
                            {worker.isLoaderWorker ? 'loads' : 'trees'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{worker.netSalary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ₹{worker.totalAdvance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={worker.deductAdvance}
                            disabled={worker.totalAdvance <= 0}
                            onCheckedChange={(c) =>
                              setSalaryPayment(worker.id, fromStr, toStr, {
                                deductAdvance: c === true,
                              })
                            }
                            aria-label={`Deduct advance for ${worker.name}`}
                          />
                        </TableCell>
                        <TableCell className="text-right font-semibold text-accent">
                          ₹{worker.needToPay.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={0}
                            className="w-28 h-9 ml-auto text-right"
                            placeholder="0"
                            value={worker.paidAmount || ''}
                            onChange={(e) =>
                              setSalaryPayment(worker.id, fromStr, toStr, {
                                paidAmount: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            balance > 0 ? 'text-warning' : 'text-muted-foreground'
                          }`}
                        >
                          ₹{Math.round(balance).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow className="border-t-2 bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">
                      {totals.units.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{Math.round(totals.net).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{Math.round(totals.advances).toLocaleString()}
                    </TableCell>
                    <TableCell />
                    <TableCell className="text-right text-accent">
                      ₹{Math.round(totals.needToPay).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{Math.round(totals.paid).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{Math.round(totals.needToPay - totals.paid).toLocaleString()}
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
