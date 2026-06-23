'use client';
import { getCustomers } from '@/lib/data';
import { UserCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function CustomersPage() {
  const customers = getCustomers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-1">Your shippers and clients</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <UserCircle size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.company}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} />{c.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone size={14} />{c.phone}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={14} />{c.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}