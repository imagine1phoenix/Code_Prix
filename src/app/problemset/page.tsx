'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import { Search, ChevronDown, Bookmark, Flame, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, StaggerGroup, StaggerItem } from '@/components/animations/ScrollReveal';
import { TelemetryNetworkCanvas } from '@/components/animations/TelemetryNetworkCanvas';

export default function ProblemsetPage() {
  const router = useRouter();
  const {
    problems,
    activeTeam,
    leaderboard,
    setActiveProblemId,
    triggerWipeTransition,
    isSpeedWiping,
  } = useContest();

  const [activeTab, setActiveTab] = useState<'ALL' | 'UNSOLVED' | 'ATTEMPTED' | 'SOLVED' | 'SAVED'>('ALL');
  const [selectedRatingTier, setSelectedRatingTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedProblems, setSavedProblems] = useState<string[]>([]);

  const currentTeamStats = activeTeam
    ? leaderboard.find((l) => l.teamId === activeTeam.id)?.problemStats || {}
    : {};

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filteredProblems = problems.filter((prob) => {
    const isSolved = currentTeamStats[prob.code]?.solved;
    const attempts = currentTeamStats[prob.code]?.attempts || 0;
    const isSaved = savedProblems.includes(prob.id);

    if (activeTab === 'SOLVED' && !isSolved) return false;
    if (activeTab === 'UNSOLVED' && isSolved) return false;
    if (activeTab === 'ATTEMPTED' && (attempts === 0 || isSolved)) return false;
    if (activeTab === 'SAVED' && !isSaved) return false;

    if (selectedRatingTier === '800-1199' && prob.tier !== 'Easy') return false;
    if (selectedRatingTier === '1200-1599' && prob.tier !== 'Medium') return false;
    if (selectedRatingTier === '1600+' && prob.tier !== 'Hard') return false;

    if (
      searchQuery &&
      !prob.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !prob.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleOpenProblem = (id: string) => {
    setActiveProblemId(id);
    triggerWipeTransition();
    router.push('/race');
  };

  const solvedCount = Object.values(currentTeamStats).filter((s) => s.solved).length;

  return (
    <div className="select-none min-h-screen bg-[#0E0E10]">
      {/* 1. Secondary Navigation Ribbon (Exact from Screenshot 1) */}
      <div className="h-10 bg-[#0E0E10] border-b border-[#202126] px-4 md:px-12 flex items-center gap-6 text-xs font-bold tracking-wider text-[#8A8A93]">
        <button
          onClick={() => {
            triggerWipeTransition();
            router.push('/');
          }}
          className="hover:text-white transition-colors"
        >
          MAIN
        </button>
        <span className="hover:text-white cursor-pointer transition-colors">ACMSGURU</span>
        <div className="text-white border-b-2 border-white pb-2.5 pt-2.5">
          PROBLEMS
        </div>
        <button
          onClick={() => {
            triggerWipeTransition();
            router.push('/race');
          }}
          className="hover:text-white transition-colors"
        >
          SUBMIT
        </button>
        <span className="hover:text-white cursor-pointer transition-colors">STATUS</span>
        <button
          onClick={() => {
            triggerWipeTransition();
            router.push('/timing');
          }}
          className="hover:text-white transition-colors"
        >
          STANDINGS
        </button>
        <button
          onClick={() => {
            triggerWipeTransition();
            router.push('/race');
          }}
          className="hover:text-white transition-colors"
        >
          CUSTOM TEST
        </button>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Subtle ambient telemetry background */}
        <TelemetryNetworkCanvas nodeCount={24} maxDistance={110} className="opacity-40" />

        {/* Eyebrow Motif matching Screenshot 1 */}
        <ScrollReveal direction="down" delay={0.05} distance={15}>
          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>CODEFORCES · PROBLEMSET</span>
          </div>
        </ScrollReveal>

        {/* Header Row: Solid + Outlined Headline & Live Problemset Stats */}
        <ScrollReveal direction="up" delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="select-none leading-none">
                <span className="block hero-solid text-6xl sm:text-7xl md:text-8xl">
                  PROBLEM
                </span>
                <span className="block hero-outlined text-6xl sm:text-7xl md:text-8xl">
                  SET
                </span>
              </h1>
            </div>

            {/* Stats on the right (Exact from Screenshot 1) */}
            <div className="flex items-center gap-8 bg-[#141518]/90 backdrop-blur-sm px-8 py-4 rounded-sm border border-[#26262B] shadow-lg card-interactive">
              <div>
                <div className="font-condensed font-black text-3xl md:text-4xl text-white italic tracking-tight">
                  11,495
                </div>
                <div className="text-[10px] text-[#8A8A93] font-bold uppercase tracking-wider">
                  PROBLEMS
                </div>
              </div>
              <div className="h-8 w-[1px] bg-[#26262B]" />
              <div>
                <div className="font-condensed font-black text-3xl md:text-4xl text-white italic tracking-tight">
                  {solvedCount > 0 ? solvedCount : '—'}
                </div>
                <div className="text-[10px] text-[#8A8A93] font-bold uppercase tracking-wider">
                  SOLVED
                </div>
              </div>
              <div className="h-8 w-[1px] bg-[#26262B]" />
              <div>
                <div className="font-condensed font-black text-3xl md:text-4xl text-white italic tracking-tight">
                  {savedProblems.length}
                </div>
                <div className="text-[10px] text-[#8A8A93] font-bold uppercase tracking-wider">
                  SAVED
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Primary Filter Tabs Bar (Exact from Screenshot 1) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#121316] p-1.5 rounded-sm border border-[#202126] mb-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {/* Active 'ALL' in red skewed parallelogram */}
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-5 py-2 text-xs font-condensed font-black italic uppercase tracking-wider transition-all ${
                activeTab === 'ALL'
                  ? 'bg-[#CE2F2C] text-white skew-f1 shadow-[0_0_10px_rgba(206,47,44,0.3)]'
                  : 'text-[#8A8A93] hover:text-white'
              }`}
            >
              <span className={activeTab === 'ALL' ? 'unskew-f1' : ''}>ALL</span>
            </button>

            <button
              onClick={() => setActiveTab('UNSOLVED')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'UNSOLVED' ? 'text-white bg-[#1F2026] rounded' : 'text-[#8A8A93] hover:text-white'
              }`}
            >
              UNSOLVED
            </button>

            <button
              onClick={() => setActiveTab('ATTEMPTED')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'ATTEMPTED' ? 'text-white bg-[#1F2026] rounded' : 'text-[#8A8A93] hover:text-white'
              }`}
            >
              ATTEMPTED
            </button>

            <button
              onClick={() => setActiveTab('SOLVED')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'SOLVED' ? 'text-white bg-[#1F2026] rounded' : 'text-[#8A8A93] hover:text-white'
              }`}
            >
              SOLVED
            </button>

            <button
              onClick={() => setActiveTab('SAVED')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'SAVED' ? 'text-white bg-[#1F2026] rounded' : 'text-[#8A8A93] hover:text-white'
              }`}
            >
              SAVED
            </button>
          </div>

          {/* Search name or ID with '/' badge + Right Pills */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or ID"
                className="w-full bg-[#18191E] border border-[#26262B] text-xs text-white rounded px-3 py-1.5 pr-8 focus:outline-none focus:border-[#CE2F2C]"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-[#55565D] font-mono">
                /
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#8A8A93]">
              <button className="px-3 py-1.5 bg-[#18191E] border border-[#26262B] hover:text-white rounded">
                TAGS
              </button>
              <button className="px-3 py-1.5 bg-[#18191E] border border-[#26262B] hover:text-white rounded flex items-center gap-1">
                SORT <span className="text-white">NEWEST</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="px-3 py-1.5 bg-[#18191E] border border-[#26262B] hover:text-white rounded">
                CLASSIC
              </button>
            </div>
          </div>
        </div>

        {/* Rating Tiers Pill Strip matching Screenshot 1 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs font-mono">
          {[
            { id: 'ALL', label: 'ALL' },
            { id: '800-1199', label: '800–1199 ROOKIE' },
            { id: '1200-1599', label: '1200–1599 CLUB' },
            { id: '1600+', label: '1600–1999 PRO' },
            { id: '2000-2399', label: '2000–2399 ELITE' },
            { id: '2400+', label: '2400+ LEGEND' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedRatingTier(tier.id)}
              className={`px-4 py-1.5 rounded-sm transition-all whitespace-nowrap ${
                selectedRatingTier === tier.id
                  ? 'border-2 border-white text-white font-bold'
                  : 'bg-[#151518] text-[#8A8A93] border border-[#26262B] hover:text-white'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Problemset Data Table (Exact from Screenshot 1 & 3) */}
        <ScrollReveal direction="up" delay={0.15} distance={25}>
          <div className="bg-[#121316] border border-[#202126] rounded-sm overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 px-6 py-3 bg-[#0A0A0C] border-b border-[#202126] text-[10px] font-bold uppercase tracking-wider text-[#8A8A93]">
              <div className="col-span-1">POS</div>
              <div className="col-span-1">ID</div>
              <div className="col-span-6">PROBLEM</div>
              <div className="col-span-2">RATING</div>
              <div className="col-span-2 text-right">SOLVED BY</div>
            </div>

            <div className="divide-y divide-[#1C1D22]">
              {isSpeedWiping ? (
                // Skeleton Loading State (Matches Screenshot 3)
                [1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={`skel-${idx}`}
                    className="grid grid-cols-12 px-6 py-4 items-center animate-pulse"
                  >
                    <div className="col-span-1 text-[#3B3B42] font-mono text-sm">--</div>
                    <div className="col-span-1">
                      <div className="h-4 w-12 bg-[#1F2026] rounded" />
                    </div>
                    <div className="col-span-6 pr-4 space-y-2">
                      <div className="h-4 w-3/5 bg-[#1F2026] rounded" />
                      <div className="h-3 w-2/5 bg-[#18191E] rounded" />
                    </div>
                    <div className="col-span-2">
                      <div className="h-4 w-16 bg-[#1F2026] rounded" />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <div className="h-5 w-20 bg-[#1F2026] rounded" />
                    </div>
                  </div>
                ))
              ) : (
                filteredProblems.map((prob, index) => {
                  const isSolved = currentTeamStats[prob.code]?.solved;
                  const isSaved = savedProblems.includes(prob.id);

                  return (
                    <div
                      key={prob.id}
                      onClick={() => handleOpenProblem(prob.id)}
                      className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#18191E] cursor-pointer transition-all duration-200 group hover:translate-x-1"
                    >
                      {/* POS */}
                      <div className="col-span-1 font-condensed font-black text-lg text-white">
                        {index + 1}
                      </div>

                      {/* ID */}
                      <div className="col-span-1">
                        <span className="font-mono text-xs font-bold text-white">
                          {prob.code}
                        </span>
                      </div>

                      {/* PROBLEM */}
                      <div className="col-span-6 pr-4">
                        <div className="font-bold text-sm text-white group-hover:text-[#CE2F2C] transition-colors flex items-center gap-2">
                          {prob.title}
                          {isSolved && (
                            <span className="text-[#2BB673] flex items-center gap-0.5 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8A8A93] mt-0.5">
                          bitmasks · brute force · sortings · Sector {prob.sector}
                        </div>
                      </div>

                      {/* RATING */}
                      <div className="col-span-2">
                        <span className="font-mono text-xs font-bold text-[#8A8A93]">
                          / NEW
                        </span>
                      </div>

                      {/* SOLVED BY & SAVE button */}
                      <div className="col-span-2 flex items-center justify-end gap-4">
                        <div className="text-right">
                          <div className="font-mono font-bold text-xs text-[#B138DD]">
                            {prob.points * 3 + 7}
                          </div>
                          <div className="text-[9px] text-[#8A8A93] font-bold uppercase tracking-wider">
                            SOLVERS
                          </div>
                        </div>

                        <button
                          onClick={(e) => toggleSave(prob.id, e)}
                          className={`px-3 py-1 text-[11px] font-bold uppercase rounded border transition-colors ${
                            isSaved
                              ? 'bg-[#CE2F2C] border-[#CE2F2C] text-white'
                              : 'bg-transparent border-[#26262B] text-[#8A8A93] hover:text-white'
                          }`}
                        >
                          {isSaved ? 'SAVED' : 'SAVE'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

