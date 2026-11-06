'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Terminal,
  CheckCircle2,
  Trophy,
  Radio,
  Cpu,
  Zap,
  Gauge,
  Code2,
} from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';

interface DemoStep {
  id: number;
  phase: string;
  badge: string;
  actionText: string;
}

const STEPS: DemoStep[] = [
  { id: 0, phase: 'INGESTION', badge: 'CIRCUIT TELEMETRY', actionText: 'Problem 2283G loaded into local test runner.' },
  { id: 1, phase: 'TYPING', badge: 'DRIVER 1 (TYPIST)', actionText: 'Synthesizing disjoint-set union algorithm...' },
  { id: 2, phase: 'COMPILATION', badge: 'SANDBOX RUNNER', actionText: 'Compiling target binary via clang++ -O3...' },
  { id: 3, phase: 'VERDICT', badge: 'RACE CONTROL VERIFIED', actionText: 'ACCEPTED · 0.08s execution · 250 PTS gained.' },
  { id: 4, phase: 'PIT_RADIO', badge: 'TACTICAL STRATEGY', actionText: 'P2 achieved! Standings refreshed on Timing Tower.' },
];

const CODE_LINES = [
  '#include <bits/stdc++.h>',
  'using namespace std;',
  '',
  'int main() {',
  '  ios_base::sync_with_stdio(false);',
  '  cin.tie(NULL);',
  '  int n, m; cin >> n >> m;',
  '  vector<int> rank(n + 1, 1);',
  '  // O(α(N)) DSU speed pass',
  '  cout << "ACCEPTED" << "\\n";',
  '  return 0;',
  '}',
];

export const CockpitFeatureDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [visibleCodeLines, setVisibleCodeLines] = useState(4);
  const [speed, setSpeed] = useState<1 | 2>(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = (speed === 1 ? 2800 : 1500);

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % STEPS.length;
        if (next === 1) {
          setVisibleCodeLines(6);
        } else if (next === 2) {
          setVisibleCodeLines(CODE_LINES.length);
        } else if (next === 0) {
          setVisibleCodeLines(4);
        }
        return next;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (stepIndex === 0) setVisibleCodeLines(4);
    else if (stepIndex === 1) setVisibleCodeLines(7);
    else setVisibleCodeLines(CODE_LINES.length);
  };

  return (
    <div className="w-full rounded-sm border border-[#26262B] bg-[#121316] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Top Banner & Demo Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202126] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#CE2F2C]/10 text-[#CE2F2C]">
            <Gauge className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-condensed text-base font-black italic tracking-wide text-white uppercase">
                COCKPIT RUNNER SIMULATION
              </span>
              <span className="rounded bg-[#CE2F2C]/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#CE2F2C]">
                LIVE DEMO
              </span>
            </div>
            <p className="text-[11px] text-[#8A8A93]">
              Simulating single-machine code execution, instant test vectors, and timing tower push
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause demonstration' : 'Play demonstration'}
            className="flex items-center gap-1.5 rounded border border-[#26262B] bg-[#18191E] px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:border-[#3E404D] hover:bg-[#202126]"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 text-[#CE2F2C]" />
                <span className="text-[11px]">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-[#2BB673]" />
                <span className="text-[11px]">RESUME</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentStep(0);
              setVisibleCodeLines(4);
            }}
            title="Restart demo sequence"
            className="rounded border border-[#26262B] bg-[#18191E] p-1.5 text-[#8A8A93] transition-colors hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="rounded border border-[#26262B] bg-[#18191E] px-2 py-1 font-mono text-[10px] font-bold text-[#8A8A93] transition-colors hover:text-white"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Staged Step Indicators matching Shopify Editions */}
      <div className="my-4 grid grid-cols-5 gap-1 sm:gap-2">
        {STEPS.map((s, idx) => {
          const isActive = currentStep === idx;
          const isDone = currentStep > idx;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleStepClick(idx)}
              className={`flex flex-col items-start rounded border p-2 text-left transition-all ${
                isActive
                  ? 'border-[#CE2F2C] bg-[#CE2F2C]/10 text-white shadow-[0_0_12px_rgba(206,47,44,0.3)]'
                  : isDone
                  ? 'border-[#2BB673]/40 bg-[#151518] text-[#8A8A93]'
                  : 'border-[#202126] bg-[#151518]/60 text-[#55565D] hover:border-[#2A2B32]'
              }`}
            >
              <div className="flex w-full items-center justify-between text-[9px] font-mono font-bold">
                <span>0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="h-2.5 w-2.5 text-[#2BB673]" />
                ) : isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#CE2F2C] animate-ping" />
                ) : null}
              </div>
              <span className="mt-1 truncate font-condensed text-[11px] font-black italic tracking-wider">
                {s.phase}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Staged Canvas Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Simulated Monaco Code Editor */}
        <div className="lg:col-span-7 rounded border border-[#26262B] bg-[#0E0E10] p-3 font-mono text-xs flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#202126] pb-2 text-[10px] text-[#8A8A93]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#CE2F2C]" />
                <span className="h-2 w-2 rounded-full bg-[#E5B835]" />
                <span className="h-2 w-2 rounded-full bg-[#2BB673]" />
                <span className="ml-2 font-bold text-white">solution.cpp</span>
              </div>
              <span className="text-[9px] font-bold text-[#CE2F2C]">C++20 · CLANG 18</span>
            </div>

            <div className="mt-2.5 space-y-0.5 text-[11px]">
              {CODE_LINES.slice(0, visibleCodeLines).map((line, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-5 text-right text-[10px] text-[#55565D] select-none">
                    {idx + 1}
                  </span>
                  <span
                    className={
                      line.startsWith('#')
                        ? 'text-[#CE2F2C]'
                        : line.includes('int') || line.includes('return')
                        ? 'text-[#8F9CF8]'
                        : line.includes('cout')
                        ? 'text-[#2BB673]'
                        : 'text-[#D4D4D8]'
                    }
                  >
                    {line}
                  </span>
                </div>
              ))}
              {currentStep === 1 && (
                <div className="flex items-center gap-3">
                  <span className="w-5 text-right text-[10px] text-[#55565D]">
                    {visibleCodeLines + 1}
                  </span>
                  <span className="inline-block h-4 w-1.5 bg-[#CE2F2C] animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Editor Status Bar */}
          <div className="mt-3 flex items-center justify-between border-t border-[#1C1D22] pt-2 text-[10px] text-[#8A8A93]">
            <div className="flex items-center gap-2">
              <Code2 className="h-3 w-3 text-[#55565D]" />
              <span>Ln {visibleCodeLines}, Col 18</span>
            </div>
            {currentStep >= 2 ? (
              <span className="flex items-center gap-1 font-bold text-[#2BB673]">
                <CheckCircle2 className="h-3 w-3" />
                COMPILED OK
              </span>
            ) : (
              <span className="text-[#55565D]">UTF-8</span>
            )}
          </div>
        </div>

        {/* Right: Live Telemetry, Pit Radio, & Timing Impact */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Live Action Status Card */}
          <div className="rounded border border-[#26262B] bg-[#151518] p-3.5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A93]">
                  EXECUTION PIPELINE
                </span>
                <span className="rounded bg-[#1F2026] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                  STAGE 0{currentStep + 1}
                </span>
              </div>

              <div className="my-2">
                <div className="font-condensed text-lg font-black italic uppercase text-white tracking-wide">
                  {STEPS[currentStep].badge}
                </div>
                <p className="mt-1 text-xs text-[#8A8A93] leading-relaxed">
                  {STEPS[currentStep].actionText}
                </p>
              </div>
            </div>

            {/* Dynamic Status Feedback */}
            <div className="mt-3 border-t border-[#202126] pt-2.5">
              {currentStep === 2 && (
                <TypingIndicator
                  label="EXECUTING TEST BATCH (5/5)..."
                  size="sm"
                  variant="dots"
                />
              )}

              {currentStep === 3 && (
                <div className="flex items-center justify-between rounded bg-[#2BB673]/10 border border-[#2BB673]/30 px-2.5 py-1.5 text-xs font-bold text-[#2BB673]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ACCEPTED (TEST 1..5 PASSED)
                  </span>
                  <span className="font-mono text-[10px]">+250 PTS</span>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex items-center justify-between rounded bg-[#CE2F2C]/10 border border-[#CE2F2C]/30 px-2.5 py-1.5 text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-[#E5B835]" />
                    POSITION GAIN: P4 → P2
                  </span>
                  <span className="font-mono text-[10px] text-[#2BB673]">▲ 2 PLACES</span>
                </div>
              )}

              {currentStep < 2 && (
                <div className="flex items-center gap-2 text-[10px] text-[#8A8A93]">
                  <Cpu className="h-3.5 w-3.5 text-[#55565D]" />
                  <span>Awaiting execution trigger...</span>
                </div>
              )}
            </div>
          </div>

          {/* Pit Radio Incoming Simulation */}
          <div className="rounded border border-[#26262B] bg-[#0E0E10] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-[#CE2F2C] animate-pulse" />
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A93]">
                  PIT WALL RADIO
                </div>
                <div className="text-[11px] font-mono font-semibold text-white">
                  {currentStep >= 3 ? '“P2 locked in. Push pace for problem C.”' : '“Monitoring telemetry on sector 1.”'}
                </div>
              </div>
            </div>
            <TypingIndicator variant="waveform" size="sm" label="" />
          </div>
        </div>
      </div>
    </div>
  );
};

