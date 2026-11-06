'use client';

import React, { useEffect, useState } from 'react';

export const EntryLoadingScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isLoading) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0C] px-6 text-center">
      <div className="absolute inset-0 bg-racing-stripes-overlay opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-[#CE2F2C]">
          <span>////</span>
          <span>INITIALIZING EVENT PLATFORM</span>
        </div>
        <div className="skew-f1 mx-auto mb-6 inline-block bg-[#CE2F2C] px-6 py-3 shadow-[0_0_30px_rgba(206,47,44,0.35)]">
          <span className="unskew-f1 block font-condensed text-4xl font-black italic tracking-wider text-white sm:text-5xl">
            CODE GRAND PRIX
          </span>
        </div>
        <div className="font-condensed text-xl font-black italic uppercase tracking-[0.25em] text-white">
          2026
        </div>
        <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-[#26262B]">
          <div className="h-full w-1/2 animate-[loading-bar_1.4s_ease-in-out_infinite] bg-[#CE2F2C]" />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#8A8A93]">
          Preparing team entry portal...
        </p>
      </div>
    </div>
  );
};
