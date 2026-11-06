'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import {
  ShieldCheck,
  Flag,
  Users,
  KeyRound,
  AlertCircle,
  CalendarDays,
  UsersRound,
  Timer,
  CheckCircle2,
  Sparkles,
  Radio,
  Laptop,
  Compass,
  Code2,
  Loader2,
} from 'lucide-react';

export default function JoinTheGridPage() {
  const router = useRouter();
  const { loginTeam } = useContest();

  const [teamId, setTeamId] = useState('');
  const [pin, setPin] = useState('');
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [member3, setMember3] = useState('');
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fast demo filler for judges, organizers, and testing
  const handleQuickFillDemo = () => {
    setTeamId('TEAM-042');
    setPin('4242');
    setMember1('Alex Rivera');
    setMember2('Priya Patel');
    setMember3('Chen Wei');
    setPledgeChecked(true);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teamId.trim() || !pin.trim()) {
      setError('Please provide your Team ID and security PIN from the check-in slip.');
      return;
    }

    if (!member1.trim() || !member2.trim() || !member3.trim()) {
      setError('All 3 team members must be entered into the official honor pledge.');
      return;
    }

    if (!pledgeChecked) {
      setError('You must accept the Zero-AI and single-laptop honor pledge to proceed.');
      return;
    }

    setIsSubmitting(true);
    // loginTeam already triggers the speed wipe transition and saves session
    const success = loginTeam(teamId, pin, [member1, member2, member3]);
    if (success) {
      router.push('/scrutineering');
    } else {
      setIsSubmitting(false);
      setError('Invalid Team ID or Security PIN. (Demo pass: TEAM-042 / PIN: 4242)');
    }
  };

  return (
    <main
      id="main-content"
      className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:gap-12 md:px-8 md:py-12"
    >
      {/* LEFT COLUMN: Event Identity & Paddock Briefing */}
      <section aria-labelledby="hero-title" className="flex flex-col justify-center space-y-6">
        <div>
          <div className="eyebrow-motif mb-3">
            <span className="slashes" aria-hidden="true">////</span>
            <span>TEAM ENTRY PORTAL · 13 NOV 2026</span>
          </div>

          {/* Signature Codeforces Paddock Brand Heading: Solid + Outline */}
          <h1
            id="hero-title"
            className="font-condensed text-6xl font-black italic uppercase leading-[0.85] tracking-tight sm:text-7xl lg:text-8xl"
          >
            <span className="block text-white">CODE</span>
            <span className="block text-transparent [-webkit-text-stroke:2px_#CE2F2C]">
              GRAND PRIX
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8A8A93] sm:text-base">
            A timed 3-member team coding championship built around algorithmic problem solving,
            tactical strategy, and live timing tower standings. Sign in to initiate scrutineering and join the grid.
          </p>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { icon: UsersRound, label: 'TEAM FORMAT', value: '3 MEMBERS' },
            { icon: Timer, label: 'RACE FORMAT', value: '3.5H TIMED' },
            { icon: CalendarDays, label: 'CIRCUIT DATE', value: '13 NOV 2026' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="border border-[#26262B] bg-[#151518]/90 p-3 backdrop-blur-sm transition-colors hover:border-[#3B3B42]"
            >
              <Icon className="mb-2.5 h-4 w-4 text-[#CE2F2C]" aria-hidden="true" />
              <div className="text-[10px] font-bold tracking-wider text-[#8A8A93]">{label}</div>
              <div className="mt-0.5 font-condensed text-sm font-black italic tracking-wide text-white">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Paddock Gate Telemetry & Quick Fill Helper */}
        <div className="rounded border border-[#26262B] bg-[#151518]/60 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-[#26262B] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A8A93]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2BB673] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2BB673]" />
              </span>
              <span>Paddock Gate Telemetry</span>
            </div>
            <span className="rounded bg-[#2BB673]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#2BB673]">
              GATE ACTIVE
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#8A8A93]">
            <div className="flex items-center gap-1.5">
              <Laptop className="h-3.5 w-3.5 text-[#55565D]" aria-hidden="true" />
              <span>Single Machine Mode</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-[#55565D]" aria-hidden="true" />
              <span>Offline Lockout Active</span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-[#26262B] pt-3">
            <span className="text-[11px] text-[#8A8A93]">Evaluating or testing?</span>
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="inline-flex items-center gap-1.5 rounded border border-[#CE2F2C]/40 bg-[#CE2F2C]/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#CE2F2C] transition-all hover:bg-[#CE2F2C] hover:text-white"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Auto-Fill Demo Pass</span>
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Stage Stepper & Verification Form Card */}
      <section aria-labelledby="form-heading" className="w-full">
        <div className="eyebrow-motif mb-2">
          <span className="slashes" aria-hidden="true">////</span>
          <span>STAGE 01 · TEAM CREDENTIAL VERIFICATION</span>
        </div>
        <h2
          id="form-heading"
          className="font-condensed text-4xl font-black italic uppercase tracking-wide text-white sm:text-5xl"
        >
          JOIN THE GRID
        </h2>
        <p className="mb-5 mt-1.5 text-sm leading-relaxed text-[#8A8A93]">
          Enter your team credentials from the official check-in slip provided at registration.
        </p>

        {/* Guided Onboarding Stepper */}
        <nav aria-label="Registration stages" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#8A8A93]">
            <li className="flex items-center gap-1.5 font-bold text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#CE2F2C] font-mono text-[11px] font-bold text-white shadow-[0_0_10px_rgba(206,47,44,0.6)]">
                1
              </span>
              <span>Credentials</span>
            </li>
            <li className="text-[#55565D]" aria-hidden="true">→</li>
            <li className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#26262B] bg-[#0E0E10] font-mono text-[11px] text-[#8A8A93]">
                2
              </span>
              <span>Scrutineering</span>
            </li>
            <li className="text-[#55565D]" aria-hidden="true">→</li>
            <li className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#26262B] bg-[#0E0E10] font-mono text-[11px] text-[#8A8A93]">
                3
              </span>
              <span>Grid Standings</span>
            </li>
          </ol>
        </nav>

        {/* Verification Form Card */}
        <div className="relative rounded-sm border border-[#26262B] border-t-4 border-t-[#CE2F2C] bg-[#151518] p-6 shadow-2xl sm:p-8">
          {/* Subtle F1 Carbon / Diagonal Accent in Corner */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-15 [background-image:repeating-linear-gradient(45deg,transparent,transparent_6px,#CE2F2C_6px,#CE2F2C_12px)]"
            aria-hidden="true"
          />

          <form onSubmit={handleSubmit} noValidate>
            {/* Live Accessible Error Banner */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-6 flex items-start gap-2.5 rounded border border-[#CE2F2C]/40 bg-[#CE2F2C]/10 p-3.5 text-xs font-semibold text-[#CE2F2C]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {/* Credentials Row */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="team-id-input"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#8A8A93]"
                >
                  TEAM ID (Check-in Slip) <span className="text-[#CE2F2C]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="team-id-input"
                    type="text"
                    required
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                    placeholder="e.g. TEAM-042"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full rounded border border-[#26262B] bg-[#0E0E10] px-3.5 py-2.5 font-mono text-sm uppercase text-white placeholder:text-[#55565D] focus:border-[#CE2F2C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CE2F2C]"
                  />
                  <Users
                    className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-[#55565D]"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="security-pin-input"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#8A8A93]"
                >
                  SECURITY PIN (4 Digits) <span className="text-[#CE2F2C]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="security-pin-input"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    required
                    autoComplete="current-password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4 digits"
                    className="w-full rounded border border-[#26262B] bg-[#0E0E10] px-3.5 py-2.5 font-mono text-sm tracking-widest text-white placeholder:text-[#55565D] focus:border-[#CE2F2C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CE2F2C]"
                  />
                  <KeyRound
                    className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-[#55565D]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Official Honor Pledge Fieldset */}
            <fieldset className="mb-6 rounded border border-[#26262B] bg-[#0E0E10] p-4 sm:p-5">
              <legend className="flex items-center gap-2 px-1">
                <ShieldCheck className="h-4 w-4 text-[#2BB673]" aria-hidden="true" />
                <span className="font-condensed text-sm font-black italic uppercase tracking-wider text-white">
                  OFFICIAL HONOR PLEDGE · 3 MEMBERS
                </span>
              </legend>

              <p className="mb-4 text-[11px] text-[#8A8A93]">
                Provide full legal names for all three drivers seated at the team station.
              </p>

              <div className="space-y-3">
                {/* Driver 1 */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="driver-1-input"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A93]"
                    >
                      Driver 1 (Primary Typist) <span className="text-[#CE2F2C]">*</span>
                    </label>
                    <span className="inline-flex items-center gap-1 rounded bg-[#151518] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#CE2F2C]">
                      <Code2 className="h-2.5 w-2.5" aria-hidden="true" />
                      TYPIST
                    </span>
                  </div>
                  <input
                    id="driver-1-input"
                    type="text"
                    required
                    value={member1}
                    onChange={(e) => setMember1(e.target.value)}
                    placeholder="Full Legal Name"
                    autoComplete="name"
                    className="w-full rounded border border-[#202126] bg-[#151518] px-3.5 py-2 text-sm text-white placeholder:text-[#55565D] focus:border-[#CE2F2C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CE2F2C]"
                  />
                </div>

                {/* Driver 2 */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="driver-2-input"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A93]"
                    >
                      Driver 2 (Navigator) <span className="text-[#CE2F2C]">*</span>
                    </label>
                    <span className="inline-flex items-center gap-1 rounded bg-[#151518] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#8A8A93]">
                      <Compass className="h-2.5 w-2.5" aria-hidden="true" />
                      NAVIGATOR
                    </span>
                  </div>
                  <input
                    id="driver-2-input"
                    type="text"
                    required
                    value={member2}
                    onChange={(e) => setMember2(e.target.value)}
                    placeholder="Full Legal Name"
                    autoComplete="name"
                    className="w-full rounded border border-[#202126] bg-[#151518] px-3.5 py-2 text-sm text-white placeholder:text-[#55565D] focus:border-[#CE2F2C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CE2F2C]"
                  />
                </div>

                {/* Driver 3 */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="driver-3-input"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A93]"
                    >
                      Driver 3 (Strategist) <span className="text-[#CE2F2C]">*</span>
                    </label>
                    <span className="inline-flex items-center gap-1 rounded bg-[#151518] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#8A8A93]">
                      <Users className="h-2.5 w-2.5" aria-hidden="true" />
                      STRATEGIST
                    </span>
                  </div>
                  <input
                    id="driver-3-input"
                    type="text"
                    required
                    value={member3}
                    onChange={(e) => setMember3(e.target.value)}
                    placeholder="Full Legal Name"
                    autoComplete="name"
                    className="w-full rounded border border-[#202126] bg-[#151518] px-3.5 py-2 text-sm text-white placeholder:text-[#55565D] focus:border-[#CE2F2C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CE2F2C]"
                  />
                </div>
              </div>

              {/* Strict Rule Affirmation Checkbox */}
              <div className="mt-4 border-t border-[#202126] pt-3">
                <label
                  htmlFor="honor-pledge-check"
                  className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#8A8A93]"
                >
                  <input
                    id="honor-pledge-check"
                    type="checkbox"
                    checked={pledgeChecked}
                    onChange={(e) => setPledgeChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#26262B] bg-[#151518] text-[#CE2F2C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CE2F2C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10]"
                  />
                  <span>
                    We solemnly affirm that our team will not utilize external AI assistants (ChatGPT, Copilot, Claude),
                    secondary mobile devices, or off-network communication during Code Grand Prix.
                  </span>
                </label>
              </div>
            </fieldset>

            {/* Properly Bounded F1 Action CTA (No Awkward Border Bleed) */}
            <div className="mt-6">
              <button
                type="submit"
                id="submit-login-button"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded bg-[#CE2F2C] px-6 py-3.5 font-condensed text-base font-black italic uppercase tracking-wider text-white shadow-[0_0_24px_rgba(206,47,44,0.35)] transition-all duration-200 hover:bg-[#E53935] hover:shadow-[0_0_32px_rgba(206,47,44,0.55)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {/* Dynamic Racing Light Reflection on Hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden="true"
                />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      <span>CONNECTING TO SCRUTINEERING GATE...</span>
                    </>
                  ) : (
                    <>
                      <Flag className="h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
                      <span>INITIATE SCRUTINEERING CHECKS</span>
                      <span className="font-sans font-bold transition-transform group-hover:translate-x-1" aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
