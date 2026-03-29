"use client";

import { Heart, Activity, Flame, TrendingUp, ChevronRight, CheckCircle2, Circle } from "lucide-react";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const completedDays = [true, true, true, false, false, false, false];

const stats = [
  { label: "Sessions Done", value: "14", unit: "/ 36", icon: CheckCircle2, color: "text-success" },
  { label: "Week Streak", value: "3", unit: "wks", icon: Flame, color: "text-warning" },
  { label: "Avg Heart Rate", value: "94", unit: "bpm", icon: Heart, color: "text-primary" },
];

const todayChecklist = [
  { task: "15-min morning walk", done: true },
  { task: "Breathing exercise", done: true },
  { task: "Evening walk (20 min)", done: false },
  { task: "Log today's mood", done: false },
];

export default function HomeScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-primary rounded-b-3xl">
        <p className="text-primary-foreground/70 text-sm font-sans">Good morning,</p>
        <h1 className="text-primary-foreground text-2xl font-semibold font-sans text-balance mt-0.5">
          Maria
        </h1>
        <p className="text-primary-foreground/80 text-sm font-sans mt-1 leading-relaxed">
          Day 22 of your recovery. You&apos;re doing great — keep it up.
        </p>

        {/* Week progress dots */}
        <div className="flex gap-2 mt-5 mb-1">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-primary-foreground/60 text-xs font-sans">{day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-sans ${
                  completedDays[i]
                    ? "bg-primary-foreground text-primary"
                    : i === 3
                    ? "bg-primary-foreground/20 border-2 border-primary-foreground text-primary-foreground"
                    : "bg-primary-foreground/10 text-primary-foreground/40"
                }`}
              >
                {completedDays[i] ? "✓" : day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 flex gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 bg-card rounded-2xl p-3 flex flex-col gap-1 border border-border"
          >
            <s.icon size={16} className={s.color} />
            <p className="text-foreground font-semibold text-lg font-sans leading-none">
              {s.value}
              <span className="text-muted-foreground text-xs font-normal ml-0.5">{s.unit}</span>
            </p>
            <p className="text-muted-foreground text-xs font-sans leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's plan */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground text-base font-semibold font-sans">Today&apos;s Plan</h2>
          <button
            onClick={() => onNavigate("exercise")}
            className="flex items-center gap-0.5 text-primary text-sm font-sans"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {todayChecklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              {item.done ? (
                <CheckCircle2 size={20} className="text-success flex-shrink-0" />
              ) : (
                <Circle size={20} className="text-border flex-shrink-0" />
              )}
              <span
                className={`text-sm font-sans leading-relaxed ${
                  item.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Coach nudge */}
      <div className="px-5">
        <button
          onClick={() => onNavigate("chat")}
          className="w-full bg-accent rounded-2xl p-4 flex items-center gap-4 text-left"
        >
          <div className="w-10 h-10 rounded-full bg-accent-foreground/20 flex items-center justify-center flex-shrink-0">
            <Activity size={20} className="text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-accent-foreground font-semibold text-sm font-sans">
              Your AI Coach has a message
            </p>
            <p className="text-accent-foreground/80 text-xs font-sans mt-0.5 leading-relaxed">
              "You skipped yesterday — that&apos;s okay. Ready to talk about it?"
            </p>
          </div>
          <ChevronRight size={18} className="text-accent-foreground/60 flex-shrink-0" />
        </button>
      </div>

      {/* Progress card */}
      <div className="px-5">
        <h2 className="text-foreground text-base font-semibold font-sans mb-3">Your Progress</h2>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" />
              <span className="text-sm font-sans text-foreground font-medium">Program Completion</span>
            </div>
            <span className="text-sm font-semibold font-sans text-foreground">39%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: "39%" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground font-sans">14 sessions done</span>
            <span className="text-xs text-muted-foreground font-sans">22 remaining</span>
          </div>
        </div>
      </div>

      {/* Health vitals */}
      <div className="px-5">
        <h2 className="text-foreground text-base font-semibold font-sans mb-3">
          Today&apos;s Vitals
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Blood Pressure", value: "128/82", unit: "mmHg", note: "Slightly elevated", color: "text-warning" },
            { label: "Resting HR", value: "72", unit: "bpm", note: "Normal range", color: "text-success" },
            { label: "Steps Today", value: "4,210", unit: "steps", note: "Goal: 5,000", color: "text-accent" },
            { label: "Mood", value: "Okay", unit: "", note: "Tap to log", color: "text-primary" },
          ].map((v) => (
            <div key={v.label} className="bg-card rounded-2xl border border-border p-3">
              <p className="text-muted-foreground text-xs font-sans mb-1">{v.label}</p>
              <p className="text-foreground text-lg font-semibold font-sans leading-none">
                {v.value}
                {v.unit && (
                  <span className="text-muted-foreground text-xs font-normal ml-1">{v.unit}</span>
                )}
              </p>
              <p className={`text-xs font-sans mt-1 ${v.color}`}>{v.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
