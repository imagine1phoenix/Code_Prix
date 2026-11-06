'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import { TelemetryNetworkCanvas } from '@/components/animations/TelemetryNetworkCanvas';
import { ScrollReveal, StaggerGroup, StaggerItem } from '@/components/animations/ScrollReveal';
import { CockpitFeatureDemo } from '@/components/animations/CockpitFeatureDemo';
import { TypingIndicator } from '@/components/animations/TypingIndicator';
import { ArrowRight, Sparkles, Terminal, Trophy, Timer, Shield } from 'lucide-react';

export default function PaddockLandingPage() {
  const router = useRouter();
  const { remainingSeconds, triggerWipeTransition, activeTeam } = useContest();

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
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden select-none">
      {/* BACKGROUND TELEMETRY NETWORK CANVAS (Priority 7: Connected-node background) */}
      <TelemetryNetworkCanvas nodeCount={32} maxDistance={125} className="z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Eyebrow Motif matching Screenshot 2 */}
        <ScrollReveal direction="down" delay={0.05} distance={15}>
          <div className="eyebrow-motif mb-3">
            <span className="slashes" aria-hidden="true">////</span>
            <span>PADDOCK · WEEK 45 · FET-002 SPRINT</span>
          </div>
        </ScrollReveal>

        {/* Main Hero Row: Solid + Outlined Headline & Join the Grid Card (Priority 1 Reveal) */}
        <ScrollReveal direction="up" delay={0.1} distance={25}>
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

            {/* Right Callout: JOIN THE GRID Card with Red Left Accent Bar & Interactive Micro-Interactions */}
            <div className="lg:col-span-4 bg-[#151518]/90 backdrop-blur-sm border border-[#26262B] p-6 rounded-sm shadow-xl relative border-l-4 border-l-[#CE2F2C] card-interactive">
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
                  type="button"
                  onClick={() => handleNav(activeTeam ? '/race' : '/login')}
                  className="px-5 py-2.5 bg-[#202126] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#2A2B32] transition-colors"
                >
                  {activeTeam ? 'COCKPIT' : 'ENTER'}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav(activeTeam ? '/race' : '/login')}
                  className="group relative overflow-hidden px-6 py-2.5 bg-[#CE2F2C] text-white font-condensed font-black text-sm italic uppercase tracking-wider rounded-sm skew-f1 hover:bg-[#E53935] transition-all shadow-[0_0_15px_rgba(206,47,44,0.4)]"
                >
                  <span className="unskew-f1 flex items-center gap-1.5">
                    <span>{activeTeam ? 'RESUME RACE' : 'REGISTER'}</span>
                    <ArrowRight className="h-3.5 w-3.5 cta-arrow-slide" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* The 3-Card Signature Grid with Staggered Scroll Reveal & Micro-Interactions (Priority 1 & 3) */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" staggerDelay={0.12}>
          {/* Card 1: Red Hero Card with Diagonal Carbon Stripes */}
          <StaggerItem>
            <div className="group bg-[#CE2F2C] rounded-sm p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-[0_0_25px_rgba(206,47,44,0.25)] card-interactive card-interactive-red">
              {/* Diagonal Stripes Overlay on Right Half with subtle hover shift */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-racing-stripes-overlay opacity-30 pointer-events-none transition-transform duration-500 group-hover:scale-105" />

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
                type="button"
                onClick={() => handleNav('/problemset')}
                className="text-xs font-condensed font-black text-white italic uppercase tracking-wider flex items-center gap-1.5 mt-6"
              >
                <span>TO THE PROBLEMSET</span>
                <span className="cta-arrow-slide" aria-hidden="true">→</span>
              </button>
            </div>
          </StaggerItem>

          {/* Card 2: Next Round Card with 3px Indigo Top Border */}
          <StaggerItem>
            <div className="group bg-[#151518]/90 backdrop-blur-sm border border-[#26262B] border-t-4 border-t-[#8F9CF8] rounded-sm p-6 flex flex-col justify-between min-h-[220px] card-interactive">
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
                type="button"
                onClick={() => handleNav('/race')}
                className="text-xs font-condensed font-black text-[#8F9CF8] italic uppercase tracking-wider flex items-center gap-1.5 mt-6"
              >
                <span>REGISTER</span>
                <span className="cta-arrow-slide" aria-hidden="true">→</span>
              </button>
            </div>
          </StaggerItem>

          {/* Card 3: The Grid / Top Rated Card */}
          <StaggerItem>
            <div className="group bg-[#151518]/90 backdrop-blur-sm border border-[#26262B] rounded-sm p-6 flex flex-col justify-between min-h-[220px] card-interactive">
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
                type="button"
                onClick={() => handleNav('/timing')}
                className="text-xs font-condensed font-black text-white italic uppercase tracking-wider flex items-center gap-1.5 mt-6"
              >
                <span>TO THE RATINGS</span>
                <span className="cta-arrow-slide" aria-hidden="true">→</span>
              </button>
            </div>
          </StaggerItem>
        </StaggerGroup>

        {/* Priority 6: ANIMATED PRODUCT / FEATURE DEMONSTRATION (Shopify Editions Staged UI) */}
        <ScrollReveal direction="up" delay={0.15} distance={30} className="mb-16">
          <div className="mb-4 flex items-center justify-between">
            <div className="eyebrow-motif">
              <span className="slashes" aria-hidden="true">////</span>
              <span>INTERACTIVE FEATURE DEMONSTRATION</span>
            </div>
            <span className="text-[11px] font-mono text-[#8A8A93] hidden sm:block">
              SANDBOX PROTOCOL · AUTOPLAY ENABLED
            </span>
          </div>

          <CockpitFeatureDemo />
        </ScrollReveal>

        {/* Bottom Ticker Ribbon with Live Telemetry Typing Indicator (Priority 4) */}
        <ScrollReveal direction="up" delay={0.1} distance={15}>
          <div className="border-t border-[#CE2F2C] pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8A8A93]">
            <div className="flex items-center gap-3">
              <span className="text-[#CE2F2C] font-black italic">////</span>
              <span className="text-white font-bold uppercase tracking-wider">
                UPCOMING CONTEST: CODE GRAND PRIX 2026 · FET-002 SPRINT
              </span>
            </div>

            <div className="flex items-center gap-4">
              <TypingIndicator
                variant="waveform"
                size="sm"
                label="TELEMETRY FEED ACTIVE"
              />
              <div className="hidden sm:block text-[11px] text-[#55565D]">
                SERVER TIME: UTC+05:30 · JAIN UNIVERSITY
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
