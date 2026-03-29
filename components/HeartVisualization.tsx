"use client";

import { motion, AnimatePresence } from "framer-motion";
import { JOURNEY_STAGES } from "@/lib/data";

interface HeartVisualizationProps {
  stage: number; // 1–7
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
}

// Stage color configs
const STAGE_CONFIGS = [
  {
    // Stage 1 — grayscale with single warm pulse
    fill: ["#d1d5db", "#9ca3af", "#6b7280"],
    vessels: false,
    vesselOpacity: 0,
    glowColor: "rgba(156,163,175,0.25)",
    particles: false,
    saturation: 0,
  },
  {
    // Stage 2 — warm glow begins
    fill: ["#fecdd3", "#fda4af", "#fb7185"],
    vessels: false,
    vesselOpacity: 0.2,
    glowColor: "rgba(251,113,133,0.3)",
    particles: false,
    saturation: 0.4,
  },
  {
    // Stage 3 — vessels appearing, color spreading
    fill: ["#fca5a5", "#f87171", "#ef4444"],
    vessels: true,
    vesselOpacity: 0.45,
    glowColor: "rgba(248,113,113,0.35)",
    particles: false,
    saturation: 0.65,
  },
  {
    // Stage 4 — steady rhythm, colors deepen
    fill: ["#f87171", "#e8446d", "#be123c"],
    vessels: true,
    vesselOpacity: 0.65,
    glowColor: "rgba(232,68,109,0.4)",
    particles: false,
    saturation: 0.8,
  },
  {
    // Stage 5 — vibrant, details emerge
    fill: ["#e8446d", "#db2777", "#9d174d"],
    vessels: true,
    vesselOpacity: 0.8,
    glowColor: "rgba(232,68,109,0.5)",
    particles: true,
    saturation: 1,
  },
  {
    // Stage 6 — fully colored, glowing
    fill: ["#e8446d", "#dc2626", "#991b1b"],
    vessels: true,
    vesselOpacity: 0.9,
    glowColor: "rgba(232,68,109,0.6)",
    particles: true,
    saturation: 1,
  },
  {
    // Stage 7 — radiant, transformed
    fill: ["#e8446d", "#dc2626", "#7f1d1d"],
    vessels: true,
    vesselOpacity: 1,
    glowColor: "rgba(232,68,109,0.75)",
    particles: true,
    saturation: 1,
  },
];

const SIZE_MAP = {
  sm: 140,
  md: 200,
  lg: 280,
};

export default function HeartVisualization({
  stage,
  size = "md",
  showGlow = true,
}: HeartVisualizationProps) {
  const idx = Math.max(0, Math.min(stage - 1, 6));
  const cfg = STAGE_CONFIGS[idx];
  const px = SIZE_MAP[size];
  const stageInfo = JOURNEY_STAGES[idx];

  const pulseScale = stage >= 4 ? [1, 1.06, 1, 1.04, 1] : [1, 1.04, 1];
  const pulseDuration = stage >= 6 ? 1.8 : stage >= 4 ? 2.1 : 2.6;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
    >
      {/* Outer glow ring */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${cfg.glowColor} 0%, transparent 70%)`,
          }}
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Stage 7 extra particle ring */}
      {stage === 7 && (
        <>
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: cfg.fill[0],
                top: "50%",
                left: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                x: [
                  Math.cos((deg * Math.PI) / 180) * (px * 0.38),
                  Math.cos((deg * Math.PI) / 180) * (px * 0.48),
                  Math.cos((deg * Math.PI) / 180) * (px * 0.38),
                ],
                y: [
                  Math.sin((deg * Math.PI) / 180) * (px * 0.38),
                  Math.sin((deg * Math.PI) / 180) * (px * 0.48),
                  Math.sin((deg * Math.PI) / 180) * (px * 0.38),
                ],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* The SVG heart */}
      <AnimatePresence mode="wait">
        <motion.svg
          key={stage}
          viewBox="0 0 100 100"
          width={px * 0.82}
          height={px * 0.82}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{
            scale: pulseScale,
            opacity: 1,
          }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: {
              duration: pulseDuration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          aria-label={`Heart visualization — Stage ${stage}: ${stageInfo.name}`}
          role="img"
        >
          <defs>
            <radialGradient id={`hg-${stage}`} cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor={cfg.fill[0]} stopOpacity="1" />
              <stop offset="55%" stopColor={cfg.fill[1]} stopOpacity="1" />
              <stop offset="100%" stopColor={cfg.fill[2]} stopOpacity="1" />
            </radialGradient>

            <radialGradient id={`hg-shine-${stage}`} cx="38%" cy="32%" r="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>

            <filter id={`blur-${stage}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={stage >= 5 ? "1.2" : "0.8"} />
            </filter>
          </defs>

          {/* Drop shadow layer */}
          <path
            d="M50 85 C30 65, 5 55, 5 35 C5 20, 17 10, 30 10 C38 10, 45 15, 50 22 C55 15, 62 10, 70 10 C83 10, 95 20, 95 35 C95 55, 70 65, 50 85Z"
            fill={cfg.fill[2]}
            opacity={0.3}
            filter={`url(#blur-${stage})`}
            transform="translate(0, 4)"
          />

          {/* Main heart body */}
          <path
            d="M50 85 C30 65, 5 55, 5 35 C5 20, 17 10, 30 10 C38 10, 45 15, 50 22 C55 15, 62 10, 70 10 C83 10, 95 20, 95 35 C95 55, 70 65, 50 85Z"
            fill={`url(#hg-${stage})`}
          />

          {/* Specular shine */}
          <path
            d="M50 85 C30 65, 5 55, 5 35 C5 20, 17 10, 30 10 C38 10, 45 15, 50 22 C55 15, 62 10, 70 10 C83 10, 95 20, 95 35 C95 55, 70 65, 50 85Z"
            fill={`url(#hg-shine-${stage})`}
          />

          {/* Vessel lines — appear from stage 3 */}
          {cfg.vessels && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: cfg.vesselOpacity }}
              transition={{ duration: 1.2 }}
            >
              {/* Main aortic arch */}
              <path
                d="M50 22 C50 28, 42 30, 38 38 C35 44, 36 52, 40 58"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right branch */}
              <path
                d="M50 22 C50 28, 58 30, 62 38 C65 44, 64 52, 60 58"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.1"
                fill="none"
                strokeLinecap="round"
              />
              {/* Left coronary */}
              <path
                d="M38 38 C34 44, 26 46, 22 54"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.9"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right coronary */}
              <path
                d="M62 38 C66 44, 74 46, 78 54"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.9"
                fill="none"
                strokeLinecap="round"
              />
              {/* Lower convergence */}
              <path
                d="M40 58 C44 64, 50 70, 50 75 M60 58 C56 64, 50 70, 50 75"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>
          )}

          {/* Stage 7 — radiating lines */}
          {stage === 7 && (
            <motion.g
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const x1 = 50 + Math.cos(rad) * 38;
                const y1 = 47 + Math.sin(rad) * 38;
                const x2 = 50 + Math.cos(rad) * 48;
                const y2 = 47 + Math.sin(rad) * 48;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={cfg.fill[0]}
                    strokeWidth="0.8"
                    strokeOpacity="0.7"
                    strokeLinecap="round"
                  />
                );
              })}
            </motion.g>
          )}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}
