'use client'

import { format, subDays, eachDayOfInterval } from 'date-fns'
import { useFarmStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AttendanceReportsPage() {
  const workers = useFarmStore((s) => s.workers)
  const attendance = useFarmStore((s) => s.attendance)
  const days = eachDayOfInterval({
    start: subDays(new Date(), 27),
    end: new Date(),
  })

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Attendance Reports</h1>
      <div className="bg-card rounded-xl border border-border p-6 overflow-x-auto">
        <h3 className="font-semibold mb-4">Calendar heatmap (28 days)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-2">Worker</th>
              {days.map((d) => (
                <th key={d.toISOString()} className="p-1 text-muted-foreground font-normal">
                  {format(d, 'd')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workers.slice(0, 12).map((w) => (
              <tr key={w.id}>
                <td className="p-2 font-medium truncate max-w-[100px]">{w.name}</td>
                {days.map((d) => {
                  const key = format(d, 'yyyy-MM-dd')
                  const status = attendance[key]?.[w.id]
                  return (
                    <td key={key} className="p-0.5">
                      <div
                        className={cn(
                          'size-6 rounded-sm',
                          status === 'present' && 'bg-success',
                          status === 'absent' && 'bg-destructive/70',
                          status === 'leave' && 'bg-warning',
                          !status && 'bg-muted'
                        )}
                        title={status ?? 'no data'}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
