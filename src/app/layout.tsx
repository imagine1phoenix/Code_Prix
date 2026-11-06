import type { Metadata } from 'next';
import './globals.css';
import { ContestProvider } from '@/context/ContestContext';
import { ContestAccessGate } from '@/components/layout/ContestAccessGate';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Code Grand Prix | Competitive Programming Club',
  description: 'F1-themed competitive programming contest platform for Code Grand Prix.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0E0E10] text-white min-h-screen antialiased selection:bg-[#CE2F2C] selection:text-white">
        <ContestProvider>
          <AppShell>
            <ContestAccessGate>{children}</ContestAccessGate>
          </AppShell>
        </ContestProvider>
      </body>
    </html>
  );
}
