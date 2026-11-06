'use client';

import React, { useState } from 'react';
import { useContest } from '@/context/ContestContext';
import {
  Sliders,
  Play,
  Pause,
  Clock,
  Radio,
  RotateCcw,
  AlertOctagon,
  Users,
  Send,
  CheckCircle2,
  XCircle,
  FileCode2,
} from 'lucide-react';

export default function RaceControlPage() {
  const {
    contestState,
    remainingSeconds,
    isFrozen,
    teams,
    problems,
    submissions,
    violations,
    triggerLightsOut,
    pauseContest,
    resumeContest,
    toggleFreeze,
    extendTime,
    broadcastRadio,
    triggerTransitionMoment,
  } = useContest();

  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'violations' | 'radio'>('overview');
  const [radioInput, setRadioInput] = useState('');
  const [isUrgentRadio, setIsUrgentRadio] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'lights_out' | 'red_flag' | null>(null);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!radioInput.trim()) return;
    broadcastRadio(radioInput.trim(), isUrgentRadio);
    setRadioInput('');
  };

  const flaggedTeamsCount = teams.filter((t) => t.status === 'red' || t.status === 'yellow').length;
  const confirmActionLabel = confirmAction === 'red_flag' ? 'RED FLAG ALL' : 'LIGHTS OUT';

  const executeConfirmedAction = () => {
    if (confirmAction === 'red_flag') pauseContest('Emergency Pause issued by Race Control');
    if (confirmAction === 'lights_out') triggerLightsOut();
    setConfirmAction(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 select-none">
      {/* Header & Global Master Controls Ribbon */}
      <div className="border-b border-[#202126] pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="eyebrow-motif mb-1">
              <span className="slashes">////</span>
              <span>ADMINISTRATIVE MISSION CONTROL · DESKTOP CONSOLE</span>
            </div>
            <h1 className="font-condensed font-black text-4xl md:text-5xl text-white italic tracking-wide uppercase">
              RACE CONTROL
            </h1>
          </div>

          {/* Global Master Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Trigger 5 Lights Out */}
            <button
              onClick={() => setConfirmAction('lights_out')}
              className="px-4 py-2 bg-[#CE2F2C] text-white font-condensed font-black text-xs uppercase italic tracking-wider rounded skew-f1 hover:bg-[#E53935] shadow-[0_0_15px_rgba(206,47,44,0.4)]"
            >
              <span className="unskew-f1 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" />
                LIGHTS OUT
              </span>
            </button>

            {/* Red Flag All / Resume */}
            {contestState === 'paused' ? (
              <button
                onClick={resumeContest}
                className="px-4 py-2 bg-[#2BB673] text-white font-condensed font-black text-xs uppercase italic tracking-wider rounded skew-f1 hover:bg-[#25A266]"
              >
                <span className="unskew-f1 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  RESUME RACE
                </span>
              </button>
            ) : (
              <button
                onClick={() => setConfirmAction('red_flag')}
                className="px-4 py-2 bg-[#B52927] text-white font-condensed font-black text-xs uppercase italic tracking-wider rounded skew-f1 hover:bg-[#CE2F2C]"
              >
                <span className="unskew-f1 flex items-center gap-1.5">
                  <Pause className="w-3.5 h-3.5" />
                  RED FLAG ALL
                </span>
              </button>
            )}

            {/* Toggle Freeze */}
            <button
              onClick={toggleFreeze}
              className={`px-4 py-2 text-xs font-condensed font-black uppercase italic tracking-wider rounded skew-f1 border transition-colors ${
                isFrozen
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-[#18191E] text-[#8F9CF8] border-[#26262B] hover:bg-[#202126]'
              }`}
            >
              <span className="unskew-f1">
                {isFrozen ? 'UNFREEZE BOARD' : 'FREEZE BOARD'}
              </span>
            </button>

            {/* Extend Time */}
            <button
              onClick={() => extendTime(10)}
              className="px-4 py-2 bg-[#18191E] border border-[#26262B] text-white font-condensed font-black text-xs uppercase italic tracking-wider rounded skew-f1 hover:bg-[#202126]"
            >
              <span className="unskew-f1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                +10 MINS
              </span>
            </button>
          </div>
        </div>

        {/* Transition Screen Quick-Triggers Bar (PRD Section 5) */}
        <div className="mb-6 bg-[#0E0E10] border border-[#202126] p-3 rounded flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#CE2F2C] font-bold">////</span>
            <span className="font-bold text-white uppercase tracking-wider font-mono">
              TRANSITION SCREEN TRIGGERS (PRD SEC 5):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerTransitionMoment('freeze_notice')}
              className="px-3 py-1 bg-[#1F2026] hover:bg-[#2A2B32] text-[#8F9CF8] rounded border border-[#2A2B32] font-mono text-[11px] font-bold"
            >
              ❄ Freeze Notice (4s)
            </button>
            <button
              onClick={() => triggerTransitionMoment('last_lap')}
              className="px-3 py-1 bg-[#1F2026] hover:bg-[#2A2B32] text-[#CE2F2C] rounded border border-[#2A2B32] font-mono text-[11px] font-bold"
            >
              ⚡ Last Lap (4s)
            </button>
            <button
              onClick={() => triggerTransitionMoment('red_flag_all')}
              className="px-3 py-1 bg-[#1F2026] hover:bg-[#2A2B32] text-red-400 rounded border border-[#2A2B32] font-mono text-[11px] font-bold"
            >
              🛑 Race Suspended
            </button>
            <button
              onClick={() => triggerTransitionMoment('resume')}
              className="px-3 py-1 bg-[#1F2026] hover:bg-[#2A2B32] text-green-400 rounded border border-[#2A2B32] font-mono text-[11px] font-bold"
            >
              🟢 3-Light Resume (5s)
            </button>
            <button
              onClick={() => triggerTransitionMoment('chequered_flag')}
              className="px-3 py-1 bg-[#1F2026] hover:bg-[#2A2B32] text-white rounded border border-[#2A2B32] font-mono text-[11px] font-bold"
            >
              🏁 Chequered Flag (6s)
            </button>
          </div>
        </div>

        {/* Live System Health Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#151518] border border-[#26262B] p-4 rounded">
            <div className="text-[10px] text-[#8A8A93] font-bold uppercase">TEAMS ACTIVE</div>
            <div className="font-condensed font-black text-3xl text-white italic">
              {teams.length} TEAMS
            </div>
          </div>
          <div className="bg-[#151518] border border-[#26262B] p-4 rounded">
            <div className="text-[10px] text-[#8A8A93] font-bold uppercase">FLAGGED / RED</div>
            <div className="font-condensed font-black text-3xl text-[#CE2F2C] italic">
              {flaggedTeamsCount} FLAGS
            </div>
          </div>
          <div className="bg-[#151518] border border-[#26262B] p-4 rounded">
            <div className="text-[10px] text-[#8A8A93] font-bold uppercase">JUDGE HEALTH</div>
            <div className="font-condensed font-black text-3xl text-[#2BB673] italic">
              100% HEALTHY
            </div>
          </div>
          <div className="bg-[#151518] border border-[#26262B] p-4 rounded">
            <div className="text-[10px] text-[#8A8A93] font-bold uppercase">JUDGE QUEUE</div>
            <div className="font-condensed font-black text-3xl text-white italic">
              0 PENDING
            </div>
          </div>
        </div>
      </div>
      {confirmAction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="w-full max-w-md rounded border border-[#3E4048] bg-[#151518] p-6 shadow-2xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#CE2F2C]">RACE CONTROL CONFIRMATION</div>
            <h2 id="confirm-title" className="mt-2 font-condensed text-3xl font-black italic uppercase text-white">{confirmActionLabel}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#8A8A93]">
              {confirmAction === 'red_flag'
                ? `This will pause the race for all ${teams.length} teams and stop active submissions.`
                : 'This will start the five-light launch sequence and move the contest into racing mode.'}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmAction(null)} className="min-h-11 rounded border border-[#26262B] px-4 text-xs font-bold uppercase text-[#8A8A93] hover:text-white">Cancel</button>
              <button type="button" onClick={executeConfirmedAction} className="min-h-11 rounded bg-[#CE2F2C] px-4 text-xs font-bold uppercase text-white hover:bg-[#E53935]">Confirm {confirmActionLabel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Segmented Tabs */}
      <div className="flex items-center gap-2 border-b border-[#202126] mb-6">
        {[
          { id: 'overview', label: 'Overview & Teams' },
          { id: 'submissions', label: 'Live Submissions Feed' },
          { id: 'violations', label: 'Anti-Cheat Violations' },
          { id: 'radio', label: 'Team Radio Broadcast' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-b-[#CE2F2C]'
                : 'text-[#8A8A93] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Teams */}
      {activeTab === 'overview' && (
        <div className="bg-[#121316] border border-[#202126] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0A0A0C] border-b border-[#202126] text-[#8A8A93] text-[10px] uppercase font-bold">
                <th className="p-3">TEAM ID</th>
                <th className="p-3">TEAM NAME</th>
                <th className="p-3 text-center">TABLE</th>
                <th className="p-3">ZONE</th>
                <th className="p-3 text-center">STRIKES</th>
                <th className="p-3">IP ADDRESS</th>
                <th className="p-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1D22]">
              {teams.map((t) => (
                <tr key={t.id} className="hover:bg-[#15161A]">
                  <td className="p-3 font-bold text-white">{t.id}</td>
                  <td className="p-3 font-sans font-bold text-white">{t.name}</td>
                  <td className="p-3 text-center text-[#8A8A93]">{t.tableNumber}</td>
                  <td className="p-3 text-[#8A8A93]">{t.zone}</td>
                  <td className="p-3 text-center font-bold text-[#CE2F2C]">{t.strikes}/3</td>
                  <td className="p-3 text-[#8A8A93]">{t.ipAddress}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'red'
                          ? 'bg-[#CE2F2C] text-white'
                          : t.status === 'yellow'
                          ? 'bg-[#F5C518] text-black'
                          : 'bg-[#2BB673]/20 text-[#2BB673]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Live Submissions Feed */}
      {activeTab === 'submissions' && (
        <div className="bg-[#121316] border border-[#202126] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0A0A0C] border-b border-[#202126] text-[#8A8A93] text-[10px] uppercase font-bold">
                <th className="p-3">TIME</th>
                <th className="p-3">TEAM</th>
                <th className="p-3">PROBLEM</th>
                <th className="p-3">LANG</th>
                <th className="p-3">VERDICT</th>
                <th className="p-3">RUNTIME</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1D22]">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-[#55565D] italic">
                    Submissions will stream here live as teams send code to the judge.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#15161A]">
                    <td className="p-3 text-[#8A8A93]">{sub.timestamp}</td>
                    <td className="p-3 font-bold text-white">{sub.teamName}</td>
                    <td className="p-3 text-[#8F9CF8] font-bold">{sub.problemCode}</td>
                    <td className="p-3 uppercase text-[#8A8A93]">{sub.language}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.verdict === 'ACCEPTED'
                            ? 'bg-[#2BB673]/20 text-[#2BB673]'
                            : 'bg-[#CE2F2C]/20 text-[#CE2F2C]'
                        }`}
                      >
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="p-3 text-[#8A8A93]">{sub.runtimeMs}ms</td>
                    <td className="p-3 text-right">
                      <button className="px-2 py-1 bg-[#1F2026] text-white text-[10px] uppercase rounded hover:bg-[#2A2B32]">
                        Rejudge
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Violations Log */}
      {activeTab === 'violations' && (
        <div className="bg-[#121316] border border-[#202126] rounded-sm p-4">
          <div className="text-xs font-bold text-[#8A8A93] uppercase tracking-wider mb-4">
            LIVE ANTI-CHEAT DOSSIER
          </div>
          {violations.length === 0 ? (
            <div className="text-center p-6 text-[#55565D] italic text-xs">
              Zero active strikes logged. All teams operating within parameters.
            </div>
          ) : (
            <div className="space-y-2">
              {violations.map((v) => (
                <div
                  key={v.id}
                  className="p-3 bg-[#0E0E10] border border-[#26262B] rounded flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-4 h-4 text-[#CE2F2C]" />
                    <div>
                      <span className="font-bold text-white">{v.teamName}</span>{' '}
                      <span className="text-[#8A8A93]">(Table {v.tableNumber})</span>
                      <div className="text-[11px] text-[#CE2F2C]">{v.type}: {v.note}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8A8A93]">{v.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Team Radio Broadcast */}
      {activeTab === 'radio' && (
        <div className="bg-[#151518] border border-[#26262B] p-6 rounded-sm max-w-xl">
          <div className="eyebrow-motif mb-2">
            <span className="slashes">////</span>
            <span>RADIO DISPATCH · BROADCAST SYSTEM</span>
          </div>
          <h3 className="font-condensed font-black text-2xl text-white italic uppercase mb-4">
            TRANSMIT TEAM RADIO MESSAGE
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <textarea
                value={radioInput}
                onChange={(e) => setRadioInput(e.target.value)}
                placeholder="Broadcast official notice or clarification to all student terminals..."
                className="w-full bg-[#0E0E10] border border-[#26262B] rounded p-3 text-xs text-white focus:outline-none focus:border-[#CE2F2C] resize-none h-24"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#8A8A93] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgentRadio}
                  onChange={(e) => setIsUrgentRadio(e.target.checked)}
                  className="rounded border-[#26262B] text-[#CE2F2C] focus:ring-0"
                />
                <span>Urgent Priority (Flashes Red Header)</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2 bg-[#CE2F2C] text-white font-condensed font-black text-xs uppercase italic tracking-wider rounded skew-f1 hover:bg-[#E53935]"
              >
                <span className="unskew-f1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  BROADCAST NOW
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
