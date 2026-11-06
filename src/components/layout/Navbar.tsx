'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import { Search, Command } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { activeTeam, triggerWipeTransition } = useContest();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'PROBLEMS', href: '/problemset' },
    { label: 'CONTESTS', href: '/race' },
    { label: 'STANDINGS', href: '/timing' },
  ];

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      triggerWipeTransition();
      router.push(href);
      setMobileMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      triggerWipeTransition();
      router.push(`/problemset?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-[#0A0A0C] border-b border-[#202126] flex items-center justify-between px-3 md:px-6 select-none">
      {/* Left: Red Skewed Parallelogram Logo + Primary Navigation */}
      <div className="flex items-center gap-4 md:gap-8">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('/');
          }}
          className="group flex items-center"
        >
          <div className="bg-[#CE2F2C] text-white px-3.5 py-1.5 skew-f1 font-condensed font-black text-lg tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(206,47,44,0.4)] group-hover:bg-[#E53935] transition-all">
            <span className="unskew-f1">CODEFORCES</span>
            <span className="unskew-f1 text-white/70 italic text-sm">////</span>
          </div>
        </Link>

        {/* Primary Navigation Tabs with active bottom-red indicator */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`relative py-4 text-xs font-bold tracking-wider transition-colors ${
                  isActive ? 'text-white' : 'text-[#8A8A93] hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CE2F2C] shadow-[0_0_8px_#CE2F2C]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center/Right: Global Search Bar + Auth CTAs (Matching Screenshot 1 & 2) */}
      <div className="flex items-center gap-3">
        {/* Global Search Pill: "Search or run a command CTRL K" */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#55565D] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or run a command"
              className="w-56 lg:w-64 bg-[#141518] border border-[#26262B] text-xs text-white placeholder-[#55565D] rounded-sm pl-8 pr-16 py-1.5 focus:outline-none focus:border-[#CE2F2C] transition-colors"
            />
            <div className="absolute right-2 px-1.5 py-0.5 bg-[#1F2026] border border-[#2A2B32] rounded text-[9px] font-mono text-[#8A8A93] flex items-center gap-0.5 pointer-events-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </form>

        {/* Auth CTAs matching Screenshot 1 & 2 */}
        {activeTeam ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick('/race')}
              className="px-4 py-1.5 bg-[#18191E] border border-[#26262B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#202126] transition-colors"
            >
              T-{activeTeam.tableNumber} · {activeTeam.name}
            </button>
            <button
              onClick={() => handleNavClick('/race')}
              className="bg-[#CE2F2C] text-white px-4 py-1.5 skew-f1 font-condensed font-black text-xs uppercase tracking-wider hover:bg-[#E53935] transition-all shadow-[0_0_12px_rgba(206,47,44,0.3)]"
            >
              <span className="unskew-f1">COCKPIT →</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick('/login')}
              className="px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider hover:text-white/80 transition-colors"
            >
              ENTER
            </button>
            <button
              onClick={() => handleNavClick('/login')}
              className="bg-[#CE2F2C] text-white px-4 py-1.5 skew-f1 font-condensed font-black text-xs uppercase tracking-wider hover:bg-[#E53935] transition-all shadow-[0_0_12px_rgba(206,47,44,0.3)]"
            >
              <span className="unskew-f1">REGISTER</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
