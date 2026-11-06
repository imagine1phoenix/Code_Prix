'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { LeftIconDock } from '@/components/layout/LeftIconDock';
import { F1SpeedWipe } from '@/components/transitions/F1SpeedWipe';
import { YellowFlagOverlay } from '@/components/overlays/YellowFlagOverlay';
import { RedFlagOverlay } from '@/components/overlays/RedFlagOverlay';
import { LightsOutSequence } from '@/components/transitions/LightsOutSequence';
import { StateTransitionMoment } from '@/components/transitions/StateTransitionMoment';
import { EntryLoadingScreen } from '@/components/layout/EntryLoadingScreen';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isEntryPage = pathname === '/login' || pathname === '/admin-login';

  if (isEntryPage) {
    return (
      <EntryLoadingScreen>
        <main className="min-h-screen">{children}</main>
      </EntryLoadingScreen>
    );
  }

  return (
    <>
      <F1SpeedWipe />
      <Navbar />
      <LeftIconDock />
      <main className="md:pl-12 min-h-[calc(100vh-3.5rem)]">{children}</main>
      <YellowFlagOverlay />
      <RedFlagOverlay />
      <LightsOutSequence />
      <StateTransitionMoment />
    </>
  );
};
