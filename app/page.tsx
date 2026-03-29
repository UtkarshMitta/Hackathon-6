"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  Circle,
  Activity,
  MessageCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import HeartVisualization from "@/components/HeartVisualization";
import { MARIA, MILESTONES } from "@/lib/data";

const todaysPlan = [
  { id: 1, task: "12-min walk (moderate)", completed: true, icon: Activity },
  { id: 2, task: "Evening stretches (5 min)", completed: false, icon: Activity },
  { id: 3, task: "Mood check-in", completed: false, icon: MessageCircle },
];

const currentMilestone = MILESTONES.find((m) => m.stage === MARIA.currentStage);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDayOfJourney() {
  // Using mock data — Day 18
  return 18;
}

export default function HomePage() {
  const greeting = getGreeting();
  const dayOfJourney = getDayOfJourney();
  const completedTasks = todaysPlan.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <header className="px-5 pt-12 pb-4 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                {greeting}
              </p>
              <h1
                className="text-3xl font-serif font-semibold text-balance leading-tight"
                style={{ color: "var(--color-foreground)" }}
              >
                {MARIA.name} <span style={{ color: "var(--color-primary)" }}>&#9829;</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Day {dayOfJourney} of your healing journey
              </p>
            </div>

            {/* Streak badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center px-4 py-2 rounded-2xl"
              style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)" }}
            >
              <div className="flex items-center gap-1">
                <Flame size={18} style={{ color: "var(--color-primary)" }} />
                <span
                  className="text-2xl font-bold font-sans"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {MARIA.streakDays}
                </span>
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                day streak
              </span>
            </motion.div>
          </div>
        </motion.div>
      </header>

      <div className="px-5 max-w-lg mx-auto flex flex-col gap-5">
        {/* Heart Visualization Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl p-6 flex flex-col items-center"
          style={{
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            boxShadow: "0 4px 24px rgba(232,68,109,0.08)",
          }}
        >
          <HeartVisualization
            stage={MARIA.currentStage}
            sessions={MARIA.sessionsCompleted}
            totalSessions={MARIA.totalSessions}
            size="md"
            showLabel={true}
          />

          <Link
            href="/journey"
            className="mt-4 flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            View full journey
            <ChevronRight size={14} />
          </Link>
        </motion.div>

        {/* Next check-in banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, var(--color-primary)18 0%, var(--color-primary)08 100%)",
            border: "1.5px solid var(--color-primary-light)",
          }}
        >
          <Clock size={18} style={{ color: "var(--color-primary)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Next check-in with Compass
            </p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              Tomorrow at 9:00 AM
            </p>
          </div>
        </motion.div>

        {/* Today's Plan */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          aria-labelledby="todays-plan-heading"
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              id="todays-plan-heading"
              className="text-base font-semibold"
              style={{ color: "var(--color-foreground)" }}
            >
              {"Today's Plan"}
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: completedTasks === todaysPlan.length
                  ? "var(--color-success)22"
                  : "var(--color-primary)18",
                color: completedTasks === todaysPlan.length
                  ? "var(--color-success)"
                  : "var(--color-primary)",
              }}
            >
              {completedTasks}/{todaysPlan.length} done
            </span>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid var(--color-border)", background: "var(--color-surface)" }}
          >
            {todaysPlan.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  borderBottom: idx < todaysPlan.length - 1 ? "1px solid var(--color-border)" : "none",
                  opacity: item.completed ? 0.7 : 1,
                }}
              >
                {item.completed ? (
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)" }} aria-hidden="true" />
                ) : (
                  <Circle size={20} style={{ color: "var(--color-border)" }} aria-hidden="true" />
                )}
                <span
                  className="text-base flex-1"
                  style={{
                    color: "var(--color-foreground)",
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Vitals snapshot */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          aria-labelledby="vitals-heading"
        >
          <h2
            id="vitals-heading"
            className="text-base font-semibold mb-3"
            style={{ color: "var(--color-foreground)" }}
          >
            Your progress this week
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Resting HR",
                value: `${MARIA.vitals.restingHR.current}`,
                unit: "bpm",
                delta: `-${MARIA.vitals.restingHR.baseline - MARIA.vitals.restingHR.current}`,
                positive: true,
              },
              {
                label: "Daily Steps",
                value: MARIA.vitals.avgDailySteps.toLocaleString(),
                unit: "avg",
                delta: "+12%",
                positive: true,
              },
              {
                label: "Sessions",
                value: `${MARIA.sessionsCompleted}`,
                unit: `of ${MARIA.totalSessions}`,
                delta: "Week 3",
                positive: true,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3 flex flex-col gap-1"
                style={{
                  background: "var(--color-surface)",
                  border: "1.5px solid var(--color-border)",
                }}
              >
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
                    {stat.value}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {stat.unit}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: stat.positive ? "var(--color-success)" : "var(--color-danger)" }}
                >
                  {stat.delta}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="grid grid-cols-2 gap-3 pb-4"
        >
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-opacity hover:opacity-90 active:scale-95"
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
          >
            <MessageCircle size={20} aria-hidden="true" />
            Chat with Compass
          </Link>

          <button
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-opacity hover:opacity-90 active:scale-95"
            style={{
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-foreground)",
            }}
            aria-label="Log activity"
          >
            <Activity size={20} aria-hidden="true" />
            Log Activity
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </main>
  );
}
