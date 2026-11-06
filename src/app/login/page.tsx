'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import { ShieldCheck, Flag, Users, KeyRound, AlertCircle, CalendarDays, UsersRound, Timer } from 'lucide-react';

export default function JoinTheGridPage() {
  const router = useRouter();
  const { loginTeam, triggerWipeTransition } = useContest();

  const [teamId, setTeamId] = useState('');
  const [pin, setPin] = useState('');
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [member3, setMember3] = useState('');
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teamId.trim() || !pin.trim()) {
      setError('Please provide your Team ID and security PIN from the check-in slip.');
      return;
    }

    if (!member1.trim() || !member2.trim() || !member3.trim()) {
      setError('All 3 team members must be typed into the official honor pledge.');
      return;
    }

    if (!pledgeChecked) {
      setError('You must accept the Zero-AI and single-laptop honor pledge to proceed.');
      return;
    }

    const success = loginTeam(teamId, pin, [member1, member2, member3]);
    if (success) {
      triggerWipeTransition();
      router.push('/scrutineering');
    } else {
      setError('Invalid Team ID or PIN. (Demo: TEAM-042 / PIN: 4242)');
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-8">
      <section className="text-center md:text-left">
        <div className="eyebrow-motif mb-3">
          <span className="slashes">////</span>
          <span>TEAM ENTRY PORTAL · 13 NOV 2026</span>
        </div>
        <h1 className="font-condensed text-6xl font-black italic uppercase leading-[0.85] tracking-wide text-white sm:text-7xl">
          CODE
          <span className="block text-[#CE2F2C]">GRAND PRIX</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[#8A8A93]">
          A timed team coding challenge built around problem solving, strategy, and live standings.
          Sign in to prepare your team and enter the race.
        </p>
        <div className="mt-8 grid max-w-md grid-cols-3 gap-2 text-left">
          {[
            { icon: UsersRound, label: 'TEAM FORMAT', value: '3 MEMBERS' },
            { icon: Timer, label: 'LIVE FORMAT', value: 'TIMED ROUNDS' },
            { icon: CalendarDays, label: 'EVENT DATE', value: '13 NOV 2026' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="border border-[#26262B] bg-[#151518] p-3">
              <Icon className="mb-3 h-4 w-4 text-[#CE2F2C]" />
              <div className="text-[9px] font-bold tracking-wider text-[#8A8A93]">{label}</div>
              <div className="mt-1 text-[10px] font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="eyebrow-motif mb-2">
          <span className="slashes">////</span>
          <span>STAGE 01 · TEAM CREDENTIAL VERIFICATION</span>
        </div>
        <h2 className="font-condensed text-5xl font-black italic uppercase tracking-wide text-white">
          JOIN THE GRID
        </h2>
        <p className="mb-6 mt-2 text-sm leading-relaxed text-[#8A8A93]">
          Enter your team credentials from the registration slip provided by the contest organizers.
        </p>
        <div className="mb-6 flex items-center gap-2 text-xs text-[#8A8A93]" aria-label="Contest setup progress">
          <span className="rounded-full bg-[#CE2F2C] px-2 py-0.5 font-bold text-white">1</span>
          <span className="font-semibold text-white">Credentials</span>
          <span className="text-[#55565D]">→</span>
          <span>Device check</span>
          <span className="text-[#55565D]">→</span>
          <span>Grid</span>
        </div>

      <form onSubmit={handleSubmit} className="bg-[#151518] border border-[#26262B] p-8 rounded-sm shadow-2xl relative border-t-4 border-t-[#CE2F2C]">
        {error && (
          <div className="mb-6 p-4 bg-[#CE2F2C]/10 border border-[#CE2F2C]/40 text-[#CE2F2C] text-xs font-bold rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-[11px] font-bold text-[#8A8A93] uppercase tracking-wider block mb-1">
              TEAM ID (Check-in Slip)
            </label>
            <div className="relative">
              <input
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="e.g. TEAM-042"
                className="w-full bg-[#0E0E10] border border-[#26262B] rounded px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-[#CE2F2C]"
              />
              <Users className="w-4 h-4 text-[#55565D] absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8A8A93] uppercase tracking-wider block mb-1">
              SECURITY PIN (4 Digits)
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="4 digits"
                className="w-full bg-[#0E0E10] border border-[#26262B] rounded px-3 py-2 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-[#CE2F2C]"
              />
              <KeyRound className="w-4 h-4 text-[#55565D] absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Honor Pledge Box */}
        <div className="bg-[#0E0E10] border border-[#26262B] p-4 rounded mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#2BB673]" />
            <h4 className="font-condensed font-black text-sm text-white italic uppercase tracking-wider">
              OFFICIAL HONOR PLEDGE · 3 MEMBERS
            </h4>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-[10px] text-[#8A8A93] font-bold uppercase block mb-1">
                Driver 1 (Primary Typist)
              </label>
              <input
                type="text"
                value={member1}
                onChange={(e) => setMember1(e.target.value)}
                placeholder="Full Legal Name"
                className="w-full bg-[#151518] border border-[#202126] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CE2F2C]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8A8A93] font-bold uppercase block mb-1">
                Driver 2 (Navigator)
              </label>
              <input
                type="text"
                value={member2}
                onChange={(e) => setMember2(e.target.value)}
                placeholder="Full Legal Name"
                className="w-full bg-[#151518] border border-[#202126] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CE2F2C]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8A8A93] font-bold uppercase block mb-1">
                Driver 3 (Strategist)
              </label>
              <input
                type="text"
                value={member3}
                onChange={(e) => setMember3(e.target.value)}
                placeholder="Full Legal Name"
                className="w-full bg-[#151518] border border-[#202126] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CE2F2C]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#8A8A93] leading-snug">
            <input
              type="checkbox"
              checked={pledgeChecked}
              onChange={(e) => setPledgeChecked(e.target.checked)}
              className="mt-0.5 rounded border-[#26262B] text-[#CE2F2C] focus:ring-0"
            />
            <span>
              We solemnly affirm that our team will not utilize external AI models, secondary mobile devices, or off-network communication during Code Grand Prix.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#CE2F2C] text-white font-condensed font-black text-base italic uppercase tracking-wider rounded skew-f1 hover:bg-[#E53935] transition-all shadow-[0_0_20px_rgba(206,47,44,0.4)]"
        >
          <span className="unskew-f1 flex items-center justify-center gap-2">
            <Flag className="w-4 h-4" />
            INITIATE SCRUTINEERING CHECKS →
          </span>
        </button>
      </form>
      </section>
    </div>
  );
}
