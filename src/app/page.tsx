'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';

export default function PaddockLandingPage() {
  const router = useRouter();
  const { remainingSeconds, triggerWipeTransition, problems, activeTeam } = useContest();

  const handleNav = (href: string) => {
    triggerWipeTransition();
    router.push(href);
  };

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const formattedCountdown = `${hours.toString().padStart(2, '0')}H ${minutes
    .toString()
    .padStart(2, '0')}M`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 select-none">
      {/* Eyebrow Motif matching Screenshot 2 */}
      <div className="eyebrow-motif mb-3">
        <span className="slashes">////</span>
        <span>PADDOCK · WEEK 45 · FET-002 SPRINT</span>
      </div>

      {/* Main Hero Row: Solid + Outlined Headline & Join the Grid Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Headline (THE PADDOCK) */}
        <div className="lg:col-span-8">
          <h1 className="select-none leading-none">
            <span className="block hero-solid text-7xl sm:text-8xl md:text-9xl">
              THE
            </span>
            <span className="block hero-outlined text-7xl sm:text-8xl md:text-9xl">
              PADDOCK
            </span>
          </h1>
        </div>

        {/* Right Callout: JOIN THE GRID Card with Red Left Accent Bar */}
        <div className="lg:col-span-4 bg-[#151518] border border-[#26262B] p-6 rounded-sm shadow-xl relative border-l-4 border-l-[#CE2F2C]">
          <h3 className="font-condensed font-black text-2xl text-white italic tracking-wide uppercase mb-1">
            JOIN THE GRID
          </h3>
          <p className="text-xs text-[#8A8A93] mb-6 uppercase tracking-wider font-semibold">
            {activeTeam
              ? `LOGGED IN AS ${activeTeam.name} (TABLE ${activeTeam.tableNumber})`
              : 'A CODEFORCES ACCOUNT, FREE'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav(activeTeam ? '/race' : '/login')}
              className="px-5 py-2.5 bg-[#202126] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#2A2B32] transition-colors"
            >
              {activeTeam ? 'COCKPIT' : 'ENTER'}
            </button>
            <button
              onClick={() => handleNav(activeTeam ? '/race' : '/login')}
              className="px-6 py-2.5 bg-[#CE2F2C] text-white font-condensed font-black text-sm italic uppercase tracking-wider rounded-sm skew-f1 hover:bg-[#E53935] transition-all shadow-[0_0_15px_rgba(206,47,44,0.4)]"
            >
              <span className="unskew-f1">{activeTeam ? 'RESUME RACE' : 'REGISTER'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 3-Card Signature Grid (Exact Replica from Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Card 1: Red Hero Card with Diagonal Carbon Stripes */}
        <div className="bg-[#CE2F2C] rounded-sm p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-[0_0_25px_rgba(206,47,44,0.25)]">
          {/* Diagonal Stripes Overlay on Right Half */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-racing-stripes-overlay opacity-30 pointer-events-none" />

          <div>
            <div className="text-[11px] font-bold text-white/80 tracking-widest uppercase mb-2">
              THE TIMING TOWER
            </div>
            <h3 className="font-condensed font-black text-3xl sm:text-4xl text-white italic tracking-tight uppercase leading-none mb-3">
              START YOUR ENGINES
            </h3>
            <div className="text-xs font-mono font-bold text-white/90">
              11,488 PROBLEMS
            </div>
          </div>

          <button
            onClick={() => handleNav('/problemset')}
            className="text-xs font-condensed font-black text-white italic uppercase tracking-wider flex items-center gap-1.5 hover:translate-x-1 transition-transform mt-6"
          >
            TO THE PROBLEMSET →
          </button>
        </div>

        {/* Card 2: Next Round Card with 3px Indigo Top Border */}
        <div className="bg-[#151518] border border-[#26262B] border-t-4 border-t-[#8F9CF8] rounded-sm p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-[11px] font-bold text-[#8A8A93] tracking-widest uppercase mb-2">
              NEXT ROUND · DIV. 2 · INTERMEDIATE
            </div>
            <h3 className="font-condensed font-black text-2xl text-white italic tracking-tight uppercase leading-none mb-3">
              CODEFORCES ROUND 1132 (DIV. 2)
            </h3>
            <div className="font-condensed font-black text-4xl sm:text-5xl text-white italic tracking-wider">
              {formattedCountdown}
            </div>
          </div>

          <button
            onClick={() => handleNav('/race')}
            className="text-xs font-condensed font-black text-[#8F9CF8] italic uppercase tracking-wider flex items-center gap-1.5 hover:translate-x-1 transition-transform mt-6"
          >
            REGISTER →
          </button>
        </div>

        {/* Card 3: The Grid / Top Rated Card */}
        <div className="bg-[#151518] border border-[#26262B] rounded-sm p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-[11px] font-bold text-[#8A8A93] tracking-widest uppercase mb-2">
              THE GRID
            </div>
            <h3 className="font-condensed font-black text-2xl text-white italic tracking-tight uppercase leading-none mb-1">
              TOP RATED
            </h3>
            <p className="text-xs text-[#8A8A93] uppercase tracking-wider">
              THE FASTEST ON CODEFORCES
            </p>
          </div>

          <button
            onClick={() => handleNav('/timing')}
            className="text-xs font-condensed font-black text-white italic uppercase tracking-wider flex items-center gap-1.5 hover:translate-x-1 transition-transform mt-6"
          >
            TO THE RATINGS →
          </button>
        </div>
      </div>

      {/* Bottom Ticker Ribbon matching Screenshot 2 */}
      <div className="border-t border-[#CE2F2C] pt-3 flex items-center justify-between text-xs font-mono text-[#8A8A93]">
        <div className="flex items-center gap-2">
          <span className="text-[#CE2F2C] font-black italic">////</span>
          <span className="text-white font-bold uppercase tracking-wider">
            UPCOMING CONTEST: CODE GRAND PRIX 2026 · FET-002 SPRINT
          </span>
        </div>
        <div className="hidden sm:block text-[11px] text-[#55565D]">
          SERVER TIME: UTC+05:30 · JAIN UNIVERSITY
        </div>
      </div>
    </div>
  );
}
