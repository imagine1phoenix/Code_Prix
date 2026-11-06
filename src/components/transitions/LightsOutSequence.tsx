'use client';

import React, { useState, useEffect } from 'react';
import { useContest } from '@/context/ContestContext';
import { soundFx } from '@/lib/soundEffects';
import { useRouter } from 'next/navigation';

export const LightsOutSequence: React.FC = () => {
  const { contestState, setContestState, triggerWipeTransition } = useContest();
  const [litCount, setLitCount] = useState<number>(0);
  const [isGo, setIsGo] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (contestState !== 'lights_out') {
      setLitCount(0);
      setIsGo(false);
      return;
    }

    setLitCount(0);
    setIsGo(false);

    // Light sequence: 1 by 1 every 900ms
    const lightTimers: NodeJS.Timeout[] = [];

    for (let i = 1; i <= 5; i++) {
      const t = setTimeout(() => {
        setLitCount(i);
        soundFx.playRedLight();
      }, i * 900);
      lightTimers.push(t);
    }

    // Extinguish all and trigger GO!
    const goTimer = setTimeout(() => {
      setLitCount(0);
      setIsGo(true);
      soundFx.playLightsOutGo();

      // Transition to racing cockpit
      setTimeout(() => {
        setContestState('racing');
        triggerWipeTransition();
        router.push('/race');
      }, 1200);
    }, 5 * 900 + 1200);

    return () => {
      lightTimers.forEach(clearTimeout);
      clearTimeout(goTimer);
    };
  }, [contestState, setContestState, triggerWipeTransition, router]);

  if (contestState !== 'lights_out') return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-[#0A0A0C] flex flex-col items-center justify-center p-6 select-none">
      <div className="text-center mb-10">
        <div className="eyebrow-motif mb-2">
          <span className="slashes">////</span>
          <span>START PROCEDURE · FORMATION LAP COMPLETE</span>
        </div>
        <h1 className="font-condensed font-black text-5xl md:text-6xl text-white italic tracking-wide uppercase">
          LIGHTS OUT SEQUENCE
        </h1>
      </div>

      {/* The 5 Red Lights Board (FIA F1 Gantry Style) */}
      <div className="bg-[#121316] border-4 border-[#26262B] rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center gap-4 md:gap-8">
        {[1, 2, 3, 4, 5].map((lightIndex) => {
          const isLit = litCount >= lightIndex;
          return (
            <div
              key={lightIndex}
              className="flex flex-col items-center gap-3 bg-[#0A0A0C] p-3 md:p-4 rounded-xl border border-[#202126]"
            >
              {/* Top auxiliary sensor dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#1F2026]" />

              {/* Main Circular Red Light */}
              <div
                className={`w-14 h-14 md:w-20 md:h-20 rounded-full transition-all duration-150 border-2 ${
                  isLit
                    ? 'bg-[#FF1801] border-[#FF4E36] shadow-[0_0_35px_#FF1801,0_0_70px_#FF1801]'
                    : 'bg-[#2A0505] border-[#400B0B]'
                }`}
              />

              {/* Bottom auxiliary dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#1F2026]" />
            </div>
          );
        })}
      </div>

      {/* Flashing "GO!" Banner */}
      <div className="h-28 flex items-center justify-center mt-10">
        {isGo && (
          <div className="font-condensed font-black text-7xl md:text-8xl italic text-[#2BB673] tracking-widest uppercase animate-bounce drop-shadow-[0_0_40px_rgba(43,182,115,0.8)]">
            GO! GO! GO!
          </div>
        )}
      </div>

      <div className="text-xs font-mono text-[#8A8A93] tracking-wider uppercase">
        SERVER AUTHORITATIVE TIMESTAMP SYNCED
      </div>
    </div>
  );
};

