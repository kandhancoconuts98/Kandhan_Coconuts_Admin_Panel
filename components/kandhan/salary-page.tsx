import { Calendar, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

const salaryData = [
  {
    id: 1,
    worker: 'Ravi Kumar',
    trees: 425,
    rate: 6,
    gross: 2550,
    pf: 255,
    net: 2295,
  },
  {
    id: 2,
    worker: 'Murugan S',
    trees: 380,
    rate: 6,
    gross: 2280,
    pf: 228,
    net: 2052,
  },
  {
    id: 3,
    worker: 'Selvam P',
    trees: 465,
    rate: 6,
    gross: 2790,
    pf: 279,
    net: 2511,
  },
  {
    id: 4,
    worker: 'Karthik R',
    trees: 392,
    rate: 6,
    gross: 2352,
    pf: 235,
    net: 2117,
  },
  {
    id: 5,
    worker: 'Rajesh M',
    trees: 0,
    rate: 6,
    gross: 0,
    pf: 0,
    net: 0,
  },
];

export function SalaryPage() {
  const [weekStart, setWeekStart] = useState('2026-05-05');
  const [weekEnd, setWeekEnd] = useState('2026-05-11');

  const totalGross = salaryData.reduce((sum, item) => sum + item.gross, 0);
  const totalPF = salaryData.reduce((sum, item) => sum + item.pf, 0);
  const totalNet = salaryData.reduce((sum, item) => sum + item.net, 0);

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Weekly Salary</h1>
          <p className="text-muted-foreground">Calculate and manage worker payroll</p>
        </div>

        {/* Top Controls */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Week Selector */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Week Start</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={weekStart}
                    onChange={(e) => setWeekStart(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Week End</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={weekEnd}
                    onChange={(e) => setWeekEnd(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-all">
                <FileSpreadsheet className="w-5 h-5" />
                <span>Excel</span>
              </button>
              <button className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-all">
                <Download className="w-5 h-5" />
                <span>PDF</span>
              </button>
              <button className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md">
                <Printer className="w-5 h-5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white shadow-lg">
            <p className="text-white/80 mb-2">Gross Salary</p>
            <h3 className="text-3xl font-bold">₹{totalGross.toLocaleString()}</h3>
          </div>
          <div className="bg-gradient-to-br from-warning to-warning/80 rounded-xl p-6 text-white shadow-lg">
            <p className="text-white/80 mb-2">PF Deduction (10%)</p>
            <h3 className="text-3xl font-bold">₹{totalPF.toLocaleString()}</h3>
          </div>
          <div className="bg-gradient-to-br from-success to-success/80 rounded-xl p-6 text-white shadow-lg">
            <p className="text-white/80 mb-2">Net Salary</p>
            <h3 className="text-3xl font-bold">₹{totalNet.toLocaleString()}</h3>
          </div>
        </div>

        {/* Salary Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Worker</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-semibold">Trees</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-semibold">Rate (₹)</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-semibold">Gross (₹)</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-semibold">PF (₹)</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-semibold">Net (₹)</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t border-border hover:bg-muted/30 transition-colors ${
                      item.net === 0 ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{item.worker.charAt(0)}</span>
                        </div>
                        <p className="font-medium text-foreground">{item.worker}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-foreground">{item.trees}</td>
                    <td className="py-4 px-6 text-right text-foreground">{item.rate}</td>
                    <td className="py-4 px-6 text-right font-semibold text-foreground">
                      {item.gross.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right text-destructive font-medium">
                      {item.pf.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-success text-lg">
                      {item.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="border-t-2 border-border bg-muted/30">
                  <td className="py-4 px-6 font-bold text-foreground">TOTAL</td>
                  <td className="py-4 px-6 text-right font-bold text-foreground">
                    {salaryData.reduce((sum, item) => sum + item.trees, 0)}
                  </td>
                  <td className="py-4 px-6"></td>
                  <td className="py-4 px-6 text-right font-bold text-foreground text-lg">
                    ₹{totalGross.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-destructive text-lg">
                    ₹{totalPF.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-success text-xl">
                    ₹{totalNet.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Rules Info */}
        <div className="mt-6 bg-info/10 border border-info/20 rounded-xl p-6">
          <h3 className="font-semibold text-info mb-3">Current Salary Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Rate per Tree</p>
              <p className="font-semibold text-foreground">₹6.00</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">PF Deduction</p>
              <p className="font-semibold text-foreground">10%</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Effective Date</p>
              <p className="font-semibold text-foreground">January 1, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
