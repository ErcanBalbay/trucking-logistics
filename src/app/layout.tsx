import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import Sidebar from '@/components/layout/Sidebar';

import './globals.css';

export const metadata: Metadata = {
  title: 'TruckLog — Logistics Management',
  description: 'Modern trucking operations platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="min-h-screen lg:ml-64">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}