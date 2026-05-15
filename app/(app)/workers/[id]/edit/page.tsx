'use client'

import { use } from 'react'
import { WorkerForm } from '@/components/kandhan/worker-form'

export default function EditWorkerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Edit Worker</h1>
      <WorkerForm workerId={id} />
    </div>
  )
}
