'use client';

import React, { useState, useEffect } from 'react';
import { useContest } from '@/context/ContestContext';
import { soundFx } from '@/lib/soundEffects';
import { useRouter } from 'next/navigation';
import { Flag, Clock, AlertTriangle, AlertOctagon, CheckCircle2, Trophy } from 'lucide-react';

export const StateTransitionMoment: React.FC = () => {
  const router = useRouter();
  const {
    activeTransitionMoment,
    closeTransitionMoment,
    remainingSeconds,
    teams,
    triggerWipeTransition,
    setContestState,
  } = useContest();

  const [lightCount, setLightCount] = useState<number>(0);
  const [resumeLights, setResumeLights] = useState<number>(0);
  const [goFlashed, setGoFlashed] = useState<boolean>(false);

  // Resume 3-light sequence
  useEffect(() => {
    if (activeTransitionMoment === 'resume') {
      setResumeLights(0);
      const t1 = setTimeout(() => {
        setResumeLights(1);
        soundFx.playRedLight();
      }, 1000);
      const t2 = setTimeout(() => {
        setResumeLights(2);
        soundFx.playRedLight();
      }, 2000);
      const t3 = setTimeout(() => {
        setResumeLights(3);
        soundFx.playRedLight();
      }, 3000);
      const tGo = setTimeout(() => {
        setResumeLights(0);
        soundFx.playLightsOutGo();
      }, 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(tGo);
      };
    }
  }, [activeTransitionMoment]);

  // Chequered flag redirect
  useEffect(() => {
    if (activeTransitionMoment === 'chequered_flag') {
      const redirectTimer = setTimeout(() => {
        triggerWipeTransition();
        router.push('/finish');
      }, 5500);
      return () => clearTimeout(redirectTimer);
    }
  }, [activeTransitionMoment, router, triggerWipeTransition]);

  if (!activeTransitionMoment) return null;

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const readyTeamsCount = teams.filter((t) => t.status === 'ready' || t.status === 'racing').length;

  return (
    <div className="fixed inset-0 z-[99990] bg-[#0E0E10] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden animate-fadeIn">
      {/* 1. FREEZE NOTICE (4s Banner) */}
      {activeTransitionMoment === 'freeze_notice' && (
        <div className="max-w-2xl w-full bg-[#151518] border-2 border-[#8F9CF8] p-8 rounded shadow-[0_0_50px_rgba(143,156,248,0.3)] relative">
          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>RACE CLOCK T-30 MINUTES · TELEMETRY BLACKOUT</span>
          </div>
          <h2 className="select-none mb-4">
            <span className="block hero-solid text-5xl sm:text-7xl text-white">
              LEADERBOARD
            </span>
            <span className="block hero-outlined text-5xl sm:text-7xl">
              FROZEN
            </span>
          </h2>
          <div className="h-2 w-full bg-racing-stripes-overlay rounded my-4 opacity-50" />
          <p className="text-sm font-mono text-[#8F9CF8] uppercase tracking-wider">
            PUBLIC TIMING TOWER FROZEN FOR FINAL 30 MINUTES · SUBMIT ALL SECTORS
          </p>
        </div>
      )}

      {/* 2. LAST LAP (4s Banner) */}
      {activeTransitionMoment === 'last_lap' && (
        <div className="max-w-2xl w-full bg-[#200505] border-2 border-[#CE2F2C] p-8 rounded shadow-[0_0_50px_rgba(206,47,44,0.5)] relative animate-pulse">
          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>RACE CLOCK T-10 MINUTES · FINAL STINT</span>
          </div>
          <h2 className="select-none mb-4">
            <span className="block hero-solid text-6xl sm:text-8xl text-[#CE2F2C]">
              LAST
            </span>
            <span className="block hero-outlined text-6xl sm:text-8xl">
              LAP
            </span>
          </h2>
          <div className="h-2 w-full bg-red-flag-stripes rounded my-4" />
          <div className="font-mono text-xl font-bold text-white tracking-widest">
            {timeFormatted} REMAINING
          </div>
        </div>
      )}

      {/* 3. RED FLAG ALL (Race Suspended) */}
      {activeTransitionMoment === 'red_flag_all' && (
        <div className="max-w-3xl w-full bg-[#151518] border-4 border-[#CE2F2C] p-10 rounded-sm shadow-2xl relative">
          <div className="w-full h-3 bg-red-flag-stripes rounded mb-6" />
          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>SESSION INTERRUPTED · RACE CONTROL DIRECTIVE</span>
          </div>
          <h2 className="select-none mb-4">
            <span className="block hero-solid text-6xl sm:text-8xl text-white">
              RACE
            </span>
            <span className="block hero-outlined text-6xl sm:text-8xl">
              SUSPENDED
            </span>
          </h2>
          <div className="bg-[#0E0E10] border border-[#26262B] p-4 rounded mb-6 max-w-md mx-auto text-xs font-mono">
            <div className="flex justify-between text-[#8A8A93] mb-1">
              <span>CONTEST CLOCK:</span>
              <span className="text-[#CE2F2C] font-bold">PAUSED ({timeFormatted})</span>
            </div>
            <div className="flex justify-between text-[#8A8A93]">
              <span>END TIME EXTENSION:</span>
              <span className="text-white font-bold">+AUTOMATIC COMPENSATION</span>
            </div>
          </div>
          <p className="text-sm text-[#8A8A93] mb-6 max-w-md mx-auto">
            The contest is temporarily paused while Race Control addresses technical conditions. Standby for the 3-light restart sequence.
          </p>
          <button
            onClick={closeTransitionMoment}
            className="px-6 py-2 bg-[#26262B] text-white text-xs font-bold uppercase rounded hover:bg-[#3E4048]"
          >
            DISMISS PREVIEW
          </button>
        </div>
      )}

      {/* 4. RESUME (3-Light Restart Sequence) */}
      {activeTransitionMoment === 'resume' && (
        <div className="max-w-2xl w-full text-center">
          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>RESTART PROCEDURE · STANDING RESTART</span>
          </div>
          <h2 className="font-condensed font-black text-5xl text-white italic uppercase mb-8">
            RACE RESUMING IN 5 SECONDS
          </h2>

          <div className="bg-[#121316] border-4 border-[#26262B] rounded-2xl p-6 shadow-2xl inline-flex items-center gap-6 mb-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-16 h-16 rounded-full border-2 transition-all ${
                  resumeLights >= num
                    ? 'bg-[#FF1801] border-[#FF4E36] shadow-[0_0_30px_#FF1801]'
                    : 'bg-[#2A0505] border-[#400B0B]'
                }`}
              />
            ))}
          </div>

          <div className="text-sm font-mono text-[#2BB673] font-bold uppercase">
            WORKSPACES UNLOCKING AUTOMATICALLY
          </div>
        </div>
      )}

      {/* 5. CHEQUERED FLAG (6s Wipe Screen) */}
      {activeTransitionMoment === 'chequered_flag' && (
        <div className="max-w-3xl w-full p-8 text-center animate-fadeIn">
          {/* Diagonal checkered border bar */}
          <div className="w-full h-4 bg-racing-stripes-overlay border border-white/20 rounded mb-6 opacity-60" />

          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>SESSION TERMINATED · ALL ENGINES OFF</span>
          </div>

          <h2 className="select-none mb-6">
            <span className="block hero-solid text-7xl sm:text-9xl text-white">
              CHEQUERED
            </span>
            <span className="block hero-outlined text-7xl sm:text-9xl">
              FLAG
            </span>
          </h2>

          <div className="bg-[#151518] border border-[#26262B] p-6 rounded max-w-lg mx-auto mb-6">
            <div className="font-condensed font-black text-2xl text-white italic uppercase mb-1">
              SUBMISSIONS CLOSED
            </div>
            <p className="text-xs text-[#8A8A93] font-mono">
              In-flight submissions are being finalized by Judge0 workers. 
              Redirecting to official team dossier in 5 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
