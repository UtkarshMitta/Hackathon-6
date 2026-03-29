"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MILESTONES } from "@/lib/data";

interface HeartVisualizationProps {
  stage: number;
  sessions: number;
  totalSessions?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const STAGE_CONFIGS = {
  1: {
    saturation: 0,
    primaryColor: "#BDBDBD",
    secondaryColor: "#9E9E9E",
    glowOpacity: 0.15,
    vesselOpacity: 0,
    petalOpacity: 0,
    particleOpacity: 0,
    pulseScale: [1, 1.04, 1],
    pulseSpeed: 1.8,
  },
  2: {
    saturation: 40,
    primaryColor: "#F48FB1",
    secondaryColor: "#E8446D",
    glowOpacity: 0.25,
    vesselOpacity: 0.3,
    petalOpacity: 0,
    particleOpacity: 0,
    pulseScale: [1, 1.05, 1],
    pulseSpeed: 1.6,
  },
  3: {
    saturation: 70,
    primaryColor: "#E8446D",
    secondaryColor: "#C2185B",
    glowOpacity: 0.4,
    vesselOpacity: 0.7,
    petalOpacity: 0.2,
    particleOpacity: 0,
    pulseScale: [1, 1.06, 0.98, 1],
    pulseSpeed: 1.4,
  },
  4: {
    saturation: 85,
    primaryColor: "#D81B60",
    secondaryColor: "#AD1457",
    glowOpacity: 0.55,
    vesselOpacity: 0.9,
    petalOpacity: 0.5,
    particleOpacity: 0.3,
    pulseScale: [1, 1.07, 0.97, 1.02, 1],
    pulseSpeed: 1.2,
  },
  5: {
    saturation: 95,
    primaryColor: "#C2185B",
    secondaryColor: "#880E4F",
    glowOpacity: 0.65,
    vesselOpacity: 1,
    petalOpacity: 0.75,
    particleOpacity: 0.6,
    pulseScale: [1, 1.08, 0.96, 1.03, 1],
    pulseSpeed: 1.1,
  },
  6: {
    saturation: 100,
    primaryColor: "#E8446D",
    secondaryColor: "#880E4F",
    glowOpacity: 0.8,
    vesselOpacity: 1,
    petalOpacity: 0.9,
    particleOpacity: 0.85,
    pulseScale: [1, 1.09, 0.95, 1.04, 0.99, 1],
    pulseSpeed: 1.0,
  },
  7: {
    saturation: 100,
    primaryColor: "#E8446D",
    secondaryColor: "#F06292",
    glowOpacity: 1,
    vesselOpacity: 1,
    petalOpacity: 1,
    particleOpacity: 1,
    pulseScale: [1, 1.1, 0.94, 1.05, 0.98, 1.01, 1],
    pulseSpeed: 0.9,
  },
};

const SIZES = {
  sm: { width: 140, height: 130 },
  md: { width: 220, height: 200 },
  lg: { width: 320, height: 290 },
};

export default function HeartVisualization({
  stage,
  sessions,
  totalSessions = 36,
  size = "md",
  showLabel = true,
}: HeartVisualizationProps) {
  const clampedStage = Math.max(1, Math.min(7, stage)) as keyof typeof STAGE_CONFIGS;
  const config = STAGE_CONFIGS[clampedStage];
  const milestone = MILESTONES.find((m) => m.stage === clampedStage);
  const { width, height } = SIZES[size];
  const progress = sessions / totalSessions;

  // Particle positions for stage 4+
  const particles = [
    { cx: 50, cy: 20, r: 2.5, delay: 0 },
    { cx: 80, cy: 15, r: 2, delay: 0.3 },
    { cx: 25, cy: 30, r: 2, delay: 0.6 },
    { cx: 90, cy: 35, r: 1.5, delay: 0.9 },
    { cx: 15, cy: 50, r: 1.5, delay: 1.2 },
    { cx: 65, cy: 10, r: 2, delay: 1.5 },
    { cx: 35, cy: 60, r: 1.5, delay: 0.2 },
    { cx: 75, cy: 55, r: 2, delay: 0.8 },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        key={`heart-stage-${clampedStage}`}
        initial={{ scale: 0.92, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
        style={{ width, height }}
      >
        {/* Outer glow */}
        <AnimatePresence>
          <motion.div
            key={`glow-${clampedStage}`}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(ellipse at center, ${config.primaryColor}${Math.round(config.glowOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
              transform: "scale(1.4)",
              filter: "blur(20px)",
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: config.pulseSpeed * 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Main heart SVG */}
        <motion.svg
          viewBox="0 0 100 90"
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          animate={{ scale: config.pulseScale }}
          transition={{
            duration: config.pulseSpeed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <defs>
            {/* Main gradient */}
            <radialGradient id={`heartGrad-${clampedStage}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={config.secondaryColor} stopOpacity="0.9" />
              <stop offset="60%" stopColor={config.primaryColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor={config.secondaryColor} stopOpacity="1" />
            </radialGradient>

            {/* Highlight gradient */}
            <radialGradient id={`highlight-${clampedStage}`} cx="35%" cy="30%" r="40%">
              <stop offset="0%" stopColor="white" stopOpacity={clampedStage >= 3 ? 0.4 : 0.15} />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Glow filter */}
            <filter id={`glow-${clampedStage}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={clampedStage >= 4 ? 3 : 1.5} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clip path for heart */}
            <clipPath id={`heartClip-${clampedStage}`}>
              <path d="M50 80 C50 80 8 55 8 28 C8 15 18 6 30 6 C38 6 45 11 50 17 C55 11 62 6 70 6 C82 6 92 15 92 28 C92 55 50 80 50 80Z" />
            </clipPath>
          </defs>

          {/* Background shadow */}
          <path
            d="M50 82 C50 82 6 56 6 28 C6 14 17 4 30 4 C38.5 4 45.5 9.5 50 16 C54.5 9.5 61.5 4 70 4 C83 4 94 14 94 28 C94 56 50 82 50 82Z"
            fill={config.primaryColor}
            opacity="0.2"
            transform="translate(1.5 3)"
            style={{ filter: "blur(6px)" }}
          />

          {/* Main heart body */}
          <motion.path
            d="M50 80 C50 80 8 55 8 28 C8 15 18 6 30 6 C38 6 45 11 50 17 C55 11 62 6 70 6 C82 6 92 15 92 28 C92 55 50 80 50 80Z"
            fill={`url(#heartGrad-${clampedStage})`}
            filter={`url(#glow-${clampedStage})`}
            animate={{ opacity: [0.92, 1, 0.92] }}
            transition={{ duration: config.pulseSpeed, repeat: Infinity }}
          />

          {/* Highlight overlay */}
          <path
            d="M50 80 C50 80 8 55 8 28 C8 15 18 6 30 6 C38 6 45 11 50 17 C55 11 62 6 70 6 C82 6 92 15 92 28 C92 55 50 50 50 80Z"
            fill={`url(#highlight-${clampedStage})`}
          />

          {/* Blood vessels — visible from stage 2+ */}
          <g opacity={config.vesselOpacity} clipPath={`url(#heartClip-${clampedStage})`}>
            <motion.path
              d="M50 40 Q38 32 28 38 Q20 44 24 54"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M50 40 Q62 30 72 36 Q80 44 76 56"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            />
            <motion.path
              d="M50 40 Q50 52 45 62 Q42 70 46 76"
              stroke="white"
              strokeWidth="1"
              fill="none"
              strokeOpacity="0.35"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
            />
            <motion.path
              d="M50 40 Q50 52 55 62 Q58 70 54 76"
              stroke="white"
              strokeWidth="1"
              fill="none"
              strokeOpacity="0.35"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
            />
          </g>

          {/* Floral petals — visible from stage 3+ */}
          <g opacity={config.petalOpacity} clipPath={`url(#heartClip-${clampedStage})`}>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.ellipse
                key={`petal-${i}`}
                cx={50 + 16 * Math.cos((angle * Math.PI) / 180)}
                cy={42 + 14 * Math.sin((angle * Math.PI) / 180)}
                rx="5"
                ry="3"
                fill="white"
                opacity="0.18"
                transform={`rotate(${angle}, ${50 + 16 * Math.cos((angle * Math.PI) / 180)}, ${42 + 14 * Math.sin((angle * Math.PI) / 180)})`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            ))}
          </g>

          {/* Floating particles for stage 4+ */}
          {particles.map((p, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={config.primaryColor}
              opacity={config.particleOpacity * 0.7}
              animate={{
                cy: [p.cy, p.cy - 8, p.cy],
                opacity: [config.particleOpacity * 0.7, config.particleOpacity, 0],
              }}
              transition={{
                duration: 2.5,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Stage 7 radiant rays */}
          {clampedStage === 7 && (
            <g opacity="0.6">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.line
                  key={`ray-${i}`}
                  x1={50 + 48 * Math.cos(((angle - 10) * Math.PI) / 180)}
                  y1={40 + 40 * Math.sin(((angle - 10) * Math.PI) / 180)}
                  x2={50 + 60 * Math.cos(((angle - 10) * Math.PI) / 180)}
                  y2={40 + 50 * Math.sin(((angle - 10) * Math.PI) / 180)}
                  stroke={config.primaryColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </g>
          )}
        </motion.svg>
      </motion.div>

      {/* Stage label and progress */}
      {showLabel && milestone && (
        <motion.div
          key={`label-${clampedStage}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-2 w-full max-w-xs"
        >
          <div className="text-center">
            <span
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: config.primaryColor }}
            >
              Stage {clampedStage}
            </span>
            <h3 className="text-xl font-serif font-semibold text-foreground leading-tight">
              {milestone.name}
            </h3>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{ background: `linear-gradient(90deg, ${config.primaryColor}88, ${config.primaryColor})` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-muted font-sans">
            {sessions} of {totalSessions} sessions complete
          </p>
        </motion.div>
      )}
    </div>
  );
}
