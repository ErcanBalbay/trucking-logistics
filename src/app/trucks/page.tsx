'use client';

import { useState } from 'react';
import { getTrucks } from '@/lib/data';
import { Truck, Plus, Search, Pencil } from 'lucide-react';
import { Truck as TruckType } from '@/lib/types';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  in_maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  out_of_service: 'bg-red-100 text-red-700 border-red-200',
  available: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function TrucksPage() {
  const trucks = getTrucks();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<TruckType | null>(null);

  const filtered = trucks.filter(t =>
    t.plate.toLowerCase().includes(search.toLowerCase()) ||
    t.make.toLowerCase().includes(search.toLowerCase()) ||
    t.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fleet</h1>
          <p className="text-muted-foreground mt-1">Manage your truck inventory</p>
        </div>
        <button
          onClick={() => setEditing({} as any)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Truck
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search by plate, make, or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((truck) => (
          <div key={truck.id} className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{truck.year} {truck.make} {truck.model}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{truck.plate}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[truck.status] || 'bg-gray-100 text-gray-700'}`}>
                {truck.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">VIN</span>
                <span className="font-mono text-xs text-card-foreground">{truck.vin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Odometer</span>
                <span className="font-medium text-card-foreground">{truck.lastOdometer.toLocaleString()} mi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance</span>
                <span className="text-card-foreground">{truck.insuranceExpiry ? new Date(truck.insuranceExpiry).toLocaleDateString() : '-'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={() => setEditing(truck)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-5">{editing.make ? 'Edit Truck' : 'Add Truck'}</h2>
              <form onSubmit={(e) => { e.preventDefault(); setEditing(null); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Make</label>
                    <input name="make" defaultValue={editing.make} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Model</label>
                    <input name="model" defaultValue={editing.model} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Year</label>
                    <input name="year" type="number" defaultValue={editing.year || new Date().getFullYear()} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Plate</label>
                    <input name="plate" defaultValue={editing.plate} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">VIN</label>
                  <input name="vin" defaultValue={editing.vin} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select name="status" defaultValue={editing.status || 'active'} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="active">Active</option>
                    <option value="available">Available</option>
                    <option value="in_maintenance">In Maintenance</option>
                    <option value="out_of_service">Out of Service</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}