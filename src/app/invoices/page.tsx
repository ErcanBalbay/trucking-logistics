'use client';
import { useState, useEffect } from 'react';
import { getInvoices } from '@/lib/data';
import { Receipt, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  sent: 'bg-blue-100 text-blue-700 border-blue-200',
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoices().then(data => { setInvoices(data); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Invoices</h1>
        <p className="text-muted-foreground mt-1">Billing and payment tracking</p>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border bg-muted/40">
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Due</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{inv.invoice_number}</td>
                <td className="px-4 py-3 font-medium text-card-foreground">${inv.amount?.toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[inv.status] || 'bg-gray-100 text-gray-700'}`}>{inv.status === 'paid' ? <CheckCircle2 size={14}/> : inv.status === 'overdue' ? <AlertCircle size={14}/> : <Clock size={14}/>}{inv.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.due_at ? new Date(inv.due_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}