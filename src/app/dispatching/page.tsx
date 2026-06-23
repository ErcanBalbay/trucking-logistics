'use client';
import { useState } from 'react';
import { getLoads, getTrucks, getDrivers, updateLoad } from '@/lib/data';
import { ClipboardList, Truck, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700 border-gray-200',
  assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  picked_up: 'bg-amber-100 text-amber-700 border-amber-200',
  in_transit: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  canceled: 'bg-red-100 text-red-700 border-red-200',
};

export default function DispatchingPage() {
  const loads = getLoads();
  const trucks = getTrucks();
  const drivers = getDrivers();

  const pending = loads.filter(l => l.status === 'pending');
  const active = loads.filter(l => ['assigned', 'picked_up', 'in_transit'].includes(l.status));

  function assign(loadId: string, truckId: string, driverId: string) {
    updateLoad(loadId, { truckId, driverId, status: 'assigned' });
    (window as any).location.reload();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dispatching</h1>
        <p className="text-muted-foreground mt-1">Assign trucks and drivers to loads</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pending Loads */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="text-amber-600" size={20} />
            <h2 className="font-semibold text-card-foreground">Pending Loads ({pending.length})</h2>
          </div>
          <div className="space-y-3">
            {pending.map(load => (
              <div key={load.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-card-foreground">{load.loadNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">{load.stops[0]?.address} → {load.stops[load.stops.length - 1]?.address}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[load.status]}`}>{load.status.replace('_', ' ')}</span>
                </div>
                <AssignForm load={load} trucks={trucks} drivers={drivers} onAssign={assign} />
              </div>
            ))}
            {pending.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No pending loads</p>}
          </div>
        </div>

        {/* Active Loads */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <h2 className="font-semibold text-card-foreground">Active Loads ({active.length})</h2>
          </div>
          <div className="space-y-3">
            {active.map(load => {
              const truck = trucks.find(t => t.id === load.truckId);
              const driver = drivers.find(d => d.id === load.driverId);
              return (
                <div key={load.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-card-foreground">{load.loadNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">{load.stops[0]?.address} → {load.stops[load.stops.length - 1]?.address}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[load.status]}`}>{load.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    {truck && <span className="flex items-center gap-1"><Truck size={14} />{truck.plate}</span>}
                    {driver && <span className="flex items-center gap-1"><User size={14} />{driver.firstName} {driver.lastName}</span>}
                  </div>
                </div>
              );
            })}
            {active.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No active loads</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignForm({ load, trucks, drivers, onAssign }: { load: any, trucks: any[], drivers: any[], onAssign: (id: string, t: string, d: string) => void }) {
  const [truckId, setTruckId] = useState('');
  const [driverId, setDriverId] = useState('');
  const availableTrucks = trucks.filter(t => t.status === 'active' || t.status === 'available');
  const availableDrivers = drivers.filter(d => d.status === 'available' || d.status === 'on_duty');

  return (
    <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
      <select value={truckId} onChange={e => setTruckId(e.target.value)} className="px-2 py-1.5 rounded-md border border-border bg-background text-xs text-foreground">
        <option value="">Select truck...</option>
        {availableTrucks.map(t => <option key={t.id} value={t.id}>{t.plate} — {t.year} {t.make}</option>)}
      </select>
      <select value={driverId} onChange={e => setDriverId(e.target.value)} className="px-2 py-1.5 rounded-md border border-border bg-background text-xs text-foreground">
        <option value="">Select driver...</option>
        {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
      </select>
      <button
        disabled={!truckId || !driverId}
        onClick={() => onAssign(load.id, truckId, driverId)}
        className="col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Assign <ArrowRight size={14} />
      </button>
    </div>
  );
}