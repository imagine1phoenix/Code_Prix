'use client';

import React, { useState, useEffect } from 'react';
import { useContest } from '@/context/ContestContext';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const YellowFlagOverlay: React.FC = () => {
  const { yellowFlagActive, clearYellowFlag, activeTeam } = useContest();
  const [cooldown, setCooldown] = useState<number>(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (yellowFlagActive) {
      setCooldown(10);
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [yellowFlagActive]);

  if (!yellowFlagActive) return null;

  return (
    <div className="fixed inset-0 z-[9990] bg-[#0E0E10]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      {/* Hazard Warning Stripe Bar */}
      <div className="w-full max-w-xl h-3 bg-hazard-stripes rounded mb-8 shadow-[0_0_20px_#F5C518]" />

      <div className="max-w-xl bg-[#151518] border-2 border-[#F5C518] p-8 rounded-lg shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-[#F5C518]/20 text-[#F5C518] flex items-center justify-center mx-auto mb-4 border border-[#F5C518]/40 animate-bounce">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="text-xs font-bold text-[#F5C518] tracking-widest uppercase mb-1">
          //// TRACK CAUTION · FOCUS LOST
        </div>

        <h2 className="font-condensed font-black text-4xl text-white italic tracking-wide uppercase mb-3">
          YELLOW FLAG OVERLAY
        </h2>

        <p className="text-sm text-[#8A8A93] mb-6 leading-relaxed">
          The contest window lost focus or switched applications. Per Section 4 of the exam regulations, this incident has been logged as a strike on your team's live telemetry dossier.
        </p>

        {activeTeam && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E0E10] border border-[#26262B] rounded mb-6 text-xs font-mono">
            <span className="text-[#8A8A93]">RECORDED STRIKES:</span>
            <span className="text-[#F5C518] font-bold">{activeTeam.strikes} / 3</span>
          </div>
        )}

        <div>
          {cooldown > 0 ? (
            <div className="py-3 px-6 bg-[#26262B] text-[#8A8A93] font-condensed font-bold text-sm tracking-wider uppercase rounded skew-f1 cursor-not-allowed">
              <span className="unskew-f1">
                RETURN TO RACE AVAILABLE IN {cooldown}s...
              </span>
            </div>
          ) : (
            <button
              onClick={clearYellowFlag}
              className="py-3 px-8 bg-[#F5C518] text-black font-condensed font-black text-sm tracking-wider uppercase rounded skew-f1 hover:bg-[#FFD54F] transition-all shadow-[0_0_15px_rgba(245,197,24,0.4)]"
            >
              <span className="unskew-f1 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                RETURN TO RACE NOW
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl h-3 bg-hazard-stripes rounded mt-8 shadow-[0_0_20px_#F5C518]" />
    </div>
  );
};

