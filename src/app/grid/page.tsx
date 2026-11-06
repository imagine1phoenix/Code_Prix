'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import { Clock, ShieldAlert, Flag, Flame, CheckCircle2 } from 'lucide-react';

export default function TheGridLobbyPage() {
  const router = useRouter();
  const {
    activeTeam,
    teams,
    remainingSeconds,
    triggerLightsOut,
    triggerWipeTransition,
  } = useContest();

  const readyTeamsCount = teams.filter((t) => t.status === 'ready' || t.status === 'racing').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center select-none">
      <div className="eyebrow-motif mb-3 justify-center">
        <span className="slashes">////</span>
        <span>STAGE 03 · PRE-RACE FORMATION GRID</span>
      </div>

      <h1 className="select-none mb-4">
        <span className="block hero-solid text-7xl sm:text-8xl md:text-9xl">
          THE
        </span>
        <span className="block hero-outlined text-7xl sm:text-8xl md:text-9xl">
          GRID
        </span>
      </h1>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#141518] border border-[#26262B] rounded-full text-xs font-mono text-[#8F9CF8] mb-8">
        <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-ping" />
        <span>STANDBY // AWAITING RACE CONTROL SIGNAL</span>
      </div>

      {/* Grid Status Box */}
      <div className="bg-[#151518] border border-[#26262B] p-8 rounded-sm shadow-2xl max-w-xl mx-auto mb-10 border-t-4 border-t-[#CE2F2C]">
        <div className="text-xs font-bold text-[#8A8A93] uppercase tracking-wider mb-2">
          SCRUTINEERING TELEMETRY
        </div>

        <div className="font-condensed font-black text-5xl md:text-6xl text-white italic tracking-wider mb-4">
          {readyTeamsCount} / {teams.length} TEAMS READY
        </div>

        {activeTeam && (
          <div className="bg-[#0E0E10] border border-[#26262B] p-4 rounded text-left mb-6 space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#8A8A93]">TEAM:</span>
              <span className="text-white font-bold">{activeTeam.name} ({activeTeam.id})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A93]">TABLE:</span>
              <span className="text-white font-bold">Table {activeTeam.tableNumber} ({activeTeam.zone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A93]">STATUS:</span>
              <span className="text-[#2BB673] font-bold uppercase">SCRUTINEERING PASSED</span>
            </div>
          </div>
        )}

        <button
          onClick={triggerLightsOut}
          className="w-full py-4 bg-[#CE2F2C] text-white font-condensed font-black text-lg italic uppercase tracking-wider rounded skew-f1 hover:bg-[#E53935] transition-all shadow-[0_0_25px_rgba(206,47,44,0.4)]"
        >
          <span className="unskew-f1 flex items-center justify-center gap-2">
            <Flame className="w-5 h-5" />
            START 5-LIGHTS LAUNCH SEQUENCE →
          </span>
        </button>
      </div>

      {/* Rules Notice */}
      <div className="max-w-lg mx-auto text-xs text-[#8A8A93] leading-relaxed">
        <strong>Race Regulation Reminder:</strong> Once lights go out, fullscreen locks automatically. 
        Focus loss or application switching will issue yellow and red flags. Keep all external mobile devices inside Parc Fermé bags.
      </div>
    </div>
  );
}

