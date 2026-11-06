'use client';

import React from 'react';

interface TypingIndicatorProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'waveform' | 'telemetry';
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  label = 'TELEMETRY PROCESSING...',
  size = 'md',
  variant = 'dots',
  className = '',
}) => {
  const dotSize =
    size === 'sm' ? 'h-1 w-1' : size === 'lg' ? 'h-2 w-2' : 'h-1.5 w-1.5';
  const textSize =
    size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  if (variant === 'waveform') {
    return (
      <div
        className={`inline-flex items-center gap-2 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
          <span className="w-0.5 bg-[#CE2F2C] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
          <span className="w-0.5 bg-[#CE2F2C] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s] h-3.5" />
          <span className="w-0.5 bg-[#CE2F2C] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-1.5" />
          <span className="w-0.5 bg-[#CE2F2C] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-3" />
          <span className="w-0.5 bg-[#CE2F2C] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.25s] h-2" />
        </div>
        {label && (
          <span className={`font-mono ${textSize} font-bold tracking-wider text-[#8A8A93] uppercase`}>
            {label}
          </span>
        )}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* 3 Staggered Bouncing / Pulsing Motorsport Dots */}
      <div className="flex items-center gap-1" aria-hidden="true">
        <span
          className={`${dotSize} rounded-full bg-[#CE2F2C] animate-bounce [animation-duration:0.75s]`}
        />
        <span
          className={`${dotSize} rounded-full bg-[#CE2F2C] animate-bounce [animation-delay:0.15s] [animation-duration:0.75s]`}
        />
        <span
          className={`${dotSize} rounded-full bg-[#CE2F2C] animate-bounce [animation-delay:0.3s] [animation-duration:0.75s]`}
        />
      </div>

      {label && (
        <span
          className={`font-mono ${textSize} font-semibold tracking-wider text-[#8A8A93] uppercase`}
        >
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
};

