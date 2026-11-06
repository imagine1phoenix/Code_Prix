'use client';

import React, { useState, useEffect } from 'react';
import { useContest } from '@/context/ContestContext';
import { Trophy, Flame, Flag, Clock, Radio } from 'lucide-react';

export default function BigScreenProjectorPage() {
  const {
    leaderboard,
    problems,
    remainingSeconds,
    isFrozen,
    radioMessages,
    contestState,
  } = useContest();

  const [solveFlash, setSolveFlash] = useState<{
    teamName: string;
    problemCode: string;
    points: number;
    fastestLap?: boolean;
  } | null>(null);


  // Trigger occasional simulated solve flash for broadcast atmosphere
  useEffect(() => {
    const timer = setInterval(() => {
      const topTeams = ['Apex Coders', 'Scuderia Syntax', 'Turbo Chargers'];
      const randomTeam = topTeams[Math.floor(Math.random() * topTeams.length)];
      const randomProb = problems[Math.floor(Math.random() * problems.length)];

      setSolveFlash({
        teamName: randomTeam,
        problemCode: randomProb.code,
        points: randomProb.points,
        fastestLap: Math.random() > 0.6,
      });

      setTimeout(() => setSolveFlash(null), 3500);
    }, 18000);

    return () => clearInterval(timer);
  }, [problems]);

  const formatClock = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white p-6 md:p-10 select-none overflow-hidden relative">
      {/* Top Projector Broadcast Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#202126] pb-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="bg-[#CE2F2C] text-white px-5 py-2 skew-f1 font-condensed font-black text-2xl tracking-wider shadow-[0_0_25px_rgba(206,47,44,0.5)]">
            <span className="unskew-f1">CODE GRAND PRIX</span>
          </div>

          <div>
            <div className="eyebrow-motif">
              <span className="slashes">////</span>
              <span>LIVE PROJECTOR · TIMING TOWER</span>
            </div>
            <div className="text-xs font-mono text-[#8A8A93]">
              LIVE TELEMETRY · 150 TEAMS ON THE GRID
            </div>
          </div>
        </div>

        {/* Big Giant Server Clock */}
        <div className="flex items-center gap-6">
          {isFrozen && (
            <div className="px-4 py-2 bg-indigo-500/20 border-2 border-indigo-500 text-indigo-300 font-condensed font-black text-xl uppercase tracking-wider rounded animate-pulse">
              ❄ LEADERBOARD FROZEN
            </div>
          )}

          <div className="bg-[#121316] border-2 border-[#26262B] px-6 py-2 rounded flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#CE2F2C]" />
            <span className="font-condensed font-black text-4xl text-white tracking-widest italic">
              {formatClock(remainingSeconds)}
            </span>
          </div>

        </div>
      </div>

      {/* Solve Flash Broadcast Alert */}
      {solveFlash && (
        <div className="mb-6 p-4 bg-[#2BB673]/20 border-2 border-[#2BB673] rounded shadow-[0_0_30px_rgba(43,182,115,0.4)] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2BB673] text-black flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#2BB673] uppercase tracking-wider">
                SOLVE ALERT // SECTOR {solveFlash.problemCode}
              </div>
              <div className="font-condensed font-black text-2xl text-white italic uppercase">
                {solveFlash.teamName} SOLVED {solveFlash.problemCode} (+{solveFlash.points} PTS)
              </div>
            </div>
          </div>

          {solveFlash.fastestLap && (
            <div className="px-4 py-1.5 bg-[#B138DD] text-white font-condensed font-black text-sm uppercase italic rounded flex items-center gap-1.5 shadow-[0_0_20px_#B138DD]">
              <Flame className="w-4 h-4" />
              FASTEST LAP OF THE DAY
            </div>
          )}
        </div>
      )}

      {/* Main Big Screen Table */}
      <div className="bg-[#101114] border-2 border-[#202126] rounded overflow-hidden shadow-2xl">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="bg-[#0A0A0C] border-b-2 border-[#202126] text-xs uppercase font-bold text-[#8A8A93]">
              <th className="py-4 px-4 w-16 text-center">POS</th>
              <th className="py-4 px-6 min-w-[240px]">TEAM NAME</th>
              <th className="py-4 px-3 text-center">TABLE</th>
              <th className="py-4 px-3 text-center">SOLVED</th>
              <th className="py-4 px-6 text-right">NET POINTS</th>
              <th className="py-4 px-6 text-right">PENALTY</th>
              {problems.map((p) => (
                <th key={p.id} className="py-4 px-3 text-center font-bold">
                  {p.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1D22]">
            {leaderboard.map((entry) => {
              const isP1 = entry.rank === 1;

              return (
                <tr
                  key={entry.teamId}
                  className={`text-sm ${
                    isP1 ? 'bg-[#18191E] border-l-4 border-l-[#F5C518]' : 'hover:bg-[#15161A]'
                  }`}
                >
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`font-condensed font-black text-xl italic px-3 py-1 rounded ${
                        entry.rank === 1
                          ? 'bg-[#F5C518] text-black font-bold shadow-[0_0_15px_#F5C518]'
                          : entry.rank === 2
                          ? 'bg-[#C0C0C0] text-black'
                          : entry.rank === 3
                          ? 'bg-[#CD7F32] text-white'
                          : 'text-[#8A8A93]'
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-sans font-black text-base text-white">
                    <div className="flex items-center gap-2">
                      <span>{entry.teamName}</span>
                      {isP1 && <Trophy className="w-5 h-5 text-[#F5C518]" />}
                    </div>
                  </td>

                  <td className="py-4 px-3 text-center text-[#8A8A93] font-bold">
                    T-{entry.tableNumber}
                  </td>

                  <td className="py-4 px-3 text-center font-black text-lg text-[#2BB673]">
                    {entry.solvedCount}
                  </td>

                  <td className="py-4 px-6 text-right font-condensed font-black text-2xl text-white italic">
                    {entry.netScore} PTS
                  </td>

                  <td className="py-4 px-6 text-right text-sm text-[#8A8A93]">
                    {entry.penaltyMinutes}m
                  </td>

                  {problems.map((p) => {
                    const stat = entry.problemStats[p.code];
                    if (!stat || !stat.solved) {
                      return (
                        <td key={p.id} className="py-4 px-3 text-center text-[#2A2B32]">
                          ·
                        </td>
                      );
                    }

                    return (
                      <td key={p.id} className="py-4 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded font-bold text-xs ${
                            stat.fastestLap
                              ? 'bg-[#B138DD] text-white shadow-[0_0_10px_#B138DD]'
                              : 'bg-[#2BB673]/25 text-[#2BB673]'
                          }`}
                        >
                          +{stat.pointsAwarded}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
