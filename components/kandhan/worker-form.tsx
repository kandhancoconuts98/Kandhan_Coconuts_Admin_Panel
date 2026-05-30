'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFarmStore, type WorkerType, type WorkerStatus } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function WorkerForm({ workerId }: { workerId?: string }) {
  const router = useRouter()
  const workers = useFarmStore((s) => s.workers)
  const addWorker = useFarmStore((s) => s.addWorker)
  const updateWorker = useFarmStore((s) => s.updateWorker)

  const existing = workerId ? workers.find((w) => w.id === workerId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [phone, setPhone] = useState(existing?.phone ?? '')
  const [workerType, setWorkerType] = useState<WorkerType>(
    existing?.workerType ?? 'climber'
  )
  const [status, setStatus] = useState<WorkerStatus>(
    existing?.status ?? 'active'
  )
  const [joiningDate, setJoiningDate] = useState(existing?.joiningDate ?? '')
  const [salaryCategory, setSalaryCategory] = useState(
    existing?.salaryCategory ?? 'standard'
  )
  const [village, setVillage] = useState(existing?.village ?? '')
  const [district, setDistrict] = useState(existing?.district ?? '')
  const [address, setAddress] = useState(existing?.address ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    const payload = {
      name: name.trim(),
      phone,
      workerType,
      status,
      joiningDate,
      salaryCategory,
      village,
      district,
      address,
      notes,
    }
    if (existing) {
      updateWorker(existing.id, payload)
      toast.success('Worker updated')
      router.push(`/workers/${existing.id}`)
    } else {
      const id = addWorker(payload)
      toast.success('Worker added')
      router.push(`/workers/${id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Worker Type</Label>
            <Select value={workerType} onValueChange={(v) => setWorkerType(v as WorkerType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="climber">Tree climber</SelectItem>
                <SelectItem value="loader">Loader</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as WorkerStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Employment</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="join">Joining Date</Label>
            <Input id="join" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Salary Category</Label>
            <Select value={salaryCategory} onValueChange={setSalaryCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input id="village" value={village} onChange={(e) => setVillage(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit">{existing ? 'Save Worker' : 'Add Worker'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

