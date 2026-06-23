-- ============================================================
-- TruckLog Logistics Management - Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. COMPANIES (multi-tenant root)
-- ============================================================
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- ============================================================
-- 2. PROFILES (extends auth.users)
-- ============================================================
create table profiles (
  id uuid references auth.users(id) primary key,
  company_id uuid references companies(id) on delete cascade,
  role text not null default 'dispatcher',
  email text,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. TRUCKS
-- ============================================================
create table trucks (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  plate text not null,
  make text not null,
  model text not null,
  year int not null,
  vin text not null,
  status text not null default 'active',
  fuel_type text not null default 'diesel',
  capacity_kg numeric,
  mpg numeric,
  last_odometer numeric default 0,
  insurance_expiry text,
  registration_expiry text,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 4. DRIVERS
-- ============================================================
create table drivers (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  license_number text not null,
  license_endorsements text[] default '{}',
  medical_card_expiry text,
  status text not null default 'available',
  pay_rate numeric,
  pay_type text not null default 'per_mile',
  assigned_truck_id uuid references trucks(id),
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 5. CUSTOMERS
-- ============================================================
create table customers (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  company text not null,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 6. LOADS
-- ============================================================
create type load_status as enum ('pending','assigned','picked_up','in_transit','delivered','canceled');

create table loads (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  load_number text not null,
  customer_id uuid references customers(id),
  truck_id uuid references trucks(id),
  driver_id uuid references drivers(id),
  status load_status not null default 'pending',
  stops jsonb not null default '[]',
  weight_kg numeric,
  commodity text,
  rate numeric,
  distance_miles numeric,
  special_instructions text,
  bol_file text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 7. INVOICES
-- ============================================================
create type invoice_status as enum ('draft','sent','paid','overdue');

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  invoice_number text not null,
  load_id uuid references loads(id),
  customer_id uuid references customers(id),
  amount numeric not null,
  status invoice_status not null default 'draft',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. TRACKING EVENTS
-- ============================================================
create table tracking_events (
  id uuid primary key default uuid_generate_v4(),
  load_id uuid references loads(id) on delete cascade not null,
  event_type text not null,
  location text,
  notes text,
  timestamp timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_trucks_company on trucks(company_id);
create index idx_drivers_company on drivers(company_id);
create index idx_customers_company on customers(company_id);
create index idx_loads_company on loads(company_id);
create index idx_invoices_company on invoices(company_id);
create index idx_tracking_load on tracking_events(load_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table profiles enable row level security;
alter table trucks enable row level security;
alter table drivers enable row level security;
alter table customers enable row level security;
alter table loads enable row level security;
alter table invoices enable row level security;
alter table tracking_events enable row level security;

-- Policies: users only see their own company's data
create policy "Users view own company" on trucks for select using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users insert own company" on trucks for insert with check (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users update own company" on trucks for update using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users delete own company" on trucks for delete using (company_id = (select company_id from profiles where id = auth.uid()));

create policy "Users view own company" on drivers for select using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users insert own company" on drivers for insert with check (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users update own company" on drivers for update using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users delete own company" on drivers for delete using (company_id = (select company_id from profiles where id = auth.uid()));

create policy "Users view own company" on customers for select using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users insert own company" on customers for insert with check (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users update own company" on customers for update using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users delete own company" on customers for delete using (company_id = (select company_id from profiles where id = auth.uid()));

create policy "Users view own company" on loads for select using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users insert own company" on loads for insert with check (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users update own company" on loads for update using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users delete own company" on loads for delete using (company_id = (select company_id from profiles where id = auth.uid()));

create policy "Users view own company" on invoices for select using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users insert own company" on invoices for insert with check (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users update own company" on invoices for update using (company_id = (select company_id from profiles where id = auth.uid()));
create policy "Users delete own company" on invoices for delete using (company_id = (select company_id from profiles where id = auth.uid()));

create policy "Users view own company" on tracking_events for select using (load_id in (select id from loads where company_id = (select company_id from profiles where id = auth.uid())));
create policy "Users insert own company" on tracking_events for insert with check (load_id in (select id from loads where company_id = (select company_id from profiles where id = auth.uid())));

-- ============================================================
-- FUNCTIONS
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, company_id, role)
  values (new.id, new.email, (select id from companies limit 1), 'admin');
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_new_company()
returns trigger as $$
begin
  insert into public.profiles (id, email, company_id, role)
  values (new.id, new.email, new.id, 'admin');
  update auth.users set raw_app_meta_data = jsonb_set(raw_app_meta_data, '{company_id}', to_jsonb(new.id))
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- SEED DATA (sample company + profiles)
-- ============================================================
insert into companies (id, name, slug) values
  ('00000000-0000-0000-0000-000000000001', 'Demo Logistics', 'demo')
  on conflict (slug) do nothing;