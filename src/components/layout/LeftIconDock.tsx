'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import {
  Code2,
  ListOrdered,
  Trophy,
  ClipboardCheck,
  ShieldAlert,
  Radio,
  Sliders,
  Flag,
} from 'lucide-react';

export const LeftIconDock: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { triggerWipeTransition } = useContest();

  const dockItems = [
    { label: 'The Race Cockpit', href: '/race', icon: Code2 },
    { label: 'The Circuit Problemset', href: '/problemset', icon: ListOrdered },
    { label: 'Timing Tower & Standings', href: '/timing', icon: Trophy },
    { label: 'Scrutineering Checklist', href: '/scrutineering', icon: ClipboardCheck },
    { label: 'Marshal Floor Dashboard', href: '/marshal', icon: ShieldAlert },
    { label: 'Race Control Center', href: '/control', icon: Sliders },
    { label: 'Chequered Flag / Podium', href: '/finish', icon: Flag },
  ];

  const handleNav = (href: string) => {
    if (pathname !== href) {
      triggerWipeTransition();
      router.push(href);
    }
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-12 bg-[#0D0E11] border-r border-[#1C1D22] z-40 hidden md:flex flex-col items-center py-4 justify-between select-none">
      <div className="flex flex-col items-center gap-3 w-full">
        {dockItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              title={item.label}
              className={`relative p-2.5 rounded group transition-all ${
                isActive
                  ? 'bg-[#1D1E24] text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  : 'text-[#5E6068] hover:text-[#B4B7C4] hover:bg-[#15161A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#CE2F2C] rounded-r" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse" title="Contest system online" />
        <span className="text-[9px] font-mono text-[#5E6068]">LAN</span>
      </div>
    </aside>
  );
};
