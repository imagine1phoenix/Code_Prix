'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useContest } from '@/context/ContestContext';
import { Flag, Download, MessageSquare } from 'lucide-react';

export default function FinishChequeredFlagPage() {
  const { activeTeam, leaderboard } = useContest();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedback, setFeedback] = useState('');

  const currentStats = activeTeam
    ? leaderboard.find((l) => l.teamId === activeTeam.id)
    : leaderboard[0];

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center select-none">
      <div className="eyebrow-motif mb-3 justify-center">
        <span className="slashes">////</span>
        <span>FINAL LAP COMPLETE · CODE GRAND PRIX 2026</span>
      </div>

      <div className="w-16 h-16 rounded-full bg-[#CE2F2C]/20 text-[#CE2F2C] flex items-center justify-center mx-auto mb-4 border border-[#CE2F2C]/40 animate-bounce">
        <Flag className="w-8 h-8" />
      </div>

      <h1 className="select-none mb-3">
        <span className="block hero-solid text-6xl sm:text-7xl md:text-8xl">
          CHEQUERED
        </span>
        <span className="block hero-outlined text-6xl sm:text-7xl md:text-8xl">
          FLAG
        </span>
      </h1>

      <p className="text-sm text-[#8A8A93] mb-8 max-w-lg mx-auto leading-relaxed">
        The session clock has expired. Submissions are closed. 
        Final official standings are now available in the timing tower.
      </p>

      {/* Team Performance Summary Card */}
      <div className="bg-[#151518] border border-[#26262B] p-6 rounded-sm shadow-2xl mb-8 border-t-4 border-t-[#CE2F2C] text-left">
        <div className="flex items-center justify-between border-b border-[#26262B] pb-3 mb-4">
          <div>
            <div className="text-[10px] text-[#8A8A93] font-bold uppercase">TEAM DOSSIER</div>
            <div className="font-condensed font-black text-2xl text-white italic uppercase">
              {currentStats?.teamName} ({currentStats?.teamId})
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#8A8A93] font-bold uppercase">PROVISIONAL RANK</div>
            <div className="font-condensed font-black text-2xl text-[#2BB673] italic">
              #{currentStats?.rank}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center font-mono py-2">
          <div className="bg-[#0E0E10] p-3 rounded border border-[#26262B]">
            <div className="text-xs text-[#8A8A93]">SOLVED</div>
            <div className="font-condensed font-black text-2xl text-white italic">
              {currentStats?.solvedCount} / 6
            </div>
          </div>
          <div className="bg-[#0E0E10] p-3 rounded border border-[#26262B]">
            <div className="text-xs text-[#8A8A93]">NET SCORE</div>
            <div className="font-condensed font-black text-2xl text-[#2BB673] italic">
              {currentStats?.netScore} PTS
            </div>
          </div>
          <div className="bg-[#0E0E10] p-3 rounded border border-[#26262B]">
            <div className="text-xs text-[#8A8A93]">PENALTY</div>
            <div className="font-condensed font-black text-2xl text-white italic">
              {currentStats?.penaltyMinutes}m
            </div>
          </div>
        </div>
      </div>

      {/* Certificate & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <button
          onClick={() => alert('Certificate PDF generated for team ' + currentStats?.teamName)}
          className="w-full sm:w-auto px-6 py-3 bg-[#CE2F2C] text-white font-condensed font-black text-sm italic uppercase tracking-wider rounded skew-f1 hover:bg-[#E53935] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(206,47,44,0.3)]"
        >
          <span className="unskew-f1 flex items-center gap-2">
            <Download className="w-4 h-4" />
            DOWNLOAD PARTICIPATION CERTIFICATE (PDF)
          </span>
        </button>

        <Link
          href="/timing"
          className="w-full sm:w-auto px-6 py-3 bg-[#1F2026] text-white font-condensed font-black text-sm italic uppercase tracking-wider rounded border border-[#2A2B32] hover:bg-[#2A2B32] flex items-center justify-center gap-2"
        >
          VIEW TIMING TOWER →
        </Link>
      </div>

      {/* Post-Contest Feedback Form */}
      <div className="bg-[#121316] border border-[#202126] p-6 rounded-sm text-left max-w-xl mx-auto">
        <h4 className="font-condensed font-black text-lg text-white italic uppercase mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#8F9CF8]" />
          FEEDBACK TO CPC ORGANIZERS
        </h4>

        {feedbackSent ? (
          <div className="text-xs text-[#2BB673] font-bold p-3 bg-[#2BB673]/10 border border-[#2BB673]/30 rounded">
            Thank you! Your feedback will help improve future editions of Code Grand Prix.
          </div>
        ) : (
          <form onSubmit={handleFeedback} className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How was problem difficulty, network stability, and platform experience?"
              className="w-full bg-[#0E0E10] border border-[#26262B] rounded p-3 text-xs text-white focus:outline-none focus:border-[#CE2F2C] resize-none h-20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1F2026] text-white text-xs font-bold uppercase rounded hover:bg-[#2A2B32]"
            >
              SUBMIT FEEDBACK
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
