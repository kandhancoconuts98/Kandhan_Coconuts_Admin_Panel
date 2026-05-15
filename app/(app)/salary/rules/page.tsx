'use client'

import { SettingsPage } from '@/components/settings-page'
import { useFarmStore } from '@/lib/store'
import { format } from 'date-fns'

export default function SalaryRulesPage() {
  const history = useFarmStore((s) => s.salaryRuleHistory)

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold">Salary Rules</h1>
        <p className="text-muted-foreground">Rate per tree, PF deduction, effective dates</p>
      </header>
      <SettingsPage />
      {history.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Change history</h3>
          <ul className="space-y-3">
            {history.map((h) => (
              <li key={h.id} className="text-sm flex justify-between border-b border-border pb-2">
                <span>
                  Rate ₹{h.ratePerTree} · PF ₹{h.pfPerTree}/tree
                </span>
                <span className="text-muted-foreground">
                  {format(new Date(h.changedAt), 'dd MMM yyyy HH:mm')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
