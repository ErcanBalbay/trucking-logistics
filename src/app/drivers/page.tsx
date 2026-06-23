'use client';
import { useState, useEffect } from 'react';
import { getDrivers } from '@/lib/data';
import { Users, Phone, Mail, MapPin } from 'lucide-react';

const statusColors: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  on_duty: 'bg-blue-100 text-blue-700 border-blue-200',
  driving: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  off_duty: 'bg-gray-100 text-gray-700 border-gray-200',
  on_break: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrivers().then(data => { setDrivers(data); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Drivers</h1>
        <p className="text-muted-foreground mt-1">Manage your drivers roster</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">{d.first_name?.[0]}{d.last_name?.[0]}</div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{d.first_name} {d.last_name}</h3>
                  <p className="text-xs text-muted-foreground">CDL #{d.license_number}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>{d.status.replace('_', ' ')}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} />{d.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone size={14} />{d.phone}</div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Pay Rate</span>
                <span className="font-medium text-card-foreground">{d.pay_rate} {d.pay_type === 'per_mile' ? '$/mi' : d.pay_type === 'percentage' ? '%' : 'flat'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}