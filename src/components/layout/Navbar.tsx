'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContest } from '@/context/ContestContext';
import { Search, Command, Menu, X, ArrowRight, Shield, Radio, Terminal, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { activeTeam, triggerWipeTransition } = useContest();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: ESC closes full-screen mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'HOME', href: '/', icon: Terminal, desc: 'Paddock Landing & Live Briefing' },
    { label: 'PROBLEMS', href: '/problemset', icon: Terminal, desc: 'Circuit Problemset & Telemetry' },
    { label: 'CONTESTS', href: '/race', icon: Radio, desc: 'Live Race Cockpit & Code Editor' },
    { label: 'STANDINGS', href: '/timing', icon: Trophy, desc: 'Timing Tower & Live Grid Ratings' },
  ];

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      triggerWipeTransition();
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      triggerWipeTransition();
      router.push(`/problemset?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-3 md:px-6 select-none transition-all duration-300 ${
          isScrolled
            ? 'h-13 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#26262B] shadow-[0_8px_30px_rgba(0,0,0,0.8)]'
            : 'h-14 bg-[#0A0A0C] border-b border-[#202126]'
        }`}
      >
        {/* Subtle dynamic red racing progress line when scrolled */}
        {isScrolled && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#CE2F2C] to-transparent opacity-80"
            aria-hidden="true"
          />
        )}

        {/* Left: Red Skewed Parallelogram Logo + Primary Navigation */}
        <div className="flex items-center gap-3 md:gap-8">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
            className="group flex items-center"
          >
            <div className="bg-[#CE2F2C] text-white px-3 py-1 sm:px-3.5 sm:py-1.5 skew-f1 font-condensed font-black text-base sm:text-lg tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(206,47,44,0.4)] group-hover:bg-[#E53935] group-hover:shadow-[0_0_22px_rgba(206,47,44,0.6)] transition-all">
              <span className="unskew-f1">CODEFORCES</span>
              <span className="unskew-f1 text-white/70 italic text-xs sm:text-sm">////</span>
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
                  className={`relative py-4 text-xs font-bold tracking-wider transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-[#8A8A93] hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CE2F2C] shadow-[0_0_10px_#CE2F2C]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center/Right: Global Search Bar + Auth CTAs + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Pill */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#55565D] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or run a command"
                className="w-48 lg:w-64 bg-[#141518] border border-[#26262B] text-xs text-white placeholder-[#55565D] rounded-sm pl-8 pr-14 py-1.5 focus:outline-none focus:border-[#CE2F2C] focus:ring-1 focus:ring-[#CE2F2C] transition-all"
              />
              <div className="absolute right-2 px-1.5 py-0.5 bg-[#1F2026] border border-[#2A2B32] rounded text-[9px] font-mono text-[#8A8A93] flex items-center gap-0.5 pointer-events-none">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </div>
          </form>

          {/* Auth CTAs */}
          {activeTeam ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('/race')}
                className="hidden sm:block px-3 py-1.5 bg-[#18191E] border border-[#26262B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#202126] transition-colors"
              >
                T-{activeTeam.tableNumber} · {activeTeam.name}
              </button>
              <button
                onClick={() => handleNavClick('/race')}
                className="bg-[#CE2F2C] text-white px-3.5 py-1.5 skew-f1 font-condensed font-black text-xs uppercase tracking-wider hover:bg-[#E53935] transition-all shadow-[0_0_12px_rgba(206,47,44,0.3)]"
              >
                <span className="unskew-f1">COCKPIT →</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleNavClick('/login')}
                className="px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider hover:text-white/80 transition-colors"
              >
                ENTER
              </button>
              <button
                onClick={() => handleNavClick('/login')}
                className="bg-[#CE2F2C] text-white px-3 sm:px-4 py-1.5 skew-f1 font-condensed font-black text-xs uppercase tracking-wider hover:bg-[#E53935] transition-all shadow-[0_0_12px_rgba(206,47,44,0.3)]"
              >
                <span className="unskew-f1">REGISTER</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden flex items-center justify-center h-8 w-8 rounded border border-[#26262B] bg-[#151518] text-[#8A8A93] hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 text-[#CE2F2C]" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* FULL-SCREEN / DRAWER NAVIGATION OVERLAY (Priority 5) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl md:hidden flex flex-col justify-between pt-16 pb-8 px-6"
          >
            {/* Connected Branching Circuit Lines (SVG Backdrop) */}
            <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="20" y1="80" x2="20" y2="400" stroke="#CE2F2C" strokeWidth="2" strokeDasharray="6 4" />
                <circle cx="20" cy="120" r="4" fill="#CE2F2C" />
                <line x1="20" y1="120" x2="60" y2="120" stroke="#CE2F2C" strokeWidth="2" />
                <circle cx="20" cy="180" r="4" fill="#CE2F2C" />
                <line x1="20" y1="180" x2="60" y2="180" stroke="#CE2F2C" strokeWidth="2" />
                <circle cx="20" cy="240" r="4" fill="#CE2F2C" />
                <line x1="20" y1="240" x2="60" y2="240" stroke="#CE2F2C" strokeWidth="2" />
                <circle cx="20" cy="300" r="4" fill="#CE2F2C" />
                <line x1="20" y1="300" x2="60" y2="300" stroke="#CE2F2C" strokeWidth="2" />
              </svg>
            </div>

            {/* Mobile Search */}
            <div className="relative z-10 mb-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-[#55565D] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search problem, ID, or command..."
                  className="w-full bg-[#151518] border border-[#26262B] text-sm text-white placeholder-[#55565D] rounded pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#CE2F2C]"
                />
              </form>
            </div>

            {/* Staggered Navigation Items */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
              }}
              className="relative z-10 flex flex-col space-y-3"
            >
              {navLinks.map((item, idx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center justify-between p-3.5 rounded border transition-all ${
                      isActive
                        ? 'border-[#CE2F2C] bg-[#CE2F2C]/10 text-white shadow-[0_0_15px_rgba(206,47,44,0.3)]'
                        : 'border-[#26262B] bg-[#121316] text-[#8A8A93] hover:text-white hover:border-[#3E404D]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1A1B20] text-[#CE2F2C]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-condensed text-lg font-black italic tracking-wide text-white uppercase">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-[#8A8A93]">{item.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#55565D]" />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Footer Telemetry in Mobile Menu */}
            <div className="relative z-10 border-t border-[#202126] pt-4 flex items-center justify-between text-xs text-[#8A8A93] font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2BB673] animate-pulse" />
                <span>PADDOCK NETWORK LIVE</span>
              </div>
              <span>v1.0.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
