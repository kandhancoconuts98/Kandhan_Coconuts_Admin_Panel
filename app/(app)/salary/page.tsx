import { Salaries } from '@/components/salaries'

export default function SalaryPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Weekly Salary</h1>
        <p className="text-muted-foreground">Payroll with PF deductions — export PDF/CSV</p>
      </div>
      <Salaries />
    </div>
  )
}
