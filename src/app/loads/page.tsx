'use client';
import { useState, useEffect } from 'react';
import { getLoads } from '@/lib/data';
import { Package, MapPin, Calendar, DollarSign } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700 border-gray-200',
  assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  picked_up: 'bg-amber-100 text-amber-700 border-amber-200',
  in_transit: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  canceled: 'bg-red-100 text-red-700 border-red-200',
};

export default function LoadsPage() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoads().then(data => { setLoads(data); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Loads</h1>
        <p className="text-muted-foreground mt-1">Track and manage shipments</p>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border bg-muted/40">
              <th className="px-4 py-3 font-medium">Load #</th>
              <th className="px-4 py-3 font-medium">Origin</th>
              <th className="px-4 py-3 font-medium">Destination</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loads.slice(0, 50).map((load) => (
              <tr key={load.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{load.load_number}</td>
                <td className="px-4 py-3 text-muted-foreground">{load.stops?.[0]?.address || '-'}</td>
                <td className="px-4 py-3 text-muted-foreground">{load.stops?.[load.stops?.length - 1]?.address || '-'}</td>
                <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[load.status] || 'bg-gray-100 text-gray-700'}`}>{load.status}</span></td>
                <td className="px-4 py-3 font-medium text-card-foreground">${load.rate?.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(load.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}