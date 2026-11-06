'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useContest } from '@/context/ContestContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useContest();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (loginAdmin(username, password)) {
      router.replace('/control');
    } else {
      setError('Invalid admin username or password.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md border border-[#26262B] border-t-4 border-t-[#CE2F2C] bg-[#151518] p-8 shadow-2xl">
        <div className="eyebrow-motif mb-3">
          <span className="slashes">////</span>
          <span>RESTRICTED ACCESS</span>
        </div>
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded border border-[#CE2F2C]/40 bg-[#CE2F2C]/10 p-3">
            <ShieldCheck className="h-6 w-6 text-[#CE2F2C]" />
          </div>
          <div>
            <h1 className="font-condensed text-4xl font-black italic uppercase tracking-wide text-white">
              RACE CONTROL
            </h1>
            <p className="text-xs text-[#8A8A93]">Administrator sign-in required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 border border-[#CE2F2C]/40 bg-[#CE2F2C]/10 p-3 text-xs font-bold text-[#CE2F2C]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8A8A93]">
              Admin username
            </span>
            <div className="relative">
              <input
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="w-full rounded border border-[#26262B] bg-[#0E0E10] px-3 py-2 pr-10 text-sm text-white focus:border-[#CE2F2C] focus:outline-none"
              />
              <LockKeyhole className="absolute right-3 top-2.5 h-4 w-4 text-[#55565D]" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8A8A93]">
              Admin password
            </span>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded border border-[#26262B] bg-[#0E0E10] px-3 py-2 pr-10 text-sm text-white focus:border-[#CE2F2C] focus:outline-none"
              />
              <KeyRound className="absolute right-3 top-2.5 h-4 w-4 text-[#55565D]" />
            </div>
          </label>
          <button
            type="submit"
            className="w-full rounded bg-[#CE2F2C] px-4 py-3 font-condensed text-sm font-black uppercase italic tracking-wider text-white hover:bg-[#E53935]"
          >
            Enter race control
          </button>
        </form>
        <p className="mt-6 text-center text-[10px] uppercase tracking-wider text-[#55565D]">
          Demo: admin / 2026
        </p>
      </section>
    </main>
  );
}
