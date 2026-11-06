'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';

export const ContestAccessGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { activeTeam, userRole, isSessionHydrated } = useContest();
  const isTeamEntryRoute = pathname === '/login';
  const isAdminEntryRoute = pathname === '/admin-login';
  const isControlRoute = pathname === '/control';
  const isEntryRoute = isTeamEntryRoute || isAdminEntryRoute;

  useEffect(() => {
    if (isSessionHydrated && isControlRoute && userRole !== 'admin') {
      router.replace('/admin-login');
    } else if (isSessionHydrated && !isEntryRoute && !isControlRoute && !activeTeam) {
      router.replace('/login');
    }
  }, [activeTeam, isControlRoute, isEntryRoute, isSessionHydrated, router, userRole]);

  if (!isSessionHydrated && !isEntryRoute) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-xs font-mono text-[#8A8A93]">
        RESTORING TEAM SESSION...
      </div>
    );
  }

  if (isSessionHydrated && !isEntryRoute && !isControlRoute && !activeTeam) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-xs font-mono text-[#8A8A93]">
        REDIRECTING TO TEAM SIGN IN...
      </div>
    );
  }

  if (isSessionHydrated && isControlRoute && userRole !== 'admin') {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-xs font-mono text-[#8A8A93]">
        REDIRECTING TO ADMIN SIGN IN...
      </div>
    );
  }

  return <>{children}</>;
};
