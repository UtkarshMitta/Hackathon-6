"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Clock, Activity } from "lucide-react";
import { MARIA, JOURNEY_STAGES } from "@/lib/data";

type StatusTier = "green" | "yellow" | "orange" | "red";

const STATUS_CONFIG: Record<StatusTier, { label: string; color: string; bg: string; dot: string }> = {
  green: {
    label: "On Track",
    color: "text-accent",
    bg: "bg-accent/10",
    dot: "bg-accent",
  },
  yellow: {
    label: "Monitor",
    color: "text-warning",
    bg: "bg-warning/10",
    dot: "bg-warning",
  },
  orange: {
    label: "Follow Up",
    color: "text-orange-500",
    bg: "bg-orange-50",
    dot: "bg-orange-500",
  },
  red: {
    label: "Urgent",
    color: "text-danger",
    bg: "bg-danger/10",
    dot: "bg-danger",
  },
};

const MOCK_ALERTS = [
  {
    id: "1",
    tier: "green" as StatusTier,
    timestamp: "2026-03-29T08:14:00Z",
    message: "Completed 15-min walk — personal best",
    patientMessage: "I did my walk today!",
  },
  {
    id: "2",
    tier: "yellow" as StatusTier,
    timestamp: "2026-03-27T19:45:00Z",
    message: "Reported fatigue, skipped stretching session",
    patientMessage: "Not feeling it today, just really tired",
  },
];

const MOOD_MAP: Record<string, { label: string; color: string }> = {
  tough: { label: "Tough", color: "text-danger" },
  okay: { label: "Okay", color: "text-warning" },
  good: { label: "Good", color: "text-accent" },
  great: { label: "Great", color: "text-accent" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function DashboardScreen() {
  const currentStage = JOURNEY_STAGES[MARIA.currentStage - 1];
  const patientStatus: StatusTier = "green";
  const statusCfg = STATUS_CONFIG[patientStatus];

  // Mood sparkline from history
  const moodToValue = (m: string) => {
    if (m === "great") return 4;
    if (m === "good") return 3;
    if (m === "okay") return 2;
    return 1;
  };

  const moodValues = MARIA.moodHistory.map((m) => moodToValue(m.mood));
  const maxMood = 4;
  const sparkH = 28;
  const sparkW = 80;
  const pts = moodValues
    .map((v, i) => {
      const x = (i / (moodValues.length - 1)) * sparkW;
      const y = sparkH - (v / maxMood) * sparkH;
      return `${x},${y}`;
    })
    .join(" ");

  const latestMood = MARIA.moodHistory.at(-1)?.mood ?? "good";
  const moodDisplay = MOOD_MAP[latestMood] ?? MOOD_MAP.good;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 bg-card border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Care Team Portal
          </p>
          <h1 className="text-xl font-bold text-navy mt-0.5">Patient Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dr. Patel &middot; Last updated: just now
          </p>
        </motion.div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Patient Card */}
        <motion.div
          className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {/* Status bar */}
          <div className={`px-5 py-2.5 flex items-center justify-between ${statusCfg.bg}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              <span className={`text-xs font-semibold ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Week {MARIA.week} &middot; {currentStage.name}
            </span>
          </div>

          <div className="px-5 pt-4 pb-5">
            {/* Patient name + condition */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-navy">{MARIA.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {MARIA.age}yo &middot; {MARIA.condition}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary leading-none">
                  {MARIA.sessionsCompleted}
                  <span className="text-sm font-normal text-muted-foreground">/{MARIA.totalSessions}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">sessions</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Streak */}
              <div className="bg-muted/50 rounded-xl px-3 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity size={13} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">Streak</span>
                </div>
                <p className="text-lg font-bold text-navy leading-none">
                  {MARIA.streakDays} days
                </p>
              </div>

              {/* Mood trend */}
              <div className="bg-muted/50 rounded-xl px-3 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-medium">Mood Trend</span>
                  <span className={`text-xs font-semibold ${moodDisplay.color}`}>
                    {moodDisplay.label}
                  </span>
                </div>
                <svg width={sparkW} height={sparkH} aria-hidden="true">
                  <polyline
                    points={pts}
                    fill="none"
                    stroke="#E8446D"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {moodValues.map((v, i) => {
                    const x = (i / (moodValues.length - 1)) * sparkW;
                    const y = sparkH - (v / maxMood) * sparkH;
                    return (
                      <circle key={i} cx={x} cy={y} r="2" fill="#E8446D" />
                    );
                  })}
                </svg>
              </div>

              {/* Resting HR */}
              <div className="bg-muted/50 rounded-xl px-3 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown size={13} className="text-accent" />
                  <span className="text-xs text-muted-foreground font-medium">Resting HR</span>
                </div>
                <p className="text-lg font-bold text-navy leading-none">
                  {MARIA.vitals.restingHR.current}{" "}
                  <span className="text-xs font-normal text-muted-foreground">bpm</span>
                </p>
                <p className="text-xs text-accent font-medium mt-0.5">
                  &darr;{MARIA.vitals.restingHR.baseline - MARIA.vitals.restingHR.current} from baseline
                </p>
              </div>

              {/* Avg steps */}
              <div className="bg-muted/50 rounded-xl px-3 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={13} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">Avg Steps</span>
                </div>
                <p className="text-lg font-bold text-navy leading-none">
                  {MARIA.vitals.avgDailySteps.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">per day</p>
              </div>
            </div>

            {/* BP */}
            <div className="mt-3 bg-muted/50 rounded-xl px-3 py-2.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Blood Pressure</span>
              <span className="text-sm font-bold text-navy">{MARIA.vitals.bloodPressure}</span>
            </div>
          </div>
        </motion.div>

        {/* Session history */}
        <motion.div
          className="bg-card rounded-2xl shadow-card px-5 py-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <h3 className="text-sm font-semibold text-navy mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {MARIA.recentSessions.slice().reverse().map((session, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-accent flex-shrink-0" fill="currentColor" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-foreground capitalize">
                    {session.type} &middot; {session.duration} min
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alert Queue */}
        <motion.div
          className="bg-card rounded-2xl shadow-card px-5 py-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-navy mb-3">Alert Queue</h3>
          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => {
              const cfg = STATUS_CONFIG[alert.tier];
              return (
                <div
                  key={alert.id}
                  className={`rounded-xl px-4 py-3 border ${
                    alert.tier === "red"
                      ? "border-danger/30 bg-danger/5"
                      : alert.tier === "orange"
                      ? "border-orange-200 bg-orange-50"
                      : alert.tier === "yellow"
                      ? "border-warning/30 bg-warning/5"
                      : "border-accent/20 bg-accent/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {alert.tier === "red" || alert.tier === "orange" ? (
                      <AlertTriangle size={14} className={cfg.color + " flex-shrink-0 mt-0.5"} />
                    ) : (
                      <CheckCircle2 size={14} className={cfg.color + " flex-shrink-0 mt-0.5"} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={10} />
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 italic truncate">
                        &ldquo;{alert.patientMessage}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Care team note */}
        <div className="text-center pb-2">
          <p className="text-xs text-muted-foreground">
            Data refreshes in real time &middot; HIPAA-compliant
          </p>
        </div>
      </div>
    </div>
  );
}
