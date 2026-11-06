'use client';

import React, { useState } from 'react';
import { useContest } from '@/context/ContestContext';
import { Team } from '@/types';
import {
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Wifi,
  PhoneCall,
  KeyRound,
  FileText,
  Flag,
} from 'lucide-react';

export default function MarshalDashboardPage() {
  const { teams, clearRedFlag, reportViolation } = useContest();
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [inspectTeam, setInspectTeam] = useState<Team | null>(null);
  const [marshalPin, setMarshalPin] = useState<string>('');
  const [clearReason, setClearReason] = useState<string>('Floor physical verification passed');
  const [message, setMessage] = useState<string>('');

  const filteredTeams = teams.filter((t) => {
    if (selectedZone !== 'ALL' && t.zone !== selectedZone) return false;
    if (
      search &&
      !t.name.toLowerCase().includes(search.toLowerCase()) &&
      !t.id.toLowerCase().includes(search.toLowerCase()) &&
      !t.tableNumber.toString().includes(search)
    ) {
      return false;
    }
    return true;
  });

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    if (marshalPin === '7788' || marshalPin === '9999' || marshalPin === '4242') {
      clearRedFlag(marshalPin, clearReason);
      setMessage(`Successfully cleared red flag for ${inspectTeam?.name}!`);
      setTimeout(() => {
        setMessage('');
        setInspectTeam(null);
        setMarshalPin('');
      }, 1200);
    } else {
      setMessage('Invalid Marshal PIN. Use 7788.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow-motif mb-1">
            <span className="slashes">////</span>
            <span>VOLUNTEER FLOOR OPERATIONS · MOBILE FIRST</span>
          </div>
          <h1 className="font-condensed font-black text-4xl text-white italic tracking-wide uppercase">
            MARSHAL COMMAND
          </h1>
        </div>

        {/* Zone Filter & Search */}
        <div className="flex items-center gap-2">
          {['ALL', 'Zone A', 'Zone B', 'Zone C'].map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors border ${
                selectedZone === zone
                  ? 'bg-[#CE2F2C] border-[#CE2F2C] text-white'
                  : 'bg-[#151518] border-[#26262B] text-[#8A8A93] hover:text-white'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by Team Name, ID, or Table Number..."
          className="w-full bg-[#151518] border border-[#26262B] rounded px-4 py-2 pl-10 text-xs text-white focus:outline-none focus:border-[#CE2F2C]"
        />
        <Search className="w-4 h-4 text-[#8A8A93] absolute left-3.5 top-2.5" />
      </div>

      {/* Team Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {filteredTeams.map((team) => {
          const isRed = team.status === 'red';
          const isYellow = team.status === 'yellow';

          return (
            <div
              key={team.id}
              onClick={() => setInspectTeam(team)}
              className={`p-4 rounded-sm border cursor-pointer transition-all flex flex-col justify-between ${
                isRed
                  ? 'bg-[#2A0505] border-[#CE2F2C] shadow-[0_0_15px_rgba(206,47,44,0.3)] animate-pulse'
                  : isYellow
                  ? 'bg-[#261E05] border-[#F5C518]'
                  : 'bg-[#151518] border-[#26262B] hover:border-[#3E4048]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-condensed font-black text-lg text-white italic tracking-wider">
                    TABLE {team.tableNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isRed
                        ? 'bg-[#CE2F2C] text-white'
                        : isYellow
                        ? 'bg-[#F5C518] text-black'
                        : team.status === 'racing'
                        ? 'bg-[#2BB673]/20 text-[#2BB673]'
                        : 'bg-[#26262B] text-[#8A8A93]'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <div className="font-bold text-sm text-white mb-1 truncate">{team.name}</div>
                <div className="text-[11px] text-[#8A8A93] mb-3">
                  {team.id} · {team.zone}
                </div>
              </div>

              <div className="border-t border-[#26262B] pt-2 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-[#8A8A93]">Strikes:</span>
                  <span className={team.strikes > 0 ? 'text-[#CE2F2C] font-bold' : 'text-white'}>
                    {team.strikes}/3
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#2BB673]">
                  <Wifi className="w-3 h-3" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Detail / Marshal Clearance Modal */}
      {inspectTeam && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151518] border border-[#26262B] p-6 rounded-sm max-w-lg w-full shadow-2xl relative border-t-4 border-t-[#CE2F2C]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-bold text-[#CE2F2C] uppercase tracking-wider">
                  TABLE {inspectTeam.tableNumber} · {inspectTeam.zone}
                </div>
                <h3 className="font-condensed font-black text-2xl text-white italic uppercase">
                  {inspectTeam.name} ({inspectTeam.id})
                </h3>
              </div>
              <button
                onClick={() => setInspectTeam(null)}
                className="text-[#8A8A93] hover:text-white text-xs font-bold"
              >
                CLOSE
              </button>
            </div>

            {/* Team Hardware Dossier */}
            <div className="bg-[#0E0E10] border border-[#26262B] p-3 rounded mb-4 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A8A93]">Network IP:</span>
                <span className="text-white">{inspectTeam.ipAddress} (Pinned)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A93]">Current Status:</span>
                <span className="text-[#CE2F2C] font-bold uppercase">{inspectTeam.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A93]">Recorded Strikes:</span>
                <span className="text-white font-bold">{inspectTeam.strikes} of 3</span>
              </div>
            </div>

            {/* Clear Red Flag Form */}
            {inspectTeam.status === 'red' && (
              <form onSubmit={handleClear} className="space-y-3 border-t border-[#26262B] pt-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#CE2F2C]" />
                  <span>AUTHORIZE WORKSPACE CLEARANCE</span>
                </div>

                <div>
                  <label className="text-[10px] text-[#8A8A93] uppercase block mb-1">
                    Clearance Reason
                  </label>
                  <select
                    value={clearReason}
                    onChange={(e) => setClearReason(e.target.value)}
                    className="w-full bg-[#0E0E10] border border-[#26262B] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CE2F2C]"
                  >
                    <option>Floor physical verification passed</option>
                    <option>Accidental touchpad gesture confirmed</option>
                    <option>Hardware glitch verified on desk</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#8A8A93] uppercase block mb-1">
                    Marshal Security PIN (7788)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={marshalPin}
                    onChange={(e) => setMarshalPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-[#0E0E10] border border-[#26262B] rounded px-3 py-1.5 text-center font-mono text-sm text-white focus:outline-none focus:border-[#CE2F2C]"
                  />
                </div>

                {message && (
                  <div className="text-[11px] font-bold text-center text-[#2BB673]">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#CE2F2C] text-white font-condensed font-black text-sm italic uppercase tracking-wider rounded skew-f1 hover:bg-[#E53935]"
                >
                  <span className="unskew-f1">CLEAR RED FLAG & RESTORE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

