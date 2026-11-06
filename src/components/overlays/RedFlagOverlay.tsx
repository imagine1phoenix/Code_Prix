'use client';

import React, { useState } from 'react';
import { useContest } from '@/context/ContestContext';
import { ShieldAlert, KeyRound, CheckCircle2, AlertOctagon } from 'lucide-react';

export const RedFlagOverlay: React.FC = () => {
  const { redFlagActive, flagReason, clearRedFlag, activeTeam, contestState } = useContest();
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('Accidental gesture / False positive');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!redFlagActive) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const passed = clearRedFlag(pin, reason);
    if (passed) {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        setSuccess(false);
        setPin('');
      }, 800);
    } else {
      setError(true);
    }
  };

  const isGlobalPause = contestState === 'paused';

  return (
    <div className="fixed inset-0 z-[9995] bg-[#0A0A0C] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn border-8 border-[#CE2F2C]">
      {/* Top Danger Bar */}
      <div className="w-full max-w-xl h-3 bg-red-flag-stripes rounded mb-6 shadow-[0_0_25px_#CE2F2C]" />

      <div className="max-w-xl w-full bg-[#151518] border border-[#CE2F2C] p-8 rounded-lg shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-[#CE2F2C]/20 text-[#CE2F2C] flex items-center justify-center mx-auto mb-4 border border-[#CE2F2C]/40 animate-pulse">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="text-xs font-bold text-[#CE2F2C] tracking-widest uppercase mb-1">
          //// TRACK RED FLAG · WORKSPACE LOCKED
        </div>

        <h2 className="font-condensed font-black text-4xl text-white italic tracking-wide uppercase mb-3">
          {isGlobalPause ? 'RACE SUSPENDED' : 'RED FLAG LOCKOUT'}
        </h2>

        <p className="text-sm text-[#8A8A93] mb-6 leading-relaxed">
          {isGlobalPause
            ? 'Race Control has issued a global red flag pause for the entire hall. The contest clock is currently stopped. All workspaces are held in standby.'
            : flagReason ||
              'A critical security policy violation has locked this workspace. Please call a floor Marshal to your desk to verify your hardware and enter their clearance PIN.'}
        </p>

        {activeTeam && !isGlobalPause && (
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-[#0E0E10] border border-[#26262B] rounded text-left text-xs font-mono">
            <div>
              <span className="text-[#8A8A93]">TEAM:</span>{' '}
              <span className="text-white font-bold">{activeTeam.name}</span>
            </div>
            <div>
              <span className="text-[#8A8A93]">TABLE:</span>{' '}
              <span className="text-white font-bold">{activeTeam.tableNumber}</span>
            </div>
            <div>
              <span className="text-[#8A8A93]">STRIKES:</span>{' '}
              <span className="text-[#CE2F2C] font-bold">{activeTeam.strikes} / 3</span>
            </div>
            <div>
              <span className="text-[#8A8A93]">IP PINNED:</span>{' '}
              <span className="text-[#2BB673] font-bold">{activeTeam.ipAddress}</span>
            </div>
          </div>
        )}

        {/* Marshal PIN Entry Form */}
        {!isGlobalPause && (
          <form onSubmit={handleUnlock} className="space-y-4 max-w-sm mx-auto">
            <div className="text-left">
              <label className="text-[10px] text-[#8A8A93] font-bold uppercase tracking-wider block mb-1">
                Marshal Clearance Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#0E0E10] border border-[#26262B] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CE2F2C]"
              >
                <option>Accidental gesture / False positive</option>
                <option>Hardware glitch verified on desk</option>
                <option>Floor Marshal physical inspection passed</option>
                <option>Race Control manual clearance override</option>
              </select>
            </div>

            <div className="text-left">
              <label className="text-[10px] text-[#8A8A93] font-bold uppercase tracking-wider block mb-1">
                Marshal 4-Digit Security PIN (Demo: 7788)
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••"
                  className="w-full bg-[#0E0E10] border border-[#26262B] rounded px-3 py-2 text-center text-lg font-mono text-white tracking-widest focus:outline-none focus:border-[#CE2F2C]"
                />
                <KeyRound className="w-4 h-4 text-[#8A8A93] absolute right-3 top-3" />
              </div>
              {error && (
                <div className="text-[11px] text-[#CE2F2C] font-bold mt-1 text-center">
                  Invalid Marshal PIN. Try 7788.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#CE2F2C] text-white font-condensed font-black text-sm tracking-wider uppercase rounded skew-f1 hover:bg-[#E53935] transition-all shadow-[0_0_15px_rgba(206,47,44,0.4)]"
            >
              <span className="unskew-f1 flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                VERIFY & UNLOCK WORKSPACE
              </span>
            </button>
          </form>
        )}
      </div>

      <div className="w-full max-w-xl h-3 bg-red-flag-stripes rounded mt-6 shadow-[0_0_25px_#CE2F2C]" />
    </div>
  );
};

