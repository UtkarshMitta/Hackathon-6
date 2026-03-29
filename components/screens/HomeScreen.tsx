"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, CheckCircle2, Circle, ArrowRight, Heart } from "lucide-react";
import HeartVisualization from "@/components/HeartVisualization";
import { MARIA, JOURNEY_STAGES, getCurrentStage } from "@/lib/data";

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const stage = getCurrentStage(MARIA.sessionsCompleted);
  const stageInfo = JOURNEY_STAGES[stage.id - 1];
  const progress = MARIA.sessionsCompleted / MARIA.totalSessions;
  const dayOfJourney = MARIA.week * 7 - 3; // ~Day 18

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const todayPlan = [...MARIA.todayPlan];

  const toggle = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Day {dayOfJourney} of your journey
        </motion.p>
        <motion.h1
          className="text-2xl font-bold text-navy mt-0.5 text-balance"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {greeting()}, {MARIA.name}
        </motion.h1>
      </div>

      {/* Heart Card */}
      <motion.div
        className="mx-5 mt-4 rounded-2xl bg-card shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Heart visualization */}
        <div className="flex flex-col items-center pt-6 pb-4 bg-gradient-to-b from-[#fff1f2] to-card">
          <HeartVisualization stage={stage.id} size="lg" showGlow />

          {/* Stage label */}
          <div className="mt-3 text-center px-4">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              <Heart size={11} fill="currentColor" />
              Stage {stage.id}: {stage.name}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-5 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Session progress</span>
            <span className="text-xs font-bold text-primary">
              {MARIA.sessionsCompleted}/{MARIA.totalSessions}
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center italic">
            &ldquo;{stageInfo.tagline.replace(/&apos;/g, "'")}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Streak + stats row */}
      <motion.div
        className="mx-5 mt-3 flex gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Streak */}
        <div className="flex-1 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
            <Flame size={20} className="text-orange-500" fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-bold text-navy leading-none">{MARIA.streakDays}</p>
            <p className="text-xs text-muted-foreground mt-0.5">day streak</p>
          </div>
        </div>

        {/* Resting HR */}
        <div className="flex-1 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Heart size={18} className="text-primary" fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-bold text-navy leading-none">
              {MARIA.vitals.restingHR.current}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              bpm{" "}
              <span className="text-accent font-medium">
                &darr;{MARIA.vitals.restingHR.baseline - MARIA.vitals.restingHR.current}
              </span>
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M13 4C13 5.1 12.1 6 11 6S9 5.1 9 4 9.9 2 11 2 13 2.9 13 4ZM7.5 21.5L9 14l2 2 1-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21.5l-1.5-7.5-2 2-1-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-navy leading-none">
              {(MARIA.vitals.avgDailySteps / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">avg steps</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Plan */}
      <motion.div
        className="mx-5 mt-3 bg-card rounded-2xl shadow-card px-5 py-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h2 className="text-sm font-semibold text-navy mb-3">Today&apos;s Plan</h2>
        <ul className="space-y-3">
          {todayPlan.map((item) => {
            const done = checkedItems[item.id] ?? false;
            return (
              <li key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-3 text-left group"
                  aria-pressed={done}
                >
                  <motion.div
                    animate={{ scale: done ? [1.25, 1] : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {done ? (
                      <CheckCircle2 size={22} className="text-accent flex-shrink-0" fill="currentColor" />
                    ) : (
                      <Circle size={22} className="text-border flex-shrink-0" />
                    )}
                  </motion.div>
                  <span
                    className={`text-sm leading-relaxed transition-colors ${
                      done ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="mx-5 mt-3 flex gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <button
          onClick={() => onNavigate("chat")}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-2xl shadow-card active:scale-95 transition-transform"
        >
          <Heart size={16} fill="currentColor" />
          Chat with Compass
        </button>
        <button
          onClick={() => onNavigate("journey")}
          className="flex-1 flex items-center justify-center gap-2 bg-card border border-border text-foreground font-semibold text-sm py-3.5 rounded-2xl shadow-card active:scale-95 transition-transform"
        >
          My Journey
          <ArrowRight size={15} />
        </button>
      </motion.div>

      {/* Next check-in nudge */}
      <motion.div
        className="mx-5 mt-3 mb-2 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <div className="w-2 h-2 rounded-full bg-primary glow-pulse flex-shrink-0" />
        <p className="text-xs text-foreground leading-relaxed">
          Next Compass check-in:{" "}
          <span className="font-semibold">Tomorrow, 9:00 AM</span>
        </p>
      </motion.div>
    </div>
  );
}
