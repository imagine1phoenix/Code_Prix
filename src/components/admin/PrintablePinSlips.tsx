'use client';

import React from 'react';
import { Team } from '@/types';
import { Printer, X } from 'lucide-react';

interface PrintablePinSlipsProps {
  teams: Team[];
  onClose: () => void;
}

export const PrintablePinSlips: React.FC<PrintablePinSlipsProps> = ({ teams, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-8 overflow-y-auto">
      {/* Control Bar - Hidden during printing */}
      <div className="print:hidden flex items-center justify-between mb-6 bg-[#151518] p-4 rounded border border-[#26262B] max-w-5xl mx-auto w-full">
        <div>
          <div className="eyebrow-motif">
            <span className="slashes">////</span>
            <span>REGISTRATION DESK · OFFICIAL CHECK-IN SLIPS</span>
          </div>
          <h2 className="font-condensed font-black text-2xl text-white italic uppercase">
            PRINT TEAM CREDENTIAL SLIPS ({teams.length} TEAMS)
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-[#CE2F2C] text-white font-condensed font-black text-sm uppercase italic tracking-wider rounded skew-f1 hover:bg-[#E53935] flex items-center gap-2 shadow-[0_0_15px_rgba(206,47,44,0.4)]"
          >
            <span className="unskew-f1 flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              PRINT ALL SLIPS
            </span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-[#8A8A93] hover:text-white rounded bg-[#202126]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full print:grid-cols-2 print:gap-4 print:w-full print:max-w-none">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white text-black p-6 rounded-lg border-2 border-black print:border-2 print:p-4 print:break-inside-avoid shadow-lg relative flex flex-col justify-between"
          >
            {/* Header */}
            <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-red-600">
                  CODE GRAND PRIX 2026
                </div>
                <div className="font-black text-2xl uppercase tracking-tight">
                  {team.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase text-gray-600">ASSIGNED TABLE</div>
                <div className="font-black text-3xl text-red-600">
                  #{team.tableNumber}
                </div>
              </div>
            </div>

            {/* Credentials Row */}
            <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded border border-gray-300 mb-4 font-mono">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">TEAM ID</span>
                <span className="font-black text-xl text-black">{team.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">SECURITY PIN</span>
                <span className="font-black text-2xl text-red-600 tracking-widest">{team.pin}</span>
              </div>
            </div>

            {/* Members & Zone */}
            <div className="text-xs space-y-1 mb-4 text-gray-800">
              <div className="flex justify-between">
                <span className="font-bold">SECTOR ZONE:</span>
                <span>{team.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">REGISTERED DRIVERS:</span>
                <span className="italic">
                  {team.members.map((m) => m.name).join(', ') || '3 Students'}
                </span>
              </div>
            </div>

            {/* Rules reminder footer */}
            <div className="border-t border-gray-300 pt-2 text-[9px] text-gray-500 leading-tight">
              * Strictly 1 laptop per team on the desk. All mobile phones must be placed inside the Parc Fermé bag.
              Use Chrome/Edge in fullscreen at http://cgp.local.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
