export const MARIA = {
  name: "Maria",
  age: 58,
  condition: "Post-stent, stable",
  week: 3,
  sessionsCompleted: 8,
  totalSessions: 36,
  streakDays: 6,
  currentStage: 3,
  why: "Keeping up with her grandkids",
  careTeam: { name: "Dr. Patel", phone: "555-0123" },
  vitals: {
    restingHR: { current: 72, baseline: 78, trend: "improving" as const },
    avgDailySteps: 4200,
    bloodPressure: "128/82",
    weight: 165,
  },
  moodHistory: [
    { date: "2026-03-23", mood: "okay" },
    { date: "2026-03-24", mood: "good" },
    { date: "2026-03-25", mood: "good" },
    { date: "2026-03-26", mood: "great" },
    { date: "2026-03-27", mood: "okay" },
    { date: "2026-03-28", mood: "good" },
    { date: "2026-03-29", mood: "good" },
  ],
  recentSessions: [
    { date: "2026-03-22", type: "walk", duration: 10, completed: true },
    { date: "2026-03-24", type: "walk", duration: 12, completed: true },
    { date: "2026-03-25", type: "stretching", duration: 5, completed: true },
    { date: "2026-03-26", type: "walk", duration: 12, completed: true },
    { date: "2026-03-28", type: "walk", duration: 15, completed: true },
  ],
  todayPlan: [
    { id: "1", label: "12-min walk (moderate)", done: false },
    { id: "2", label: "Evening stretches (5 min)", done: false },
    { id: "3", label: "Mood check-in", done: false },
  ],
} as const;

export type MoodValue = "okay" | "good" | "great" | "tough";

export interface JourneyStage {
  id: number;
  name: string;
  sessionThreshold: number;
  tagline: string;
  unlockMessage: string;
  shareable: boolean;
  colorPrimary: string;
  colorGlow: string;
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    name: "First Beat",
    sessionThreshold: 1,
    tagline: "You showed up. That&apos;s the hardest part.",
    unlockMessage: "Every journey starts with a single beat.",
    shareable: false,
    colorPrimary: "#9ca3af",
    colorGlow: "rgba(156,163,175,0.3)",
  },
  {
    id: 2,
    name: "Spark",
    sessionThreshold: 3,
    tagline: "A glow begins.",
    unlockMessage: "Something beautiful is starting.",
    shareable: false,
    colorPrimary: "#f9a8d4",
    colorGlow: "rgba(249,168,212,0.4)",
  },
  {
    id: 3,
    name: "Kindling",
    sessionThreshold: 8,
    tagline: "Your strength is building.",
    unlockMessage: "Your heart is learning to trust you again.",
    shareable: true,
    colorPrimary: "#f87171",
    colorGlow: "rgba(248,113,113,0.4)",
  },
  {
    id: 4,
    name: "Rhythm",
    sessionThreshold: 14,
    tagline: "Finding your pace.",
    unlockMessage: "Steady. Strong. Yours.",
    shareable: false,
    colorPrimary: "#e8446d",
    colorGlow: "rgba(232,68,109,0.5)",
  },
  {
    id: 5,
    name: "Steady Stride",
    sessionThreshold: 22,
    tagline: "Unstoppable.",
    unlockMessage: "Look at how far you&apos;ve already come.",
    shareable: true,
    colorPrimary: "#e8446d",
    colorGlow: "rgba(232,68,109,0.55)",
  },
  {
    id: 6,
    name: "Strong",
    sessionThreshold: 30,
    tagline: "Look how far you&apos;ve come.",
    unlockMessage: "Your heart is singing.",
    shareable: true,
    colorPrimary: "#e8446d",
    colorGlow: "rgba(232,68,109,0.6)",
  },
  {
    id: 7,
    name: "Unbreakable",
    sessionThreshold: 36,
    tagline: "Your heart is whole again.",
    unlockMessage: "You did it. You really did it.",
    shareable: true,
    colorPrimary: "#e8446d",
    colorGlow: "rgba(232,68,109,0.7)",
  },
];

export function getCurrentStage(sessions: number): JourneyStage {
  let current = JOURNEY_STAGES[0];
  for (const stage of JOURNEY_STAGES) {
    if (sessions >= stage.sessionThreshold) {
      current = stage;
    }
  }
  return current;
}

export function getStageForSessions(sessions: number): number {
  return getCurrentStage(sessions).id;
}

// Safety keyword detection
const SAFETY_KEYWORDS = [
  "chest pain",
  "chest hurts",
  "chest is tight",
  "heart racing",
  "heart is racing",
  "irregular heartbeat",
  "can't breathe",
  "cannot breathe",
  "short of breath",
  "shortness of breath",
  "dizzy",
  "dizziness",
  "nausea",
  "nauseated",
  "feeling sick",
  "passed out",
  "fainted",
  "syncope",
];

export function detectSafetyKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return SAFETY_KEYWORDS.some((kw) => lower.includes(kw));
}

export interface Alert {
  id: string;
  timestamp: string;
  tier: "red" | "orange" | "yellow";
  message: string;
  patientMessage: string;
}

// In-memory alert store (module-level singleton for hackathon)
export const alertStore: Alert[] = [];

export function addAlert(alert: Omit<Alert, "id" | "timestamp">): Alert {
  const newAlert: Alert = {
    ...alert,
    id: Math.random().toString(36).slice(2),
    timestamp: new Date().toISOString(),
  };
  alertStore.unshift(newAlert);
  return newAlert;
}
