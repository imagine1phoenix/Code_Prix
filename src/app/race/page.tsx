'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useContest } from '@/context/ContestContext';
import { CodeEditor } from '@/components/common/CodeEditor';
import { MathRenderer } from '@/components/common/MathRenderer';
import {
  Play,
  Send,
  HelpCircle,
  Clock,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Radio,
  FileCode2,
  ListOrdered,
  Layers,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

export default function RaceCockpitPage() {
  const {
    activeTeam,
    problems,
    activeProblemId,
    setActiveProblemId,
    remainingSeconds,
    isFrozen,
    leaderboard,
    radioMessages,
    saveDraft,
    getDraft,
    redeemHint,
    runCodeSample,
    submitCode,
    reportViolation,
  } = useContest();

  const [language, setLanguage] = useState<'cpp17' | 'python3' | 'java17'>('cpp17');
  const [code, setCode] = useState<string>('');
  const [editorFontSize, setEditorFontSize] = useState<number>(14);
  const [bottomTab, setBottomTab] = useState<'output' | 'input' | 'submissions' | 'timing'>('output');
  const [customInput, setCustomInput] = useState<string>('');
  const [runResult, setRunResult] = useState<{
    status: 'idle' | 'running' | 'success' | 'failed';
    output?: string;
    expected?: string;
    runtime?: number;
  }>({ status: 'idle' });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [hintModalLevel, setHintModalLevel] = useState<1 | 2 | 3 | null>(null);
  const [cooldownRun, setCooldownRun] = useState<number>(0);
  const [cooldownSubmit, setCooldownSubmit] = useState<number>(0);
  const [mobilePane, setMobilePane] = useState<'problem' | 'statement' | 'editor'>('editor');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const activeProblem = problems.find((p) => p.id === activeProblemId) || problems[0];
  const teamStats = activeTeam
    ? leaderboard.find((l) => l.teamId === activeTeam.id)?.problemStats[activeProblem.code]
    : undefined;

  // Load and save drafts
  useEffect(() => {
    const draft = getDraft(activeProblem.id, language);
    setCode(draft);
  }, [activeProblem.id, language, getDraft]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    saveDraft(activeProblem.id, language, newCode);
    setLastSavedAt(Date.now());
  };

  // Cooldown timers
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (cooldownRun > 0) {
      t = setInterval(() => setCooldownRun((prev) => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [cooldownRun]);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (cooldownSubmit > 0) {
      t = setInterval(() => setCooldownSubmit((prev) => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [cooldownSubmit]);

  // Anti-Cheat Window Event Listeners
  useEffect(() => {
    const handleBlur = () => {
      reportViolation('FOCUS_LOST', 'Window focus lost or tab switched.');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        reportViolation('FULLSCREEN_EXIT', 'Fullscreen display mode exited.');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept DevTools shortcuts
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j' || e.key === 'c'))
      ) {
        e.preventDefault();
        reportViolation('DEVTOOLS_SHORTCUT', 'DevTools key combination suppressed.');
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reportViolation]);

  // Handle Run Samples
  const handleRun = async () => {
    if (cooldownRun > 0) return;
    setCooldownRun(5);
    setRunResult({ status: 'running' });
    setBottomTab('output');
    try {
      const res = await runCodeSample(activeProblem.id, language, code);
      setRunResult({
        status: res.passed ? 'success' : 'failed',
        output: res.output,
        expected: res.expected,
        runtime: res.runtime,
      });
    } catch {
      setRunResult({ status: 'failed', output: 'Runtime exception occurred.' });
    }
  };

  // Handle Submit Hidden Tests
  const handleSubmit = async () => {
    if (cooldownSubmit > 0 || submitLoading) return;
    setCooldownSubmit(20);
    setSubmitLoading(true);
    setBottomTab('submissions');
    try {
      await submitCode(activeProblem.id, language, code);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Watermark string
  const watermarkText = `${activeTeam?.id || 'TEAM-42'} · ${activeTeam?.ipAddress || '192.168.1.14'} · 13 NOV 2026`;

  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#0E0E10] overflow-hidden select-none">
      {/* 1. Cockpit Top Telemetry Strip (PRD Section 5) */}
      <div className="h-11 bg-[#121316] border-b border-[#202126] px-4 flex items-center justify-between text-xs font-mono">
        {/* Left: Table & Team Badge + Problem Code */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-0.5 bg-[#0A0A0C] border border-[#202126] rounded">
            <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              {activeTeam ? `T-${activeTeam.tableNumber} · ${activeTeam.name}` : 'COCKPIT'}
            </span>
          </div>

          <div className="hidden sm:block font-bold text-white text-xs bg-[#1F2026] px-2 py-0.5 rounded border border-[#2A2B32]">
            {activeProblem.code}: {activeProblem.title}
          </div>

          {/* Team Radio marquee */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-0.5 bg-[#0A0A0C] border border-[#202126] rounded text-[#8A8A93] text-[11px]">
            <Radio className="w-3 h-3 text-[#CE2F2C]" />
            <span className="text-[#CE2F2C] font-bold">RADIO:</span>
            <span className="text-white max-w-xs truncate">
              {radioMessages[0]?.message || 'All systems green across the circuit.'}
            </span>
          </div>
        </div>

        {/* Center: Contest Clock */}
        <div className="flex items-center gap-2 px-3 py-0.5 rounded bg-[#0A0A0C] border border-[#26262B]">
          <Clock className="w-3.5 h-3.5 text-[#CE2F2C]" />
          <span
            className={`font-mono text-xs font-bold tracking-wider ${
              remainingSeconds <= 600 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}
          >
            {formatTimer(remainingSeconds)}
          </span>
          {isFrozen && (
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1 py-0.5 rounded font-bold uppercase">
              FROZEN
            </span>
          )}
        </div>

        {/* Right: Score, Rank, Strike Dots, Fullscreen */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 text-white">
            <span className="text-[#8A8A93] text-[11px]">SCORE:</span>
            <span className="font-condensed font-black text-sm text-[#2BB673]">
              {leaderboard.find((l) => l.teamId === activeTeam?.id)?.netScore || 0} PTS
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <span className="text-[#8A8A93] text-[11px]">RANK:</span>
            <span className="font-condensed font-black text-sm text-white">
              {isFrozen
                ? '[FROZEN]'
                : `#${leaderboard.find((l) => l.teamId === activeTeam?.id)?.rank || 1}`}
            </span>
          </div>

          {/* Strike dots */}
          {activeTeam && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 bg-[#0A0A0C] rounded border border-[#202126]"
              title={`Strikes: ${activeTeam.strikes}/3`}
            >
              {[1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={`w-2 h-2 rounded-full ${
                    dot <= activeTeam.strikes
                      ? 'bg-[#CE2F2C] shadow-[0_0_6px_#CE2F2C]'
                      : 'bg-[#2A2B32]'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[#1F2026] text-[#8A8A93] hover:text-white rounded border border-[#2A2B32] text-[10px]"
            title="Lock Fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
            <span>FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* 2. Main 3-Column Racing Cockpit */}
      <div className="md:hidden flex items-center gap-1 p-2 bg-[#121316] border-b border-[#202126]" role="tablist" aria-label="Cockpit panels">
        {[
          ['problem', 'Problems'],
          ['statement', 'Statement'],
          ['editor', 'Editor'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mobilePane === value}
            onClick={() => setMobilePane(value as typeof mobilePane)}
            className={`flex-1 min-h-10 rounded text-xs font-bold uppercase ${
              mobilePane === value ? 'bg-[#CE2F2C] text-white' : 'bg-[#1F2026] text-[#8A8A93]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Rail: The Circuit (Sectors & Problem list) */}
        <div className={`${mobilePane === 'problem' ? 'flex' : 'hidden'} md:flex col-span-12 md:col-span-3 lg:col-span-2 bg-[#121316] border-r border-[#202126] flex-col overflow-y-auto`}>
          <div className="p-3 border-b border-[#202126] bg-[#0E0E10]">
            <div className="text-[10px] font-bold text-[#8A8A93] uppercase tracking-wider mb-0.5">
              //// SECTOR TRACKER
            </div>
            <div className="font-condensed font-black text-base text-white italic tracking-wide uppercase">
              THE CIRCUIT
            </div>
          </div>

          <div className="divide-y divide-[#1C1D22]">
            {problems.map((prob) => {
              const isSelected = prob.id === activeProblem.id;
              const isSolved = activeTeam
                ? leaderboard.find((l) => l.teamId === activeTeam.id)?.problemStats[prob.code]?.solved
                : false;
              const hasHints = (activeTeam?.redeemedHints[prob.id]?.length || 0) > 0;
              const isFastestLap = prob.fastestLapTeamId === activeTeam?.id;

              return (
                <button
                  key={prob.id}
                  onClick={() => setActiveProblemId(prob.id)}
                  className={`w-full text-left p-3 transition-colors flex flex-col gap-1 relative ${
                    isSelected ? 'bg-[#18191E] border-l-4 border-l-[#CE2F2C]' : 'hover:bg-[#15161A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white bg-[#202126] px-1.5 py-0.5 rounded">
                      {prob.code}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        prob.tier === 'Easy'
                          ? 'text-[#2BB673] bg-[#2BB673]/10'
                          : prob.tier === 'Medium'
                          ? 'text-[#F5C518] bg-[#F5C518]/10'
                          : 'text-[#CE2F2C] bg-[#CE2F2C]/10'
                      }`}
                    >
                      {prob.points} PTS
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white truncate max-w-full">
                    {prob.title}
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                    {isSolved ? (
                      <span className="text-[#2BB673] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> SOLVED
                      </span>
                    ) : (
                      <span className="text-[#55565D]">UNSOLVED</span>
                    )}

                    {isFastestLap && (
                      <span className="text-[#B138DD] flex items-center gap-0.5 font-bold">
                        <Flame className="w-3 h-3" /> FASTEST
                      </span>
                    )}

                    {hasHints && (
                      <span className="text-[#F5C518] text-[9px] font-bold bg-[#F5C518]/10 px-1 rounded">
                        HINT USED
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Pane: Problem Statement (Protected with Watermark & Non-Selectable) */}
        <div className={`${mobilePane === 'statement' ? 'flex' : 'hidden'} md:flex col-span-12 md:col-span-5 lg:col-span-5 bg-[#151518] border-r border-[#202126] flex-col overflow-y-auto relative p-4 md:p-6 select-none`}>
          {/* Subtle Security Diagonal Watermark */}
          <div className="watermark-overlay" />
          <div className="absolute right-4 top-4 text-[10px] font-mono text-white/10 rotate-[-12deg] pointer-events-none select-none">
            {watermarkText}
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-[#26262B] pb-4 mb-5">
              <div>
                <div className="eyebrow-motif mb-1">
                  <span className="slashes">////</span>
                  <span>
                    SECTOR {activeProblem.sector} · {activeProblem.tier.toUpperCase()} ·{' '}
                    {activeProblem.points} POINTS
                  </span>
                </div>
                <h2 className="font-condensed font-black text-3xl text-white italic tracking-wide uppercase">
                  {activeProblem.code}: {activeProblem.title}
                </h2>
              </div>

              {teamStats?.solved && (
                <div className="px-3 py-1 bg-[#2BB673]/15 text-[#2BB673] border border-[#2BB673]/30 rounded font-bold text-xs uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  ACCEPTED (+{teamStats.pointsAwarded} PTS)
                </div>
              )}
            </div>

            {/* Constraints Strip */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-[#0E0E10] border border-[#26262B] rounded text-xs font-mono">
              <div>
                <span className="text-[#8A8A93]">TIME LIMIT:</span>{' '}
                <span className="text-white font-bold">{activeProblem.timeLimit}</span>
              </div>
              <div>
                <span className="text-[#8A8A93]">MEMORY LIMIT:</span>{' '}
                <span className="text-white font-bold">{activeProblem.memoryLimit}</span>
              </div>
            </div>

            {/* Problem Statement Body */}
            <MathRenderer
              content={activeProblem.statement}
              className="text-sm text-[#D1D2DC] leading-relaxed mb-6 space-y-4 font-sans"
            />

            {/* Constraints List */}
            <div className="mb-6">
              <h4 className="font-condensed font-black text-base text-white italic uppercase tracking-wider mb-2">
                CONSTRAINTS & TECHNICAL LIMITS
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#8A8A93] bg-[#0E0E10] p-3 rounded border border-[#26262B]">
                {activeProblem.constraints.map((c, i) => (
                  <li key={i}>
                    <MathRenderer content={c} className="inline" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Cases */}
            <div className="mb-6 space-y-4">
              <h4 className="font-condensed font-black text-base text-white italic uppercase tracking-wider">
                SAMPLE TELEMETRY CASES
              </h4>

              {activeProblem.samples.map((sample, idx) => (
                <div key={sample.id} className="bg-[#0E0E10] border border-[#26262B] rounded p-3">
                  <div className="text-[10px] font-bold text-[#8A8A93] uppercase tracking-wider mb-2">
                    SAMPLE #{idx + 1}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-[#8A8A93] mb-1 font-mono">INPUT:</div>
                      <pre className="bg-[#151518] p-2 rounded text-xs font-mono text-white overflow-x-auto border border-[#1F2026]">
                        {sample.input}
                      </pre>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#8A8A93] mb-1 font-mono">EXPECTED:</div>
                      <pre className="bg-[#151518] p-2 rounded text-xs font-mono text-[#2BB673] overflow-x-auto border border-[#1F2026]">
                        {sample.expectedOutput}
                      </pre>
                    </div>
                  </div>
                  {sample.explanation && (
                    <div className="text-[11px] text-[#8A8A93] mt-2 italic">
                      Note: {sample.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pit Stop / Hint Redeem Section */}
            <div className="border-t border-[#26262B] pt-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#F5C518]" />
                  <span className="font-condensed font-black text-lg text-white italic uppercase">
                    PIT STOP (ENGINEERING HINTS)
                  </span>
                </div>
                <span className="text-[11px] text-[#8A8A93]">
                  Costs points immediately upon unlock
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeProblem.hints.map((hint) => {
                  const isRedeemed =
                    activeTeam?.redeemedHints[activeProblem.id]?.includes(hint.level);

                  return (
                    <div
                      key={hint.level}
                      className="bg-[#0E0E10] border border-[#26262B] rounded p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">HINT #{hint.level}</span>
                        <span className="text-[10px] font-bold text-[#CE2F2C]">
                          -{hint.costPoints} PTS ({hint.costPercent}%)
                        </span>
                      </div>

                      {isRedeemed ? (
                        <div className="text-xs text-[#F5C518] bg-[#F5C518]/10 p-2 rounded border border-[#F5C518]/20">
                          {hint.text}
                        </div>
                      ) : (
                        <button
                          onClick={() => setHintModalLevel(hint.level as 1 | 2 | 3)}
                          className="w-full py-1.5 bg-[#1F2026] hover:bg-[#2A2B32] text-white text-[11px] font-bold uppercase rounded border border-[#2A2B32] transition-colors"
                        >
                          UNLOCK HINT
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor + Execution Console */}
        <div className={`${mobilePane === 'editor' ? 'flex' : 'hidden'} md:flex col-span-12 md:col-span-4 lg:col-span-5 bg-[#0E0E10] flex-col overflow-hidden`}>
          {/* Editor Header Toolbar */}
          <div className="h-11 bg-[#151518] border-b border-[#26262B] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'cpp17' | 'python3' | 'java17')}
                className="bg-[#0E0E10] border border-[#26262B] text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-[#CE2F2C]"
              >
                <option value="cpp17">C++17 (GCC 11)</option>
                <option value="python3">Python 3.11</option>
                <option value="java17">Java 17 (OpenJDK)</option>
              </select>

              <div className="flex items-center gap-1 text-[11px] text-[#8A8A93]">
                <button
                  onClick={() => setEditorFontSize((f) => Math.max(11, f - 1))}
                  className="px-2 py-0.5 bg-[#0E0E10] hover:text-white rounded border border-[#26262B]"
                >
                  A-
                </button>
                <button
                  onClick={() => setEditorFontSize((f) => Math.min(22, f + 1))}
                  className="px-2 py-0.5 bg-[#0E0E10] hover:text-white rounded border border-[#26262B]"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#2BB673] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2BB673]" />
              <span>{lastSavedAt ? `DRAFT SAVED ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'DRAFT READY'}</span>
            </div>
          </div>

          {/* Code Editor Body */}
          <div className="flex-1 bg-[#0A0A0C] relative">
            <CodeEditor
              language={language}
              value={code}
              onChange={handleCodeChange}
              fontSize={editorFontSize}
            />
          </div>

          {/* Action Bar (Run Samples & Submit Hidden Tests) */}
          <div className="h-14 bg-[#151518] border-t border-[#26262B] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCodeChange(getDraft(activeProblem.id, language))}
                className="p-2 rounded bg-[#0E0E10] border border-[#26262B] text-[#8A8A93] hover:text-white transition-colors"
                title="Reset to Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* RUN SAMPLES */}
              <button
                onClick={handleRun}
                disabled={cooldownRun > 0 || runResult.status === 'running'}
                aria-label={cooldownRun > 0 ? `Run samples available in ${cooldownRun} seconds` : 'Run sample tests'}
                className={`px-4 py-2 text-xs font-bold uppercase rounded border transition-all flex items-center gap-1.5 ${
                  cooldownRun > 0
                    ? 'bg-[#18191E] border-[#26262B] text-[#55565D] cursor-not-allowed'
                    : 'bg-[#1F2026] border-[#3E4048] text-white hover:bg-[#2A2B32]'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-[#2BB673]" />
                <span>
                  {runResult.status === 'running'
                    ? 'RUNNING...'
                    : cooldownRun > 0
                    ? `RUN (${cooldownRun}s)`
                    : 'RUN (SAMPLES)'}
                </span>
              </button>

              {/* SUBMIT CODE (Red Skewed Parallelogram) */}
              <button
                onClick={handleSubmit}
                disabled={cooldownSubmit > 0 || submitLoading}
                aria-label={cooldownSubmit > 0 ? `Submit available in ${cooldownSubmit} seconds` : 'Submit code to hidden tests'}
                className={`px-6 py-2 skew-f1 text-white font-condensed font-black text-sm uppercase italic tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(206,47,44,0.3)] ${
                  cooldownSubmit > 0
                    ? 'bg-[#551616] cursor-not-allowed text-white/50'
                    : 'bg-[#CE2F2C] hover:bg-[#E53935]'
                }`}
              >
                <span className="unskew-f1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  {submitLoading
                    ? 'JUDGING...'
                    : cooldownSubmit > 0
                    ? `SUBMIT (${cooldownSubmit}s)`
                    : 'SUBMIT (TESTS)'}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Execution Dock / Tabs */}
          <div className="h-44 bg-[#121316] border-t border-[#202126] flex flex-col">
            {/* Dock Tabs Header */}
            <div className="flex items-center gap-1 px-3 pt-1.5 border-b border-[#202126] bg-[#0E0E10]">
              <button
                onClick={() => setBottomTab('output')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  bottomTab === 'output' ? 'text-white border-b-2 border-b-[#CE2F2C]' : 'text-[#8A8A93]'
                }`}
              >
                Run Output
              </button>
              <button
                onClick={() => setBottomTab('input')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  bottomTab === 'input' ? 'text-white border-b-2 border-b-[#CE2F2C]' : 'text-[#8A8A93]'
                }`}
              >
                Custom Input
              </button>
              <button
                onClick={() => setBottomTab('submissions')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  bottomTab === 'submissions'
                    ? 'text-white border-b-2 border-b-[#CE2F2C]'
                    : 'text-[#8A8A93]'
                }`}
              >
                Submissions
              </button>
              <button
                onClick={() => setBottomTab('timing')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  bottomTab === 'timing' ? 'text-white border-b-2 border-b-[#CE2F2C]' : 'text-[#8A8A93]'
                }`}
              >
                Timing Tower
              </button>
            </div>

            {/* Dock Content */}
            <div className="flex-1 p-3 overflow-y-auto text-xs font-mono">
              {bottomTab === 'output' && (
                <div>
                  {runResult.status === 'idle' && (
                    <div className="text-[#55565D] italic">
                      Click &quot;RUN (SAMPLES)&quot; to test your code against Sample #1.
                    </div>
                  )}
                  {runResult.status === 'running' && (
                    <div className="text-yellow-400 animate-pulse">
                      Executing sandbox test runner in Docker...
                    </div>
                  )}
                  {runResult.status === 'success' && (
                    <div className="space-y-2">
                      <div className="text-[#2BB673] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        SAMPLE PASSED · Execution time: {runResult.runtime}ms
                      </div>
                      <div className="bg-[#0A0A0C] p-2 rounded text-[#D1D2DC] border border-[#202126]">
                        Output: {runResult.output}
                      </div>
                    </div>
                  )}
                  {runResult.status === 'failed' && (
                    <div className="space-y-2">
                      <div className="text-[#CE2F2C] font-bold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        FAILED SAMPLE · Execution time: {runResult.runtime}ms
                      </div>
                      <div className="bg-[#0A0A0C] p-2 rounded text-[#CE2F2C] border border-[#202126]">
                        {runResult.output}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {bottomTab === 'input' && (
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Paste custom standard input here..."
                  className="w-full h-full bg-[#0A0A0C] text-white p-2 rounded border border-[#202126] focus:outline-none resize-none font-mono text-xs"
                />
              )}

              {bottomTab === 'submissions' && (
                <div className="space-y-2">
                  <div className="text-[10px] text-[#8A8A93] uppercase tracking-wider">
                    Recent Submissions for {activeProblem.code}
                  </div>
                  {/* Submission row */}
                  <div className="flex items-center justify-between p-2 bg-[#0A0A0C] rounded border border-[#202126]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#2BB673] font-bold">ACCEPTED</span>
                      <span className="text-[#8A8A93]">· 42ms · 14.2 MB</span>
                    </div>
                    <span className="text-[#55565D]">10:48 AM</span>
                  </div>
                </div>
              )}

              {bottomTab === 'timing' && (
                <div className="space-y-1">
                  {leaderboard.slice(0, 4).map((entry) => (
                    <div
                      key={entry.teamId}
                      className="flex items-center justify-between py-1 px-2 bg-[#0A0A0C] rounded text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">#{entry.rank}</span>
                        <span className="text-white truncate max-w-[120px]">{entry.teamName}</span>
                      </div>
                      <div className="font-bold text-[#2BB673]">{entry.netScore} PTS</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pit Stop Hint Confirmation Modal */}
      {hintModalLevel && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151518] border-2 border-[#CE2F2C] p-6 rounded max-w-md w-full shadow-2xl">
            <h3 className="font-condensed font-black text-2xl text-white italic uppercase mb-2">
              CONFIRM PIT STOP HINT #{hintModalLevel}
            </h3>
            <p className="text-xs text-[#8A8A93] mb-4 leading-relaxed">
              Unlocking Hint #{hintModalLevel} will immediately deduct{' '}
              <strong className="text-[#CE2F2C]">
                {activeProblem.hints.find((h) => h.level === hintModalLevel)?.costPoints} Points
              </strong>{' '}
              ({activeProblem.hints.find((h) => h.level === hintModalLevel)?.costPercent}%) from your net score. 
              Once revealed, hint deductions are permanent and cannot be refunded.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setHintModalLevel(null)}
                className="px-4 py-2 bg-[#202126] text-white text-xs font-bold uppercase rounded hover:bg-[#2A2B32]"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  redeemHint(activeProblem.id, hintModalLevel);
                  setHintModalLevel(null);
                }}
                className="px-5 py-2 bg-[#CE2F2C] text-white font-condensed font-black text-xs uppercase italic tracking-wider rounded skew-f1 hover:bg-[#E53935]"
              >
                <span className="unskew-f1">CONFIRM & DEDUCT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
