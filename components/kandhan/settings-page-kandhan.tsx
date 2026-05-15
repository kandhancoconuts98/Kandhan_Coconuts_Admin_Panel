import { Building2, Users, Shield, Globe, Palette, Bell } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Organization Settings */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Organization</h3>
                <p className="text-sm text-muted-foreground">Manage organization details</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                <input
                  type="text"
                  defaultValue="Kandhan Coconuts"
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 tamil">தமிழ் பெயர்</label>
                <input
                  type="text"
                  defaultValue="கந்தன் தென்னை"
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tamil"
                />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Users & Roles</h3>
                <p className="text-sm text-muted-foreground">Manage user access and permissions</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-medium">
              Manage Users
            </button>
          </div>

          {/* Language & Region */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-info" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Language & Region</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                <select className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>English</option>
                  <option>தமிழ் (Tamil)</option>
                  <option>Both</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">Customize appearance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-white border-2 border-primary rounded-lg font-medium text-foreground">
                Light
              </button>
              <button className="flex-1 py-2.5 bg-gray-800 border-2 border-transparent rounded-lg font-medium text-white hover:border-primary transition-all">
                Dark
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage notification preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-foreground">Email Notifications</span>
                <input type="checkbox" className="w-5 h-5 text-primary border-border rounded focus:ring-primary" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-foreground">Daily Reports</span>
                <input type="checkbox" className="w-5 h-5 text-primary border-border rounded focus:ring-primary" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-foreground">Salary Alerts</span>
                <input type="checkbox" className="w-5 h-5 text-primary border-border rounded focus:ring-primary" defaultChecked />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
