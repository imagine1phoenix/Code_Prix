'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useContest } from '@/context/ContestContext';

export const F1SpeedWipe: React.FC = () => {
  const pathname = usePathname();
  const { isSpeedWiping, triggerWipeTransition } = useContest();
  const prevPathRef = useRef(pathname);

  // Trigger transition automatically on route change
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      triggerWipeTransition();
    }
  }, [pathname, triggerWipeTransition]);

  return (
    <AnimatePresence>
      {isSpeedWiping && (
        <motion.div
          key="f1-speed-wipe-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden"
        >
          {/* Main Angled F1 Wedge matching Screenshot 3 */}
          <motion.div
            initial={{ transform: 'translateX(102vw) skewX(-15deg)' }}
            animate={{ transform: 'translateX(-110vw) skewX(-15deg)' }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1], // Aggressive motorsport acceleration curve
            }}
            className="absolute -top-[30vh] h-[160vh] w-[80vw] bg-[#CE2F2C] shadow-[0_0_50px_rgba(206,47,44,0.6)] flex items-stretch"
          >
            {/* White Leading-Edge Shockwave Line (Exact from Screenshot 3) */}
            <div className="w-[18px] h-full bg-white shadow-[0_0_30px_#FFFFFF,0_0_15px_#FFFFFF] flex-shrink-0" />

            {/* Darker inner transition stripe */}
            <div className="w-10 h-full bg-[#9E1F1E]/50 flex-shrink-0" />

            {/* Carbon Racing Stripes texture inside the red wedge */}
            <div className="flex-1 h-full bg-racing-stripes-overlay opacity-30" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
