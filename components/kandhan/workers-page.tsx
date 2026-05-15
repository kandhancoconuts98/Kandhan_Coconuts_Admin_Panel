import { Search, Filter, Plus, Eye, Edit, Trash2, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

const workersData = [
  {
    id: 1,
    name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    status: 'active',
    treesThisWeek: 425,
    salaryThisWeek: 2550,
    farms: ['Farm A', 'Farm B'],
  },
  {
    id: 2,
    name: 'Murugan S',
    phone: '+91 98765 43211',
    status: 'active',
    treesThisWeek: 380,
    salaryThisWeek: 2280,
    farms: ['Farm C'],
  },
  {
    id: 3,
    name: 'Selvam P',
    phone: '+91 98765 43212',
    status: 'active',
    treesThisWeek: 465,
    salaryThisWeek: 2790,
    farms: ['Farm B', 'Farm D'],
  },
  {
    id: 4,
    name: 'Karthik R',
    phone: '+91 98765 43213',
    status: 'active',
    treesThisWeek: 392,
    salaryThisWeek: 2352,
    farms: ['Farm A'],
  },
  {
    id: 5,
    name: 'Rajesh M',
    phone: '+91 98765 43214',
    status: 'leave',
    treesThisWeek: 0,
    salaryThisWeek: 0,
    farms: ['Farm C'],
  },
];

export function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Workers Management</h1>
          <p className="text-muted-foreground">Manage and track all farm workers</p>
        </div>

        {/* Top Bar */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search workers by name or phone..."
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filters and Add Button */}
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-all">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <button className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md">
                <Plus className="w-5 h-5" />
                <span>Add Worker</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workers Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Worker</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Phone</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Trees This Week</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Salary This Week</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Assigned Farms</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workersData.map((worker) => (
                  <tr key={worker.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{worker.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{worker.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-foreground">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {worker.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          worker.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {worker.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-foreground">{worker.treesThisWeek}</td>
                    <td className="py-4 px-6 font-semibold text-foreground">₹{worker.salaryThisWeek}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {worker.farms.map((farm, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                          >
                            <MapPin className="w-3 h-3" />
                            {farm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-info/10 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-info" />
                        </button>
                        <button className="p-2 hover:bg-warning/10 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-warning" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-border p-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 1 to 5 of 24 workers</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all">2</button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all">3</button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
