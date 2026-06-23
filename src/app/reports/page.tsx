'use client';
import { getDashboardMetrics, getLoadsByStatus, getTrucks, getDrivers, getInvoices } from '@/lib/data';
import { BarChart3, TrendingUp, Truck, Users, Package, DollarSign, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  const metrics = getDashboardMetrics();
  const byStatus = getLoadsByStatus();
  const trucks = getTrucks();
  const drivers = getDrivers();
  const invoices = getInvoices();
  const total = invoices.length;
  const paid = invoices.filter(i => i.status === 'paid').length;
  const overdue = invoices.filter(i => i.status === 'overdue').length;
  const collectionRate = total ? ((paid / total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Fleet performance and financial overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-emerald-600" size={20}/>} />
        <StatCard title="Collection Rate" value={`${collectionRate}%`} icon={<TrendingUp className="text-blue-600" size={20}/>} />
        <StatCard title="Fleet Utilization" value={`${trucks.filter(t=>t.status==='active').length}/${trucks.length}`} icon={<Truck className="text-cyan-600" size={20}/>} />
        <StatCard title="Overdue Invoices" value={overdue.toString()} icon={<AlertTriangle className="text-red-600" size={20}/>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold text-card-foreground mb-4">Loads by Status</h2>
          <div className="space-y-3">
            {byStatus.map(item => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">{item.status.replace('_', ' ')}</span>
                <span className="text-sm font-bold text-card-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold text-card-foreground mb-4">Fleet Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Trucks</span><span className="font-medium text-card-foreground">{trucks.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Active Trucks</span><span className="font-medium text-card-foreground">{trucks.filter(t=>t.status==='active').length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Drivers</span><span className="font-medium text-card-foreground">{drivers.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Invoices</span><span className="font-medium text-card-foreground">{total}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-medium text-emerald-600">{paid}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Overdue</span><span className="font-medium text-red-600">{overdue}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}