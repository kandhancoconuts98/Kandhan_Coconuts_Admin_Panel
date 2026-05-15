import { Calendar, Search, Save, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface EntryRow {
  id: number;
  workerName: string;
  farms: { name: string; trees: number }[];
  status: 'present' | 'absent' | 'leave';
  notes: string;
}

export function DailyEntryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<EntryRow[]>([
    {
      id: 1,
      workerName: 'Ravi Kumar',
      farms: [{ name: 'Farm A', trees: 45 }],
      status: 'present',
      notes: '',
    },
    {
      id: 2,
      workerName: 'Murugan S',
      farms: [{ name: 'Farm C', trees: 52 }],
      status: 'present',
      notes: '',
    },
    {
      id: 3,
      workerName: 'Selvam P',
      farms: [{ name: 'Farm B', trees: 38 }, { name: 'Farm D', trees: 42 }],
      status: 'present',
      notes: '',
    },
    {
      id: 4,
      workerName: 'Karthik R',
      farms: [{ name: 'Farm A', trees: 48 }],
      status: 'present',
      notes: '',
    },
    {
      id: 5,
      workerName: 'Rajesh M',
      farms: [],
      status: 'leave',
      notes: 'Medical leave',
    },
  ]);

  const addFarmToWorker = (workerId: number) => {
    setEntries(
      entries.map((entry) =>
        entry.id === workerId
          ? { ...entry, farms: [...entry.farms, { name: 'Farm A', trees: 0 }] }
          : entry
      )
    );
  };

  const removeFarmFromWorker = (workerId: number, farmIndex: number) => {
    setEntries(
      entries.map((entry) =>
        entry.id === workerId
          ? { ...entry, farms: entry.farms.filter((_, index) => index !== farmIndex) }
          : entry
      )
    );
  };

  const updateFarmTrees = (workerId: number, farmIndex: number, trees: number) => {
    setEntries(
      entries.map((entry) =>
        entry.id === workerId
          ? {
              ...entry,
              farms: entry.farms.map((farm, index) =>
                index === farmIndex ? { ...farm, trees } : farm
              ),
            }
          : entry
      )
    );
  };

  const updateStatus = (workerId: number, status: 'present' | 'absent' | 'leave') => {
    setEntries(entries.map((entry) => (entry.id === workerId ? { ...entry, status } : entry)));
  };

  const totalTrees = entries.reduce(
    (sum, entry) => sum + entry.farms.reduce((farmSum, farm) => farmSum + farm.trees, 0),
    0
  );
  const estimatedSalary = totalTrees * 6;

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bulk Daily Entry</h1>
          <p className="text-muted-foreground">Record daily operations for all workers</p>
        </div>

        {/* Top Controls */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Date Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Search Workers */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search Workers</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-end">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md">
                <Save className="w-5 h-5" />
                <span>Save All Entries</span>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Workers</p>
              <p className="text-2xl font-bold text-foreground">{entries.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Trees</p>
              <p className="text-2xl font-bold text-foreground">{totalTrees}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Salary</p>
              <p className="text-2xl font-bold text-foreground">₹{estimatedSalary}</p>
            </div>
          </div>
        </div>

        {/* Entry Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold w-1/6">Worker Name</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold w-2/5">Farms & Trees</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold w-1/6">Status</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold w-1/4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    {/* Worker Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{entry.workerName.charAt(0)}</span>
                        </div>
                        <p className="font-medium text-foreground">{entry.workerName}</p>
                      </div>
                    </td>

                    {/* Farms & Trees */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        {entry.farms.map((farm, farmIndex) => (
                          <div key={farmIndex} className="flex items-center gap-2">
                            <select
                              value={farm.name}
                              className="flex-1 px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            >
                              <option>Farm A</option>
                              <option>Farm B</option>
                              <option>Farm C</option>
                              <option>Farm D</option>
                            </select>
                            <input
                              type="number"
                              value={farm.trees}
                              onChange={(e) => updateFarmTrees(entry.id, farmIndex, parseInt(e.target.value) || 0)}
                              className="w-20 px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              placeholder="Trees"
                            />
                            <button
                              onClick={() => removeFarmFromWorker(entry.id, farmIndex)}
                              className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addFarmToWorker(entry.id)}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Farm
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(entry.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            entry.status === 'present'
                              ? 'bg-success text-white'
                              : 'bg-success/10 text-success hover:bg-success/20'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => updateStatus(entry.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            entry.status === 'absent'
                              ? 'bg-destructive text-white'
                              : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => updateStatus(entry.id, 'leave')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            entry.status === 'leave'
                              ? 'bg-warning text-white'
                              : 'bg-warning/10 text-warning hover:bg-warning/20'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={entry.notes}
                        onChange={(e) =>
                          setEntries(entries.map((e) => (e.id === entry.id ? { ...e, notes: e.target.value } : e)))
                        }
                        placeholder="Add notes..."
                        className="w-full px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Save Button (Mobile) */}
        <div className="fixed bottom-8 right-8 lg:hidden">
          <button className="flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 transition-all">
            <Save className="w-5 h-5" />
            <span className="font-semibold">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
