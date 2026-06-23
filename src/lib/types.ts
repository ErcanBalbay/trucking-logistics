// === Enums ===

export type TruckStatus = 'active' | 'in_maintenance' | 'out_of_service' | 'available';
export type DriverStatus = 'available' | 'on_duty' | 'driving' | 'off_duty' | 'on_break';
export type LoadStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'canceled';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

// === Core Entities ===

export interface Truck {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: TruckStatus;
  fuelType: 'diesel' | 'gasoline' | 'electric';
  capacityKg: number;
  mpg: number;
  lastOdometer: number;
  insuranceExpiry: string;
  registrationExpiry: string;
  notes: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseEndorsements: string[];
  medicalCardExpiry: string;
  status: DriverStatus;
  payRate: number;
  payType: 'percentage' | 'flat_rate' | 'per_mile';
  assignedTruckId: string | null;
  notes: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface LoadStop {
  id: string;
  type: 'pickup' | 'delivery';
  location: string;
  address: string;
  contactName: string;
  contactPhone: string;
  scheduledDate: string;
  notes: string;
}

export interface Load {
  id: string;
  loadNumber: string;
  customerId: string;
  truckId: string | null;
  driverId: string | null;
  status: LoadStatus;
  stops: LoadStop[];
  weightKg: number;
  commodity: string;
  rate: number;
  distanceMiles: number;
  specialInstructions: string;
  bolFile: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  loadId: string;
  customerId: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
  notes: string;
}

export interface TrackingEvent {
  id: string;
  loadId: string;
  status: LoadStatus;
  location: string;
  timestamp: string;
  notes: string;
}

// === Dashboard Types ===

export interface DashboardMetrics {
  activeTrucks: number;
  activeDrivers: number;
  loadsInTransit: number;
  deliveredToday: number;
  totalRevenue: number;
  pendingLoads: number;
}