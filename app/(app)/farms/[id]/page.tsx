'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { useFarmStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { TreeDeciduous, MapPin } from 'lucide-react'

export default function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const farm = useFarmStore((s) => s.farms.find((f) => f.id === id))
  const allWorkers = useFarmStore((s) => s.workers)
  const workers = useMemo(
    () => allWorkers.filter((w) => w.assignedFarmIds?.includes(id)),
    [allWorkers, id]
  )

  if (!farm) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Farm not found</p>
        <Button asChild><Link href="/farms">Back</Link></Button>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
        <TreeDeciduous className="size-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold">{farm.name}</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-2">
          <MapPin className="size-4" />
          {farm.location}
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Total trees" value={String(farm.treeCount)} />
        <Stat label="Workers assigned" value={String(workers.length)} />
        <Stat label="Productivity" value="—" />
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Assigned workers</h3>
        {workers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workers assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {workers.map((w) => (
              <li key={w.id}>
                <Link href={`/workers/${w.id}`} className="text-primary hover:underline">
                  {w.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
