import { supabase } from './supabase';
import type { Truck, Driver, Customer, Load, Invoice, TrackingEvent, DashboardMetrics } from './types';

// Supabase-backed data layer
// Falls back to empty arrays when tables are not seeded yet

export async function getTrucks(): Promise<Truck[]> {
  const { data, error } = await supabase.from('trucks').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getTrucks error', error); return []; }
  return data || [];
}

export async function getDrivers(): Promise<Driver[]> {
  const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getDrivers error', error); return []; }
  return data || [];
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getCustomers error', error); return []; }
  return data || [];
}

export async function getLoads(): Promise<Load[]> {
  const { data, error } = await supabase.from('loads').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getLoads error', error); return []; }
  return data || [];
}

export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getInvoices error', error); return []; }
  return data || [];
}

export async function getTrackingEvents(loadId: string): Promise<TrackingEvent[]> {
  const { data, error } = await supabase.from('tracking_events').select('*').eq('load_id', loadId).order('timestamp', { ascending: false });
  if (error) { console.error('getTrackingEvents error', error); return []; }
  return data || [];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const trucks = await getTrucks();
  const drivers = await getDrivers();
  const loads = await getLoads();
  const invoices = await getInvoices();

  const activeTrucks = trucks.filter(t => t.status === 'active').length;
  const activeDrivers = drivers.filter(d => d.status === 'driving' || d.status === 'on_duty').length;
  const loadsInTransit = loads.filter(l => l.status === 'in_transit').length;
  const deliveredToday = loads.filter(l => l.status === 'delivered').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);
  const pendingLoads = loads.filter(l => l.status === 'pending').length;

  return { activeTrucks, activeDrivers, loadsInTransit, deliveredToday, totalRevenue, pendingLoads };
}

export async function getLoadsByStatus(): Promise<{ status: string; count: number }[]> {
  const loads = await getLoads();
  const counts: Record<string, number> = {};
  loads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export async function getRecentLoads(limit = 5): Promise<Load[]> {
  return getLoads().then(loads => loads.slice(0, limit));
}

export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  return getInvoices().then(invoices => invoices.slice(0, limit));
}

export async function updateLoad(id: string, changes: Partial<Load>) {
  const { error } = await supabase.from('loads').update(changes).eq('id', id);
  if (error) { console.error('updateLoad error', error); throw error; }
  return true;
}
