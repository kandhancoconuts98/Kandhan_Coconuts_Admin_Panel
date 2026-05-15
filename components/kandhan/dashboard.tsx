import { Users, TreeDeciduous, DollarSign, UserX, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Mon', trees: 450, salary: 2700 },
  { day: 'Tue', trees: 520, salary: 3120 },
  { day: 'Wed', trees: 480, salary: 2880 },
  { day: 'Thu', trees: 610, salary: 3660 },
  { day: 'Fri', trees: 580, salary: 3480 },
  { day: 'Sat', trees: 650, salary: 3900 },
  { day: 'Sun', trees: 420, salary: 2520 },
];

const salaryDistribution = [
  { name: 'Farm A', value: 12500 },
  { name: 'Farm B', value: 8200 },
  { name: 'Farm C', value: 15600 },
  { name: 'Farm D', value: 9800 },
];

const recentActivity = [
  { worker: 'Ravi Kumar', farm: 'Farm A', trees: 85, status: 'completed', time: '2 hours ago' },
  { worker: 'Murugan S', farm: 'Farm C', trees: 72, status: 'completed', time: '3 hours ago' },
  { worker: 'Selvam P', farm: 'Farm B', trees: 95, status: 'completed', time: '4 hours ago' },
  { worker: 'Karthik R', farm: 'Farm D', trees: 68, status: 'completed', time: '5 hours ago' },
];

const COLORS = ['#2E7D32', '#4CAF50', '#A5D6A7', '#22C55E'];

export function Dashboard() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-white/90 mb-6">Kandhan Coconuts - Farm Management</p>
          <p className="text-white/80 mb-4">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Add Worker
            </button>
            <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Daily Entry
            </button>
            <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              View Salary
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Workers */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="flex items-center gap-1 text-success text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">24</h3>
            <p className="text-muted-foreground text-sm">Total Workers</p>
          </div>

          {/* Total Trees This Week */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TreeDeciduous className="w-6 h-6 text-secondary" />
              </div>
              <span className="flex items-center gap-1 text-success text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +8%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">3,710</h3>
            <p className="text-muted-foreground text-sm">Trees This Week</p>
          </div>

          {/* Weekly Salary */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <span className="flex items-center gap-1 text-success text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +5%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">₹22,260</h3>
            <p className="text-muted-foreground text-sm">Weekly Salary</p>
          </div>

          {/* Absent Workers */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-destructive" />
              </div>
              <span className="flex items-center gap-1 text-destructive text-sm font-medium">
                <TrendingDown className="w-4 h-4" />
                +2
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">3</h3>
            <p className="text-muted-foreground text-sm">Absent Workers</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Productivity */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Productivity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="trees" stroke="#2E7D32" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Salary Distribution by Farm</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={salaryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salaryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farm Performance Chart */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Salary Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="salary" fill="#2E7D32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Worker</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Farm</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Trees</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{activity.worker}</td>
                    <td className="py-3 px-4 text-foreground">{activity.farm}</td>
                    <td className="py-3 px-4 text-foreground">{activity.trees}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                        {activity.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <h4 className="font-semibold text-warning mb-2">Missing Entries</h4>
            <p className="text-sm text-foreground">2 workers haven't submitted today's entry</p>
          </div>
          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <h4 className="font-semibold text-info mb-2">Low Attendance</h4>
            <p className="text-sm text-foreground">Farm B has only 60% attendance today</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <h4 className="font-semibold text-success mb-2">Salary Ready</h4>
            <p className="text-sm text-foreground">Weekly payroll is ready for processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
