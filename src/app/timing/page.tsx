'use client';

import React, { useState } from 'react';
import { useContest } from '@/context/ContestContext';
import { Trophy, Flame, Check, X, HelpCircle, Maximize2, Shield } from 'lucide-react';

export default function TimingTowerPage() {
  const { leaderboard, problems, isFrozen, activeTeam } = useContest();
  const [projectorMode, setProjectorMode] = useState<boolean>(false);

  return (
    <div className={`p-4 md:p-8 max-w-7xl mx-auto ${projectorMode ? 'bg-black min-h-screen text-white' : ''}`}>
      {/* Eyebrow & Mode Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow-motif mb-1">
            <span className="slashes">////</span>
            <span>OFFICIAL TIMING TOWER · LIVE TELEMETRY</span>
          </div>
          <h1 className="font-condensed font-black text-4xl md:text-5xl text-white italic tracking-wide uppercase">
            RACE LEADERBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isFrozen && (
            <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500 text-indigo-300 font-bold text-xs uppercase tracking-wider rounded">
              ❄ LEADERBOARD FROZEN (FINAL 30 MINS)
            </div>
          )}

          <button
            onClick={() => setProjectorMode(!projectorMode)}
            className="px-3 py-1.5 bg-[#18191E] border border-[#26262B] text-xs font-bold uppercase rounded text-[#8A8A93] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{projectorMode ? 'EXIT PROJECTOR' : 'PROJECTOR VIEW'}</span>
          </button>
        </div>
      </div>

      {/* Main Timing Tower Table */}
      <div className="hidden md:block bg-[#121316] border border-[#202126] rounded-sm overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#0A0A0C] border-b border-[#202126] text-[10px] uppercase font-bold text-[#8A8A93]">
              <th className="py-3 px-3 w-12 text-center">POS</th>
              <th className="py-3 px-4 min-w-[180px]">TEAM</th>
              <th className="py-3 px-2 text-center w-14">TBL</th>
              <th className="py-3 px-2 text-center w-14">SLV</th>
              <th className="py-3 px-3 text-right w-24">NET SCORE</th>
              <th className="py-3 px-3 text-right w-20">PENALTY</th>
              {problems.map((p) => (
                <th key={p.id} className="py-3 px-2 text-center min-w-[50px]">
                  {p.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1D22]">
            {leaderboard.map((entry) => {
              const isCurrent = entry.teamId === activeTeam?.id;
              const isP1 = entry.rank === 1;

              return (
                <tr
                  key={entry.teamId}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-[#18191E] border-l-4 border-l-[#CE2F2C]'
                      : isP1
                      ? 'bg-[#141518]'
                      : 'hover:bg-[#15161A]'
                  }`}
                >
                  {/* Position */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`font-condensed font-black text-base italic px-2 py-0.5 rounded ${
                        entry.rank === 1
                          ? 'bg-[#F5C518] text-black font-bold shadow-[0_0_10px_#F5C518]'
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

                  {/* Team Name */}
                  <td className="py-3.5 px-4 font-sans font-bold text-sm text-white">
                    <div className="flex items-center gap-2">
                      <span>{entry.teamName}</span>
                      {isP1 && <Trophy className="w-4 h-4 text-[#F5C518]" />}
                    </div>
                    <div className="text-[10px] font-mono text-[#55565D]">
                      {entry.teamId}
                    </div>
                  </td>

                  {/* Table */}
                  <td className="py-3.5 px-2 text-center text-[#8A8A93]">
                    {entry.tableNumber}
                  </td>

                  {/* Solved Count */}
                  <td className="py-3.5 px-2 text-center font-bold text-[#2BB673]">
                    {entry.solvedCount}
                  </td>

                  {/* Net Score */}
                  <td className="py-3.5 px-3 text-right font-condensed font-black text-base italic text-white">
                    {entry.netScore} PTS
                  </td>

                  {/* Penalty Minutes */}
                  <td className="py-3.5 px-3 text-right text-[#8A8A93]">
                    {entry.penaltyMinutes}m
                  </td>

                  {/* Problem Matrix Cells */}
                  {problems.map((p) => {
                    const stat = entry.problemStats[p.code];
                    if (!stat) {
                      return (
                        <td key={p.id} className="py-3.5 px-2 text-center text-[#2A2B32]">
                          ·
                        </td>
                      );
                    }

                    if (stat.solved) {
                      return (
                        <td key={p.id} className="py-3.5 px-2 text-center">
                          <div
                            className={`inline-flex flex-col items-center justify-center p-1 rounded min-w-[36px] ${
                              stat.fastestLap
                                ? 'bg-[#B138DD]/25 text-[#B138DD] border border-[#B138DD]/40'
                                : 'bg-[#2BB673]/20 text-[#2BB673]'
                            }`}
                          >
                            <div className="flex items-center gap-0.5 font-bold text-[11px]">
                              {stat.fastestLap && <Flame className="w-3 h-3 text-[#B138DD]" />}
                              <span>+{stat.pointsAwarded}</span>
                            </div>
                            <span className="text-[9px] text-white/70">
                              {stat.solveMinute}m
                            </span>
                          </div>
                        </td>
                      );
                    }

                    if (stat.attempts > 0) {
                      return (
                        <td key={p.id} className="py-3.5 px-2 text-center">
                          <span className="inline-block px-1.5 py-0.5 bg-[#CE2F2C]/15 text-[#CE2F2C] border border-[#CE2F2C]/30 rounded text-[10px] font-bold">
                            -{stat.attempts}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={p.id} className="py-3.5 px-2 text-center text-[#2A2B32]">
                        ·
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3">
        {leaderboard.map((entry) => {
          const isCurrent = entry.teamId === activeTeam?.id;
          return (
            <article
              key={`card-${entry.teamId}`}
              className={`rounded border p-4 ${isCurrent ? 'border-[#CE2F2C] bg-[#18191E]' : 'border-[#26262B] bg-[#121316]'}`}
              aria-label={`${entry.teamName}, position ${entry.rank}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-condensed text-2xl italic font-black text-white">P{entry.rank}</span>
                  <div>
                    <div className="font-bold text-white">{entry.teamName}</div>
                    <div className="font-mono text-[10px] text-[#55565D]">{entry.teamId} · Table {entry.tableNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-condensed text-xl font-black italic text-white">{entry.netScore}</div>
                  <div className="text-[10px] text-[#8A8A93]">POINTS</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#26262B] pt-3 text-center">
                <div><div className="font-bold text-[#2BB673]">{entry.solvedCount}</div><div className="text-[10px] text-[#8A8A93]">SOLVED</div></div>
                <div><div className="font-bold text-white">{entry.penaltyMinutes}m</div><div className="text-[10px] text-[#8A8A93]">PENALTY</div></div>
                <div><div className="font-bold text-white">{entry.lastSolveMinute}m</div><div className="text-[10px] text-[#8A8A93]">LAST SOLVE</div></div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
