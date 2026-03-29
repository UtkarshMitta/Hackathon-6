"use client";

import { useState } from "react";
import { Play, CheckCircle2, Clock, Footprints, Dumbbell, Wind, ChevronDown, ChevronUp } from "lucide-react";

type Exercise = {
  id: number;
  name: string;
  duration: string;
  type: "walk" | "strength" | "breathe";
  instructions: string;
  done: boolean;
};

const iconMap = {
  walk: Footprints,
  strength: Dumbbell,
  breathe: Wind,
};

const colorMap = {
  walk: "bg-accent/10 text-accent",
  strength: "bg-primary/10 text-primary",
  breathe: "bg-success/10 text-success",
};

const initialExercises: Exercise[] = [
  {
    id: 1,
    name: "Warm-Up Walk",
    duration: "5 min",
    type: "walk",
    instructions:
      "Walk slowly around your home or down the street. Keep your pace gentle — you should be able to speak comfortably. This warms up your heart and muscles safely.",
    done: false,
  },
  {
    id: 2,
    name: "Main Walk",
    duration: "20 min",
    type: "walk",
    instructions:
      "Walk at a comfortable pace outdoors or indoors. Use the talk test: if you can hold a conversation but not sing, you're at the right intensity. Stop immediately if you feel chest pain, dizziness, or unusual shortness of breath.",
    done: false,
  },
  {
    id: 3,
    name: "Seated Leg Extensions",
    duration: "10 reps × 2",
    type: "strength",
    instructions:
      "Sit upright in a sturdy chair. Slowly extend one leg until straight, hold 2 seconds, lower. Alternate legs. This builds lower-body strength with zero strain on your heart.",
    done: false,
  },
  {
    id: 4,
    name: "Cool-Down & Breathing",
    duration: "5 min",
    type: "breathe",
    instructions:
      "Sit or lie down comfortably. Breathe in slowly through your nose for 4 counts, hold 2, out through your mouth for 6. Repeat. This brings your heart rate down gently and reduces anxiety.",
    done: false,
  },
];

function moodEmojis() {
  return [
    { label: "Great", value: 5 },
    { label: "Good", value: 4 },
    { label: "Okay", value: 3 },
    { label: "Low", value: 2 },
    { label: "Bad", value: 1 },
  ];
}

export default function ExerciseScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [effort, setEffort] = useState<number | null>(null);
  const [logged, setLogged] = useState(false);

  const done = exercises.filter((e) => e.done).length;
  const total = exercises.length;
  const progress = Math.round((done / total) * 100);

  function toggleDone(id: number) {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e))
    );
  }

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-12 pb-5 bg-card border-b border-border">
        <p className="text-muted-foreground text-sm font-sans">Week 4 — Session 14</p>
        <h1 className="text-foreground text-2xl font-semibold font-sans text-balance mt-0.5">
          Today&apos;s Exercise
        </h1>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-muted-foreground font-sans">{done} of {total} done</span>
            <span className="text-xs font-semibold text-accent font-sans">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="px-5 pt-5 flex flex-col gap-3">
        {exercises.map((ex) => {
          const Icon = iconMap[ex.type];
          const isExpanded = expanded === ex.id;
          return (
            <div
              key={ex.id}
              className={`bg-card rounded-2xl border overflow-hidden transition-all ${
                ex.done ? "border-success/40 bg-success/5" : "border-border"
              }`}
            >
              <div
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : ex.id)}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[ex.type]}`}>
                  <Icon size={17} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold font-sans ${ex.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {ex.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={11} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-sans">{ex.duration}</span>
                  </div>
                </div>

                {/* Check + expand */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleDone(ex.id); }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                      ex.done
                        ? "border-success bg-success"
                        : "border-border bg-transparent"
                    }`}
                  >
                    {ex.done && <CheckCircle2 size={15} className="text-success-foreground" />}
                  </button>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded instructions */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/50">
                  <p className="text-sm text-foreground/80 font-sans leading-relaxed pt-3">
                    {ex.instructions}
                  </p>
                  {!ex.done && (
                    <button
                      onClick={() => toggleDone(ex.id)}
                      className="mt-3 flex items-center gap-2 bg-accent text-accent-foreground rounded-xl px-4 py-2 text-sm font-semibold font-sans"
                    >
                      <Play size={14} />
                      Mark as complete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Log session */}
      {!logged ? (
        <div className="px-5 mt-6">
          <div className="bg-card rounded-2xl border border-border p-4">
            <h2 className="text-foreground text-base font-semibold font-sans mb-4">
              Log this session
            </h2>

            {/* Mood */}
            <p className="text-sm text-muted-foreground font-sans mb-2">How do you feel after?</p>
            <div className="flex gap-2 mb-4">
              {moodEmojis().map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-sans transition-colors ${
                    mood === m.value
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <span>{["", "😞", "😕", "😐", "🙂", "😄"][m.value]}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Effort */}
            <p className="text-sm text-muted-foreground font-sans mb-2">Could you talk during exercise?</p>
            <div className="flex gap-2 mb-5">
              {["Easily", "Somewhat", "Not really"].map((e) => (
                <button
                  key={e}
                  onClick={() => setEffort(["Easily", "Somewhat", "Not really"].indexOf(e))}
                  className={`flex-1 py-2 rounded-xl border text-xs font-sans transition-colors ${
                    effort === ["Easily", "Somewhat", "Not really"].indexOf(e)
                      ? "border-accent bg-accent/10 text-accent font-semibold"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLogged(true)}
              disabled={mood === null || effort === null}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold font-sans disabled:opacity-40 transition-opacity"
            >
              Save session log
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 mt-6">
          <div className="bg-success/10 border border-success/30 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-success flex-shrink-0" />
            <div>
              <p className="text-foreground font-semibold text-sm font-sans">Session logged!</p>
              <p className="text-muted-foreground text-xs font-sans mt-0.5 leading-relaxed">
                Great work today, Maria. Your care team can see your progress.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
