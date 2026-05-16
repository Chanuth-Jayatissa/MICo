"use client";

import { useEffect, useRef, useState } from "react";

interface MatchRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export default function MatchRing({
  score,
  size = 80,
  strokeWidth = 6,
  className = "",
  showLabel = true,
  animated = true,
}: MatchRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!animated || !mounted) return;

    let start: number | null = null;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, animated, mounted]);

  // Color based on score
  const getColor = () => {
    if (score >= 85) return { ring: "#D4AF37", bg: "rgba(212,175,55,0.1)" };
    if (score >= 60) return { ring: "#00B894", bg: "rgba(0,184,148,0.1)" };
    return { ring: "#636E72", bg: "rgba(99,110,114,0.1)" };
  };

  const colors = getColor();

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        ref={ref}
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-100 ease-out"
          style={{
            filter: score >= 85 ? `drop-shadow(0 0 6px ${colors.ring}40)` : "none",
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-lg font-bold leading-none"
            style={{ color: colors.ring }}
          >
            {displayScore}%
          </span>
        </div>
      )}
    </div>
  );
}
