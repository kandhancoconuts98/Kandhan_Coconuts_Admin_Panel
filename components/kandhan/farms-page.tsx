import { MapPin, Users, TreeDeciduous, TrendingUp } from 'lucide-react';

const farmsData = [
  {
    id: 1,
    name: 'Farm A',
    location: 'Pollachi, Tamil Nadu',
    trees: 850,
    workers: 8,
    productivity: 92,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Farm B',
    location: 'Coimbatore, Tamil Nadu',
    trees: 620,
    workers: 6,
    productivity: 88,
    image: 'https://images.unsplash.com/photo-1598516370961-47e84f5d7c4f?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Farm C',
    location: 'Palakkad, Kerala',
    trees: 1200,
    workers: 10,
    productivity: 95,
    image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Farm D',
    location: 'Erode, Tamil Nadu',
    trees: 480,
    workers: 5,
    productivity: 85,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
  },
];

export function FarmsPage() {
  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farms Management</h1>
          <p className="text-muted-foreground">Manage and monitor all coconut farms</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">4</h3>
            <p className="text-muted-foreground text-sm">Total Farms</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TreeDeciduous className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">3,150</h3>
            <p className="text-muted-foreground text-sm">Total Trees</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">29</h3>
            <p className="text-muted-foreground text-sm">Total Workers</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">90%</h3>
            <p className="text-muted-foreground text-sm">Avg Productivity</p>
          </div>
        </div>

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmsData.map((farm) => (
            <div
              key={farm.id}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            >
              {/* Farm Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold mb-1">{farm.name}</h3>
                  <p className="text-white/90 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {farm.location}
                  </p>
                </div>
              </div>

              {/* Farm Details */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Trees</p>
                    <p className="font-bold text-foreground">{farm.trees}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Workers</p>
                    <p className="font-bold text-foreground">{farm.workers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Score</p>
                    <p className="font-bold text-success">{farm.productivity}%</p>
                  </div>
                </div>

                {/* Productivity Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Productivity</span>
                    <span>{farm.productivity}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all"
                      style={{ width: `${farm.productivity}%` }}
                    ></div>
                  </div>
                </div>

                {/* View Details Button */}
                <button className="w-full py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all font-medium group-hover:bg-primary group-hover:text-primary-foreground">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
