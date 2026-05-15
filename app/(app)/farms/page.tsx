'use client'

import Link from 'next/link'
import { MapPin, TreeDeciduous, Users } from 'lucide-react'
import { useFarmStore } from '@/lib/store'

export default function FarmsPage() {
  const farms = useFarmStore((s) => s.farms)
  const workers = useFarmStore((s) => s.workers)

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Farms</h1>
      <p className="text-muted-foreground mb-8">All coconut farm locations</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => {
          const assigned = workers.filter((w) =>
            w.assignedFarmIds?.includes(farm.id)
          ).length
          return (
            <Link
              key={farm.id}
              href={`/farms/${farm.id}`}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <TreeDeciduous className="size-16 text-primary/60" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{farm.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="size-4" />
                  {farm.location}
                </p>
                <div className="flex justify-between text-sm">
                  <span>{farm.treeCount} trees</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-4" />
                    {assigned} workers
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
