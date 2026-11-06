'use client';

import React, { useEffect, useRef } from 'react';

interface TelemetryNetworkCanvasProps {
  className?: string;
  nodeCount?: number;
  maxDistance?: number;
  interactive?: boolean;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isRed: boolean;
  pulsePhase: number;
}

export const TelemetryNetworkCanvas: React.FC<TelemetryNetworkCanvasProps> = ({
  className = '',
  nodeCount = 36,
  maxDistance = 130,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Accessibility check: respects prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates for subtle interactive attraction/repulsion
    const mouse = { x: -9999, y: -9999, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize nodes
    const count = window.innerWidth < 768 ? Math.floor(nodeCount / 2) : nodeCount;
    const nodes: NodePoint[] = [];

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1,
        isRed: Math.random() < 0.28, // ~28% racing red nodes
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Static render for users who prefer reduced motion
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      drawNetwork(nodes, ctx, width, height, maxDistance, 0);
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    // IntersectionObserver to pause loop when scrolled out of view (Optimization)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            render(0);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let lastTime = 0;

    const render = (time: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      const delta = Math.min(time - lastTime, 100);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx * (delta / 16);
        node.y += node.vy * (delta / 16);
        node.pulsePhase += 0.02;

        // Bounce at boundaries
        if (node.x < 0) {
          node.x = 0;
          node.vx *= -1;
        } else if (node.x > width) {
          node.x = width;
          node.vx *= -1;
        }

        if (node.y < 0) {
          node.y = 0;
          node.vy *= -1;
        } else if (node.y > height) {
          node.y = height;
          node.vy *= -1;
        }

        // Mouse proximity gentle deflection
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 0.5;
            node.x -= (dx / dist) * force;
            node.y -= (dy / dist) * force;
          }
        }
      }

      drawNetwork(nodes, ctx, width, height, maxDistance, time);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [nodeCount, maxDistance, interactive]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full opacity-60" />
    </div>
  );
};

// Helper: draw nodes, telemetry connecting lines, and subtle radar radial rings
function drawNetwork(
  nodes: NodePoint[],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  maxDistance: number,
  time: number
) {
  // 1. Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance) {
        const opacity = (1 - dist / maxDistance) * 0.35;
        const isEitherRed = a.isRed || b.isRed;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);

        if (isEitherRed && dist < maxDistance * 0.6) {
          ctx.strokeStyle = `rgba(206, 47, 44, ${opacity * 0.75})`;
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = `rgba(138, 138, 147, ${opacity * 0.45})`;
          ctx.lineWidth = 0.8;
        }

        ctx.stroke();
      }
    }
  }

  // 2. Draw nodes with subtle glow
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const pulse = 1 + Math.sin(node.pulsePhase) * 0.25;
    const currentRadius = node.radius * pulse;

    ctx.beginPath();
    ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);

    if (node.isRed) {
      ctx.fillStyle = '#CE2F2C';
      ctx.shadowColor = 'rgba(206, 47, 44, 0.6)';
      ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = 4;
    }

    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

