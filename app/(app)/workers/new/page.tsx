import { WorkerForm } from '@/components/kandhan/worker-form'

export default function NewWorkerPage() {
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Add Worker</h1>
      <p className="text-muted-foreground mb-8">Create a new worker profile</p>
      <WorkerForm />
    </div>
  )
}
