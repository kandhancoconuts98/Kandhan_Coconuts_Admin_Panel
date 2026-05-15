import { DailyUpdates } from '@/components/daily-updates'

export default function MusterPage() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Muster Roll</h1>
        <p className="text-muted-foreground">Select workers for today before bulk entry</p>
      </div>
      <DailyUpdates />
    </div>
  )
}
