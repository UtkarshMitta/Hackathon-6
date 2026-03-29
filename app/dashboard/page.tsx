"use client";

import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Heart,
  ArrowLeft,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { MARIA, MOCK_ALERTS } from "@/lib/data";

type StatusTier = "green" | "yellow" | "orange" | "red";

const STATUS_CONFIG: Record<StatusTier, { label: string; bg: string; text: string; border: string }> = {
  green: {
    label: "On Track",
    bg: "#4CAF5018",
    text: "#4CAF50",
    border: "#4CAF5040",
  },
  yellow: {
    label: "Monitor",
    bg: "#F59E0B18",
    text: "#D97706",
    border: "#F59E0B40",
  },
  orange: {
    label: "Needs Attention",
    bg: "#F9730018",
    text: "#EA6B00",
    border: "#F9730040",
  },
  red: {
    label: "Urgent",
    bg: "var(--color-danger)18",
    text: "var(--color-danger)",
    border: "var(--color-danger)40",
  },
};

// Maria's current status — "yellow" because she missed some sessions
const MARIA_STATUS: StatusTier = "yellow";

// Mini mood sparkline data
const moodScores = MARIA.moodHistory.map((m) => {
  const scores: Record<string, number> = { bad: 1, okay: 2, good: 3, great: 4 };
  return scores[m.mood] ?? 2;
});
const moodMax = 4;
const sparkWidth = 80;
const sparkHeight = 28;

function MoodSparkline() {
  const points = moodScores.map((score, i) => {
    const x = (i / (moodScores.length - 1)) * sparkWidth;
    const y = sparkHeight - (score / moodMax) * sparkHeight;
    return `${x},${y}`;
  });

  return (
    <svg
      width={sparkWidth}
      height={sparkHeight}
      viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}
      aria-hidden="true"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {moodScores.map((score, i) => {
        const x = (i / (moodScores.length - 1)) * sparkWidth;
        const y = sparkHeight - (score / moodMax) * sparkHeight;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="var(--color-success)"
            opacity={i === moodScores.length - 1 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}

function AlertBadge({ tier }: { tier: StatusTier }) {
  const config = STATUS_CONFIG[tier];
  const Icon =
    tier === "red" || tier === "orange"
      ? AlertTriangle
      : tier === "yellow"
      ? Clock
      : CheckCircle2;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}` }}
    >
      <Icon size={11} />
      {config.label}
    </div>
  );
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const status = MARIA_STATUS;
  const statusConfig = STATUS_CONFIG[status];

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <header
        className="px-5 pt-12 pb-4 flex items-center gap-3"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          className="p-2 rounded-xl hover:opacity-70 transition-opacity"
          aria-label="Go back to home"
        >
          <ArrowLeft size={20} style={{ color: "var(--color-foreground)" }} />
        </Link>
        <div>
          <h1 className="text-xl font-serif font-semibold" style={{ color: "var(--color-foreground)" }}>
            Care Team Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Clinical overview — Dr. {MARIA.careTeam.name}
          </p>
        </div>
      </header>

      <div className="px-5 pt-5 max-w-lg mx-auto flex flex-col gap-5">
        {/* Patient card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-labelledby="patient-card-heading"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: `2px solid ${statusConfig.border}`,
              boxShadow: `0 4px 24px ${statusConfig.bg}`,
            }}
          >
            {/* Card header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: statusConfig.bg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: "var(--color-surface)" }}
                >
                  <User size={20} style={{ color: "var(--color-foreground)" }} />
                </div>
                <div>
                  <h2
                    id="patient-card-heading"
                    className="text-base font-semibold"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {MARIA.name}, {MARIA.age}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {MARIA.condition}
                  </p>
                </div>
              </div>
              <AlertBadge tier={status} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 divide-x divide-y" style={{ borderColor: "var(--color-border)" }}>
              {[
                {
                  label: "Sessions",
                  value: `${MARIA.sessionsCompleted}/${MARIA.totalSessions}`,
                  sub: `Week ${MARIA.week} of 12`,
                  icon: Calendar,
                  trend: null,
                },
                {
                  label: "Streak",
                  value: `${MARIA.streakDays} days`,
                  sub: "Active streak",
                  icon: Activity,
                  trend: "up" as const,
                },
                {
                  label: "Resting HR",
                  value: `${MARIA.vitals.restingHR.current} bpm`,
                  sub: `Baseline: ${MARIA.vitals.restingHR.baseline} bpm`,
                  icon: Heart,
                  trend: "down" as const,
                },
                {
                  label: "Blood Pressure",
                  value: MARIA.vitals.bloodPressure,
                  sub: "mmHg — stable",
                  icon: Activity,
                  trend: null,
                },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: "var(--color-muted)" }}>
                        {stat.label}
                      </p>
                      <p className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>
                        {stat.value}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                        {stat.sub}
                      </p>
                    </div>
                    {stat.trend === "down" && (
                      <TrendingDown
                        size={18}
                        style={{ color: "var(--color-success)" }}
                        aria-label="Trending down (good)"
                      />
                    )}
                    {stat.trend === "up" && (
                      <TrendingUp
                        size={18}
                        style={{ color: "var(--color-success)" }}
                        aria-label="Trending up (good)"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mood trend row */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-muted)" }}>
                  Mood Trend (7 days)
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--color-success)" }}>
                  Stable-Positive
                </p>
              </div>
              <MoodSparkline />
            </div>

            {/* Daily steps */}
            <div
              className="px-5 pb-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                  Avg. Daily Steps
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>
                  {MARIA.vitals.avgDailySteps.toLocaleString()}
                </p>
              </div>
              {/* Steps progress toward 10k goal */}
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "var(--color-border)" }}>
                <motion.div
                  className="h-2 rounded-full"
                  style={{ background: "var(--color-success)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (MARIA.vitals.avgDailySteps / 10000) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                {Math.round((MARIA.vitals.avgDailySteps / 10000) * 100)}% of 10,000 step goal
              </p>
            </div>
          </div>
        </motion.section>

        {/* Recent sessions */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-labelledby="sessions-heading"
        >
          <h2
            id="sessions-heading"
            className="text-base font-semibold mb-3"
            style={{ color: "var(--color-foreground)" }}
          >
            Recent Sessions
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)" }}
          >
            {MARIA.recentSessions.slice().reverse().map((session, idx) => (
              <div
                key={`${session.date}-${idx}`}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  borderBottom: idx < MARIA.recentSessions.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize" style={{ color: "var(--color-foreground)" }}>
                    {session.type} — {session.duration} min
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--color-success)18", color: "var(--color-success)" }}
                >
                  Completed
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Alert queue */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          aria-labelledby="alerts-heading"
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              id="alerts-heading"
              className="text-base font-semibold"
              style={{ color: "var(--color-foreground)" }}
            >
              Alert Queue
            </h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "var(--color-danger)18",
                color: "var(--color-danger)",
              }}
            >
              {MOCK_ALERTS.filter((a) => !a.resolved).length} active
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_ALERTS.map((alert) => {
              const config = STATUS_CONFIG[alert.tier];
              const Icon = alert.tier === "red" || alert.tier === "orange"
                ? AlertTriangle
                : alert.tier === "yellow"
                ? Clock
                : CheckCircle2;

              return (
                <div
                  key={alert.id}
                  className="rounded-2xl px-4 py-4"
                  style={{
                    background: alert.resolved ? "var(--color-background)" : config.bg,
                    border: `1.5px solid ${alert.resolved ? "var(--color-border)" : config.border}`,
                    opacity: alert.resolved ? 0.65 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      size={18}
                      style={{ color: config.text }}
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <AlertBadge tier={alert.tier} />
                        {alert.resolved && (
                          <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-snug" style={{ color: "var(--color-foreground)" }}>
                        {alert.message}
                      </p>
                      <p className="text-xs mt-1.5" style={{ color: "var(--color-muted)" }}>
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* AI-generated summary */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pb-4"
          aria-labelledby="ai-summary-heading"
        >
          <h2
            id="ai-summary-heading"
            className="text-base font-semibold mb-3"
            style={{ color: "var(--color-foreground)" }}
          >
            Weekly AI Summary
          </h2>
          <div
            className="rounded-2xl px-5 py-5"
            style={{
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} style={{ color: "var(--color-primary)" }} fill="currentColor" />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
                Compass Summary — Week {MARIA.week}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-foreground)" }}>
              Maria completed 5 of 5 scheduled sessions this week, with a personal best 15-minute walk on March 28. Her resting HR has declined 6 bpm from baseline — a strong indicator of cardiovascular adaptation. Mood trend is stable-positive with one &quot;okay&quot; day mid-week. No safety flags triggered. Recommend continuing current exercise plan and acknowledging the streak milestone at next check-in.
            </p>
            <p className="text-xs mt-3 font-medium" style={{ color: "var(--color-muted)" }}>
              Auto-generated by Compass &bull; March 29, 2026
            </p>
          </div>
        </motion.section>
      </div>

      <BottomNav />
    </main>
  );
}
