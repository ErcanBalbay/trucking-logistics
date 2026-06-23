import { Truck, Driver, Load, Customer, Invoice, TrackingEvent, DashboardMetrics, LoadStatus } from './types';

// ============================================================
// DETERMINISTIC MOCK DATA GENERATOR
// Generates 1 year of historical data: 15 trucks, 15 drivers,
// 10 customers, ~360 loads, ~300 invoices
// ============================================================

const NOW = new Date('2026-06-24T12:00:00Z');

function formatDate(d: Date): string {
  return d.toISOString();
}

function subMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() - n);
  return r;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function randomSeed(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = randomSeed(42);

// ============================================================
// TRUCK DATA — 15 trucks
// ============================================================
const truckSpecs = [
  { make: 'Volvo', model: 'VNL 860', capacities: [22000, 24000], mpgRange: [7.0, 7.8] },
  { make: 'Kenworth', model: 'T680', capacities: [20000, 22000], mpgRange: [7.2, 8.0] },
  { make: 'Freightliner', model: 'Cascadia', capacities: [21000, 23000], mpgRange: [6.8, 7.6] },
  { make: 'Peterbilt', model: '579', capacities: [23000, 25000], mpgRange: [7.5, 8.3] },
  { make: 'Mack', model: 'Anthem', capacities: [19500, 21000], mpgRange: [6.5, 7.3] },
  { make: 'International', model: 'LT625', capacities: [20500, 22500], mpgRange: [6.9, 7.7] },
  { make: 'Volvo', model: 'VNR 640', capacities: [19000, 21000], mpgRange: [7.1, 7.9] },
  { make: 'Kenworth', model: 'W990', capacities: [21500, 23500], mpgRange: [7.3, 8.1] },
  { make: 'Freightliner', model: 'Cascadia 126', capacities: [22000, 24000], mpgRange: [7.0, 7.8] },
  { make: 'Peterbilt', model: '567', capacities: [20000, 22000], mpgRange: [7.2, 7.9] },
  { make: 'Mack', model: 'Pinnacle', capacities: [19000, 20500], mpgRange: [6.6, 7.4] },
  { make: 'Western Star', model: '49X', capacities: [21000, 23000], mpgRange: [6.8, 7.5] },
  { make: 'International', model: 'RH616', capacities: [20000, 22000], mpgRange: [7.0, 7.8] },
  { make: 'Volvo', model: 'VNL 860', capacities: [23000, 25000], mpgRange: [7.4, 8.2] },
  { make: 'Kenworth', model: 'T880', capacities: [20500, 22500], mpgRange: [7.1, 7.8] },
];

const plates = [
  'TRK-4501', 'TRK-7823', 'TRK-3356', 'TRK-9912', 'TRK-2147',
  'TRK-5628', 'TRK-8934', 'TRK-1278', 'TRK-6745', 'TRK-3092',
  'TRK-8451', 'TRK-2389', 'TRK-7564', 'TRK-5103', 'TRK-9876',
];

const vinPrefixes = ['4V4NC9TH', '1XKYD49X', '3AKJHHDR', '1XP5D49X', '1M1AN4GY',
  '2NKHHHDR', '3AKJDDDR', '4V4NC9TH', '1XKYD49X', '3AKJHHDR',
  '1XP5D49X', '5M1AN4GY', '2NKHHHDR', '4V4NC9TH', '1XKYD49X'];

const truckYears = [2023, 2022, 2021, 2024, 2020, 2022, 2023, 2021, 2024, 2020, 2022, 2023, 2021, 2024, 2022];

let trucks: Truck[] = [];
const truckIdByIndex: string[] = [];

for (let i = 0; i < 15; i++) {
  const spec = truckSpecs[i];
  const capacity = spec.capacities[0] + Math.floor(rand() * (spec.capacities[1] - spec.capacities[0]));
  const mpg = +(spec.mpgRange[0] + rand() * (spec.mpgRange[1] - spec.mpgRange[0])).toFixed(1);
  const truckYear = truckYears[i];
  const baseOdometer = ((2026 - truckYear) * 45000) + Math.floor(rand() * 20000);
  const statuses: Truck['status'][] = ['active','active','active','active','active','active','active','active','active','active','available','available','in_maintenance','in_maintenance','out_of_service'];
  const createdAt = subMonths(NOW, 6 + Math.floor(rand() * 18)).toISOString();

  const id = `t${i + 1}`;
  truckIdByIndex.push(id);

  trucks.push({
    id,
    plate: plates[i],
    make: spec.make,
    model: spec.model,
    year: truckYear,
    vin: `${vinPrefixes[i]}${String(100000 + Math.floor(rand() * 900000))}`,
    status: statuses[i],
    fuelType: i < 14 ? 'diesel' : 'electric',
    capacityKg: capacity,
    mpg,
    lastOdometer: baseOdometer + Math.floor(rand() * 5000),
    insuranceExpiry: addDays(NOW, 30 + Math.floor(rand() * 300)).toISOString().split('T')[0],
    registrationExpiry: addDays(NOW, 10 + Math.floor(rand() * 350)).toISOString().split('T')[0],
    notes: i === 12 ? 'Oil change due' : i === 13 ? 'Transmission issue' : '',
    createdAt,
  });
}

// ============================================================
// DRIVER DATA — 15 drivers
// ============================================================
const firstNames = ['John','Maria','Robert','Sarah','David','Jessica','Michael','Emily','James','Ashley','Daniel','Amanda','Christopher','Stephanie','Anthony'];
const lastNames = ['Anderson','Garcia','Chen','Johnson','Williams','Brown','Miller','Davis','Rodriguez','Martinez','Wilson','Taylor','Thomas','Jackson','White'];
const endorsementsPool = ['Hazmat', 'Tanker', 'Doubles/Triples'];
const allDriverStatuses: Driver['status'][] = ['driving','driving','driving','driving','driving','driving','driving','driving','on_duty','on_duty','available','available','off_duty','off_duty','on_break'];

let drivers: Driver[] = [];
const driverIdByIndex: string[] = [];

for (let i = 0; i < 15; i++) {
  const id = `d${i + 1}`;
  driverIdByIndex.push(id);
  const endorsements: string[] = [];
  if (rand() > 0.4) endorsements.push('Hazmat');
  if (rand() > 0.6) endorsements.push('Tanker');
  if (rand() > 0.7) endorsements.push('Doubles/Triples');

  drivers.push({
    id,
    firstName: firstNames[i],
    lastName: lastNames[i],
    email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@email.com`,
    phone: `(555) ${String(100 + Math.floor(rand() * 899))}-${String(1000 + Math.floor(rand() * 9000))}`,
    licenseNumber: `CDL-${String(10000 + Math.floor(rand() * 90000))}-${String.fromCharCode(65 + Math.floor(rand() * 26))}`,
    licenseEndorsements: endorsements,
    medicalCardExpiry: addDays(NOW, 30 + Math.floor(rand() * 300)).toISOString().split('T')[0],
    status: allDriverStatuses[i],
    payRate: 22 + Math.floor(rand() * 12),
    payType: i < 12 ? 'per_mile' : i < 14 ? 'flat_rate' : 'percentage',
    assignedTruckId: i < 12 ? truckIdByIndex[i] : null,
    notes: i === 12 ? 'On vacation until 07/15' : i === 14 ? 'Part time' : '',
    createdAt: subMonths(NOW, 6 + Math.floor(rand() * 18)).toISOString(),
  });
}

// ============================================================
// CUSTOMER DATA — 10 customers
// ============================================================
const customerData = [
  { name: 'Acme Corporation', company: 'Acme Corp', email: 'orders@acmecorp.com', phone: '(555) 111-2222', address: '123 Industrial Blvd, Chicago, IL 60601', notes: 'Net 30 terms' },
  { name: 'Global Logistics Inc.', company: 'Global Logistics', email: 'dispatch@globallogistics.com', phone: '(555) 222-3333', address: '456 Warehouse Dr, Newark, NJ 07101', notes: 'Preferred carrier' },
  { name: 'Midwest Supplies Co.', company: 'Midwest Supplies', email: 'shipping@midwestsupplies.com', phone: '(555) 333-4444', address: '789 Distribution Ave, St. Louis, MO 63101', notes: '' },
  { name: 'Sunbelt Manufacturing', company: 'Sunbelt Mfg', email: 'logistics@sunbeltmfg.com', phone: '(555) 444-5555', address: '1200 Factory Row, Atlanta, GA 30301', notes: 'Weekend deliveries OK' },
  { name: 'Pacific Coast Foods', company: 'Pacific Foods', email: 'supply@pacfoods.com', phone: '(555) 555-6666', address: '800 Harbor Blvd, Los Angeles, CA 90001', notes: 'Reefer only' },
  { name: 'Lone Star Materials', company: 'Lone Star Mat', email: 'dispatch@lonestar.com', phone: '(555) 666-7777', address: '500 Industrial Pkwy, Dallas, TX 75201', notes: 'Net 45 terms' },
  { name: 'Great Lakes Auto Parts', company: 'GL Auto Parts', email: 'receiving@glauto.com', phone: '(555) 777-8888', address: '350 Auto Mile, Detroit, MI 48201', notes: 'Call 2hrs before' },
  { name: 'Atlantic Retail Group', company: 'Atlantic Retail', email: 'dc@atlanticretail.com', phone: '(555) 888-9999', address: '200 Commerce Blvd, Charlotte, NC 28201', notes: '' },
  { name: 'Rocky Mountain Supply', company: 'Rocky Supply', email: 'orders@rockysupply.com', phone: '(555) 999-0000', address: '600 Distribution Ct, Denver, CO 80201', notes: 'Hazmat capable' },
  { name: 'Northwest Timber Co.', company: 'NW Timber', email: 'logistics@nwtimber.com', phone: '(555) 000-1111', address: '900 Forest Ave, Portland, OR 97201', notes: 'Flatbed loads' },
];

const customers: Customer[] = customerData.map((c, i) => ({
  id: `c${i + 1}`,
  ...c,
  createdAt: subMonths(NOW, 12 + Math.floor(rand() * 6)).toISOString(),
}));

// ============================================================
// LOAD DATA — ~360 loads (2 per truck per month × 12 months)
// ============================================================
const commodities = ['Electronics','Auto Parts','Food Products','Steel Parts','Pharmaceuticals','Furniture','Chemicals','Building Materials','Paper Goods','Plastics','Machinery','Apparel','Beverages','Glass','Rubber Products'];
const pickupCities = [
  { loc: 'Chicago Warehouse A', addr: '123 Industrial Blvd, Chicago, IL', contact: 'Mike', phone: '(555) 111-2223' },
  { loc: 'Newark Distribution Hub', addr: '456 Warehouse Dr, Newark, NJ', contact: 'Tom', phone: '(555) 222-3334' },
  { loc: 'St. Louis Main DC', addr: '789 Distribution Ave, St. Louis, MO', contact: 'Steve', phone: '(555) 333-4445' },
  { loc: 'Atlanta Factory', addr: '1200 Factory Row, Atlanta, GA', contact: 'Jamie', phone: '(555) 444-5556' },
  { loc: 'LA Harbor Terminal', addr: '800 Harbor Blvd, Los Angeles, CA', contact: 'Carlos', phone: '(555) 555-6667' },
  { loc: 'Dallas Freight Hub', addr: '500 Industrial Pkwy, Dallas, TX', contact: 'Jose', phone: '(555) 666-7778' },
  { loc: 'Detroit Auto Plant', addr: '350 Auto Mile, Detroit, MI', contact: 'Eric', phone: '(555) 777-8889' },
  { loc: 'Charlotte Regional DC', addr: '200 Commerce Blvd, Charlotte, NC', contact: 'Pat', phone: '(555) 888-9990' },
  { loc: 'Denver Distribution Center', addr: '600 Distribution Ct, Denver, CO', contact: 'Chris', phone: '(555) 999-0001' },
  { loc: 'Portland Logistics Yard', addr: '900 Forest Ave, Portland, OR', contact: 'Sam', phone: '(555) 000-1112' },
];

const deliveryCities = [
  { loc: 'Columbus Distribution', addr: '500 Logistics Way, Columbus, OH', contact: 'Lisa', phone: '(555) 444-5555' },
  { loc: 'Boston Fulfillment', addr: '200 Commerce Blvd, Boston, MA', contact: 'Amy', phone: '(555) 666-7777' },
  { loc: 'Dallas Regional DC', addr: '1500 Freight St, Dallas, TX', contact: 'Jose', phone: '(555) 777-8888' },
  { loc: 'Detroit Auto Plant', addr: '800 Motor City Dr, Detroit, MI', contact: 'Eric', phone: '(555) 888-9999' },
  { loc: 'Richmond Distribution', addr: '300 East Main St, Richmond, VA', contact: 'Pat', phone: '(555) 999-0000' },
  { loc: 'Phoenix Warehouse', addr: '700 Desert Blvd, Phoenix, AZ', contact: 'Ana', phone: '(555) 111-3333' },
  { loc: 'Seattle Freight Center', addr: '400 Puget Sound Dr, Seattle, WA', contact: 'Ken', phone: '(555) 222-4444' },
  { loc: 'Memphis Hub', addr: '600 River Rd, Memphis, TN', contact: 'Ray', phone: '(555) 333-5555' },
  { loc: 'Kansas City DC', addr: '250 Commerce Pkwy, Kansas City, MO', contact: 'Beth', phone: '(555) 444-6666' },
  { loc: 'Miami Logistics Center', addr: '1800 Port Blvd, Miami, FL', contact: 'Luis', phone: '(555) 555-7777' },
];

let loads: Load[] = [];
let invoices: Invoice[] = [];
let loadCounter = 1001;
let invoiceCounter = 1;

// Generate 2 loads per truck per month for 12 months
for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
  const monthDate = subMonths(NOW, monthOffset);

  for (let truckIdx = 0; truckIdx < 15; truckIdx++) {
    const truckId = truckIdByIndex[truckIdx];
    const driverId = driverIdByIndex[truckIdx < 12 ? truckIdx : Math.floor(rand() * 12)];
    const customerIdx = Math.floor(rand() * customers.length);
    const customerId = `c${customerIdx + 1}`;
    const commodity = commodities[Math.floor(rand() * commodities.length)];
    const weight = 8000 + Math.floor(rand() * 15000);
    const distance = 150 + Math.floor(rand() * 600);
    const ratePerMile = 1.80 + rand() * 1.70;
    const rate = Math.round(distance * ratePerMile / 50) * 50;

    const isRecent = monthOffset <= 1;
    const isMiddle = monthOffset > 1 && monthOffset <= 5;

    // Determine load status based on age
    let status: LoadStatus;
    if (isRecent) {
      // Recent month: mix of active statuses
      const r = rand();
      if (r < 0.2) status = 'pending';
      else if (r < 0.4) status = 'assigned';
      else if (r < 0.6) status = 'picked_up';
      else if (r < 0.85) status = 'in_transit';
      else status = 'delivered';
    } else if (isMiddle) {
      // Middle months: mostly delivered, some in transit
      status = rand() < 0.15 ? (rand() < 0.5 ? 'in_transit' : 'picked_up') : 'delivered';
    } else {
      // Old months: all delivered
      status = 'delivered';
    }

    // Some loads are canceled (~3%)
    if (rand() < 0.03 && status !== 'delivered') {
      status = 'canceled';
    }

    for (let loadNum = 0; loadNum < 2; loadNum++) {
      const pickupCity = pickupCities[Math.floor(rand() * pickupCities.length)];
      const deliveryCity = deliveryCities[Math.floor(rand() * deliveryCities.length)];
      const daysOffset = Math.floor(rand() * 25);
      const loadDate = addDays(new Date(monthDate), daysOffset);
      const pickupDate = new Date(loadDate);
      pickupDate.setHours(6 + Math.floor(rand() * 10), 0, 0, 0);
      const deliveryDate = new Date(pickupDate);
      deliveryDate.setDate(deliveryDate.getDate() + 1 + Math.floor(rand() * 2));
      deliveryDate.setHours(8 + Math.floor(rand() * 10), 0, 0, 0);

      const loadId = `l${loadCounter}`;
      const instructions = status === 'delivered' || status === 'in_transit' 
        ? (rand() > 0.7 ? (commodity === 'Food Products' || commodity === 'Pharmaceuticals' ? 'Temperature controlled' : 'Handle with care') : '')
        : '';

      loads.push({
        id: loadId,
        loadNumber: `LD-${loadCounter}`,
        customerId,
        truckId: status === 'pending' && isRecent ? null : truckId,
        driverId: status === 'pending' && isRecent ? null : driverId,
        status,
        stops: [
          { id: `ps${loadCounter}`, type: 'pickup', location: pickupCity.loc, address: pickupCity.addr, contactName: pickupCity.contact, contactPhone: pickupCity.phone, scheduledDate: pickupDate.toISOString(), notes: '' },
          { id: `ds${loadCounter}`, type: 'delivery', location: deliveryCity.loc, address: deliveryCity.addr, contactName: deliveryCity.contact, contactPhone: deliveryCity.phone, scheduledDate: deliveryDate.toISOString(), notes: '' },
        ],
        weightKg: weight,
        commodity,
        rate,
        distanceMiles: distance,
        specialInstructions: instructions,
        bolFile: status === 'delivered' ? `bol-${loadCounter}.pdf` : null,
        createdAt: loadDate.toISOString(),
        updatedAt: loadDate.toISOString(),
      });

      // Create invoice for delivered loads
      if (status === 'delivered') {
        const monthsOld = monthOffset;
        let invStatus: Invoice['status'];
        let paidAt: string | null = null;
        let issuedAt: string;
        let dueAt: string;

        if (monthsOld >= 3) {
          invStatus = 'paid';
          issuedAt = new Date(loadDate).toISOString();
          dueAt = addDays(new Date(loadDate), 30).toISOString();
          paidAt = addDays(new Date(loadDate), 25 + Math.floor(rand() * 20)).toISOString();
        } else if (monthsOld >= 1) {
          invStatus = 'sent';
          issuedAt = new Date(loadDate).toISOString();
          dueAt = addDays(new Date(loadDate), 30).toISOString();
        } else {
          invStatus = rand() > 0.5 ? 'sent' : 'draft';
          issuedAt = rand() > 0.5 ? new Date(loadDate).toISOString() : '';
          dueAt = issuedAt ? addDays(new Date(loadDate), 30).toISOString() : '';
        }

        // Some sent invoices slip to overdue
        if (invStatus === 'sent' && monthsOld > 1 && rand() > 0.85) {
          invStatus = 'overdue';
        }

        invoices.push({
          id: `inv${invoiceCounter}`,
          invoiceNumber: `INV-2026-${String(invoiceCounter).padStart(3, '0')}`,
          loadId,
          customerId,
          amount: rate,
          status: invStatus,
          issuedAt,
          dueAt,
          paidAt,
          notes: '',
        });
        invoiceCounter++;
      }

      loadCounter++;
    }
  }
}

// ============================================================
// TRACKING EVENTS — generate for in_transit loads
// ============================================================
let trackingEvents: TrackingEvent[] = [];

for (const load of loads) {
  if (load.status === 'in_transit') {
    const baseDate = new Date(load.createdAt);
    trackingEvents.push({
      id: `te${load.id}`,
      loadId: load.id,
      status: 'picked_up',
      location: load.stops[0]?.address || 'Pickup location',
      timestamp: addDays(baseDate, 0).toISOString(),
      notes: 'Picked up successfully',
    });
    trackingEvents.push({
      id: `te${load.id}b`,
      loadId: load.id,
      status: 'in_transit',
      location: 'En route',
      timestamp: addDays(baseDate, 0).toISOString(),
      notes: `Departed ${load.stops[0]?.location || 'origin'}`,
    });
  }
  if (load.status === 'delivered') {
    const baseDate = new Date(load.createdAt);
    trackingEvents.push({
      id: `te${load.id}c`,
      loadId: load.id,
      status: 'picked_up',
      location: load.stops[0]?.address || 'Pickup location',
      timestamp: addDays(baseDate, 0).toISOString(),
      notes: 'Picked up',
    });
    trackingEvents.push({
      id: `te${load.id}d`,
      loadId: load.id,
      status: 'in_transit',
      location: load.stops[1]?.address || 'Delivery location',
      timestamp: addDays(baseDate, 1).toISOString(),
      notes: 'In transit',
    });
    trackingEvents.push({
      id: `te${load.id}e`,
      loadId: load.id,
      status: 'delivered',
      location: load.stops[1]?.address || 'Delivery location',
      timestamp: addDays(baseDate, 2 + Math.floor(rand() * 3)).toISOString(),
      notes: 'Delivered successfully',
    });
  }
}

// ============================================================
// COUNTERS for new entries via CRUD
// ============================================================
let nextLoadNumber = loadCounter + 1;
let nextInvoiceNumber = invoiceCounter + 1;

// ============================================================
// HELPER
// ============================================================
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ============================================================
// CRUD OPERATIONS
// ============================================================

// Trucks
export function getTrucks(): Truck[] { return [...trucks]; }
export function getTruck(id: string): Truck | undefined { return trucks.find(t => t.id === id); }
export function createTruck(data: Omit<Truck, 'id' | 'createdAt'>): Truck {
  const truck: Truck = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  trucks.push(truck);
  return truck;
}
export function updateTruck(id: string, data: Partial<Truck>): Truck | undefined {
  const idx = trucks.findIndex(t => t.id === id);
  if (idx === -1) return undefined;
  trucks[idx] = { ...trucks[idx], ...data };
  return trucks[idx];
}
export function deleteTruck(id: string): boolean {
  const idx = trucks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  trucks.splice(idx, 1);
  return true;
}

// Drivers
export function getDrivers(): Driver[] { return [...drivers]; }
export function getDriver(id: string): Driver | undefined { return drivers.find(d => d.id === id); }
export function createDriver(data: Omit<Driver, 'id' | 'createdAt'>): Driver {
  const driver: Driver = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  drivers.push(driver);
  return driver;
}
export function updateDriver(id: string, data: Partial<Driver>): Driver | undefined {
  const idx = drivers.findIndex(d => d.id === id);
  if (idx === -1) return undefined;
  drivers[idx] = { ...drivers[idx], ...data };
  return drivers[idx];
}
export function deleteDriver(id: string): boolean {
  const idx = drivers.findIndex(d => d.id === id);
  if (idx === -1) return false;
  drivers.splice(idx, 1);
  return true;
}

// Customers
export function getCustomers(): Customer[] { return [...customers]; }
export function getCustomer(id: string): Customer | undefined { return customers.find(c => c.id === id); }
export function createCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Customer {
  const customer: Customer = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  customers.push(customer);
  return customer;
}
export function updateCustomer(id: string, data: Partial<Customer>): Customer | undefined {
  const idx = customers.findIndex(c => c.id === id);
  if (idx === -1) return undefined;
  customers[idx] = { ...customers[idx], ...data };
  return customers[idx];
}
export function deleteCustomer(id: string): boolean {
  const idx = customers.findIndex(c => c.id === id);
  if (idx === -1) return false;
  customers.splice(idx, 1);
  return true;
}

// Loads
export function getLoads(): Load[] { return [...loads]; }
export function getLoad(id: string): Load | undefined { return loads.find(l => l.id === id); }
export function createLoad(data: Omit<Load, 'id' | 'loadNumber' | 'createdAt' | 'updatedAt'>): Load {
  const load: Load = {
    ...data,
    id: generateId(),
    loadNumber: `LD-${nextLoadNumber++}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  loads.push(load);
  return load;
}
export function updateLoad(id: string, data: Partial<Load>): Load | undefined {
  const idx = loads.findIndex(l => l.id === id);
  if (idx === -1) return undefined;
  loads[idx] = { ...loads[idx], ...data, updatedAt: new Date().toISOString() };
  return loads[idx];
}
export function deleteLoad(id: string): boolean {
  const idx = loads.findIndex(l => l.id === id);
  if (idx === -1) return false;
  loads.splice(idx, 1);
  return true;
}

// Invoices
export function getInvoices(): Invoice[] { return [...invoices]; }
export function getInvoice(id: string): Invoice | undefined { return invoices.find(i => i.id === id); }
export function createInvoice(data: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice {
  const inv: Invoice = {
    ...data,
    id: generateId(),
    invoiceNumber: `INV-2026-${String(nextInvoiceNumber++).padStart(3, '0')}`,
  };
  invoices.push(inv);
  return inv;
}
export function updateInvoice(id: string, data: Partial<Invoice>): Invoice | undefined {
  const idx = invoices.findIndex(i => i.id === id);
  if (idx === -1) return undefined;
  invoices[idx] = { ...invoices[idx], ...data };
  return invoices[idx];
}

// Tracking
export function getTrackingEvents(loadId: string): TrackingEvent[] {
  return trackingEvents.filter(e => e.loadId === loadId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
export function addTrackingEvent(data: Omit<TrackingEvent, 'id'>): TrackingEvent {
  const event: TrackingEvent = { ...data, id: generateId() };
  trackingEvents.push(event);
  return event;
}

// === Dashboard ===
export function getDashboardMetrics(): DashboardMetrics {
  const activeTrucks = trucks.filter(t => t.status === 'active').length;
  const activeDrivers = drivers.filter(d => d.status === 'driving' || d.status === 'on_duty').length;
  const loadsInTransit = loads.filter(l => l.status === 'in_transit').length;
  const deliveredToday = loads.filter(l => l.status === 'delivered').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingLoads = loads.filter(l => l.status === 'pending').length;
  return { activeTrucks, activeDrivers, loadsInTransit, deliveredToday, totalRevenue, pendingLoads };
}

export function getLoadsByStatus(): { status: LoadStatus; count: number }[] {
  const counts: Record<string, number> = {};
  loads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
  return Object.entries(counts).map(([status, count]) => ({ status: status as LoadStatus, count }));
}

export function getRecentLoads(limit = 5): Load[] {
  return [...loads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

export function getRecentInvoices(limit = 5): Invoice[] {
  return [...invoices].sort((a, b) => new Date(b.issuedAt || b.dueAt || b.id).getTime() - new Date(a.issuedAt || a.dueAt || a.id).getTime()).slice(0, limit);
}