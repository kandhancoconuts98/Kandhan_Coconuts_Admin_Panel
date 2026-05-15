import { FileText, Users, Calendar, DollarSign, BarChart3, TrendingUp } from 'lucide-react';

export function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">View comprehensive reports and insights</p>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Worker Reports */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Users className="w-8 h-8 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Worker Reports</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Productivity, attendance, and performance analysis
            </p>
            <button className="text-primary font-medium hover:underline flex items-center gap-1">
              View Report
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Attendance Reports */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all">
              <Calendar className="w-8 h-8 text-secondary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Attendance Reports</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Calendar heatmaps, trends, and leave analysis
            </p>
            <button className="text-secondary font-medium hover:underline flex items-center gap-1">
              View Report
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Farm Reports */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-info group-hover:scale-110 transition-all">
              <BarChart3 className="w-8 h-8 text-info group-hover:text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Farm Reports</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Farm analytics, productivity heatmap, cost analysis
            </p>
            <button className="text-info font-medium hover:underline flex items-center gap-1">
              View Report
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Financial Reports */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-warning group-hover:scale-110 transition-all">
              <DollarSign className="w-8 h-8 text-warning group-hover:text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Financial Reports</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Salary trends, expense tracking, revenue insights
            </p>
            <button className="text-warning font-medium hover:underline flex items-center gap-1">
              View Report
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Custom Reports */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-success group-hover:scale-110 transition-all">
              <FileText className="w-8 h-8 text-success group-hover:text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Custom Reports</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Build custom reports with flexible filters
            </p>
            <button className="text-success font-medium hover:underline flex items-center gap-1">
              Create Report
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Export Center */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white shadow-lg cursor-pointer group hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Export Center</h3>
            <p className="text-white/90 mb-4 text-sm">
              Export all data to Excel, PDF, or CSV formats
            </p>
            <button className="text-white font-medium underline flex items-center gap-1">
              Export Data
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
