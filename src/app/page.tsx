'use client';

import { getDashboardMetrics, getRecentLoads, getRecentInvoices, getDrivers, getTrucks, getLoadsByStatus } from '@/lib/data';
import { Truck, Users, Package, DollarSign, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

const customerNames: Record<string, string> = {
  c1: 'Acme Corp', c2: 'Global Logistics', c3: 'Midwest Supplies',
  c4: 'Sunbelt Mfg', c5: 'Pacific Foods', c6: 'Lone Star Mat',
  c7: 'GL Auto Parts', c8: 'Atlantic Retail', c9: 'Rocky Supply', c10: 'NW Timber',
};

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const recentLoads = getRecentLoads(5);
  const recentInvoices = getRecentInvoices(5);
  const loadsByStatus = getLoadsByStatus();

  const kpiCards = [
    { label: 'Active Trucks', value: metrics.activeTrucks, total: getTrucks().length, icon: Truck, color: 'bg-blue-600' },
    { label: 'Active Drivers', value: metrics.activeDrivers, total: getDrivers().length, icon: Users, color: 'bg-emerald-600' },
    { label: 'In Transit', value: metrics.loadsInTransit, icon: Package, color: 'bg-cyan-600' },
    { label: 'Pending Loads', value: metrics.pendingLoads, icon: Clock, color: 'bg-amber-600' },
    { label: 'Delivered Today', value: metrics.deliveredToday, icon: AlertCircle, color: 'bg-violet-600' },
    { label: 'Revenue (Paid)', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-600' },
  ];

  function getCustomerName(id: string) { return customerNames[id] || 'Unknown'; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your fleet operations</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.total !== undefined && (kpi.label === 'Active Trucks' || kpi.label === 'Active Drivers') ? (kpi.label === 'Active Trucks' ? '/trucks' : '/drivers') : '/loads'}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                <kpi.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-2xl font-bold text-card-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{kpi.label}{kpi.total !== undefined ? ` (of ${kpi.total})` : ''}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold text-card-foreground mb-4">Loads by Status</h2>
          <div className="space-y-3">
            {loadsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <StatusBadge status={item.status} />
                <span className="text-sm font-bold text-card-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-card-foreground">Recent Loads</h2>
            <Link href="/loads" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Load #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Rate</th>
                  <th className="pb-3 font-medium">Commodity</th>
                  <th className="pb-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentLoads.map((load) => (
                  <tr key={load.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium text-card-foreground">{load.loadNumber}</td>
                    <td className="py-3 text-muted-foreground">{getCustomerName(load.customerId)}</td>
                    <td className="py-3"><StatusBadge status={load.status} /></td>
                    <td className="py-3 font-medium text-card-foreground">${load.rate.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground text-xs">{load.commodity}</td>
                    <td className="py-3 text-muted-foreground text-xs">{new Date(load.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-card-foreground">Recent Invoices</h2>
          <Link href="/invoices" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Invoice #</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 font-medium text-card-foreground">{inv.invoiceNumber}</td>
                  <td className="py-3 text-muted-foreground">{getCustomerName(inv.customerId)}</td>
                  <td className="py-3 font-medium text-card-foreground">${inv.amount.toLocaleString()}</td>
                  <td className="py-3"><StatusBadge status={inv.status} /></td>
                  <td className="py-3 text-muted-foreground text-xs">{inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}