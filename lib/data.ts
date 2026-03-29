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
};

export const MILESTONES = [
  {
    stage: 1,
    name: "First Beat",
    sessions: 1,
    quote: "You showed up. That's the hardest part.",
    description: "A single warm pulse begins",
    color: "#BDBDBD",
    glowColor: "#E8446D22",
  },
  {
    stage: 2,
    name: "Spark",
    sessions: 3,
    quote: "A glow begins",
    description: "Warmth starts at the center",
    color: "#F48FB1",
    glowColor: "#E8446D44",
  },
  {
    stage: 3,
    name: "Kindling",
    sessions: 8,
    quote: "Your strength is building",
    description: "Vessels appear, color spreads",
    color: "#E8446D",
    glowColor: "#E8446D66",
  },
  {
    stage: 4,
    name: "Rhythm",
    sessions: 14,
    quote: "Finding your pace",
    description: "A steady pulse, colors deepen",
    color: "#D81B60",
    glowColor: "#E8446D88",
  },
  {
    stage: 5,
    name: "Steady Stride",
    sessions: 22,
    quote: "Unstoppable",
    description: "Vibrant, small details emerge",
    color: "#C2185B",
    glowColor: "#E8446DAA",
  },
  {
    stage: 6,
    name: "Strong",
    sessions: 30,
    quote: "Look how far you've come",
    description: "Fully colored, glowing, alive",
    color: "#AD1457",
    glowColor: "#E8446DCC",
  },
  {
    stage: 7,
    name: "Unbreakable",
    sessions: 36,
    quote: "Your heart is whole again",
    description: "A radiant, unique design",
    color: "#880E4F",
    glowColor: "#E8446DEE",
  },
];

export type AlertTier = "green" | "yellow" | "orange" | "red";

export interface Alert {
  id: string;
  timestamp: string;
  tier: AlertTier;
  message: string;
  resolved: boolean;
}

export const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    timestamp: "2026-03-27T14:32:00Z",
    tier: "yellow",
    message: "Maria missed 2 consecutive sessions. Mood trending stable.",
    resolved: false,
  },
  {
    id: "2",
    timestamp: "2026-03-25T09:15:00Z",
    tier: "green",
    message: "15-minute walk completed — new personal best.",
    resolved: true,
  },
];

export const SAFETY_KEYWORDS = [
  "chest pain",
  "chest hurts",
  "heart pain",
  "dizzy",
  "dizziness",
  "can't breathe",
  "cannot breathe",
  "hard to breathe",
  "shortness of breath",
  "short of breath",
  "nausea",
  "nauseous",
  "vomiting",
  "heart racing",
  "racing heart",
  "irregular heartbeat",
  "palpitations",
  "syncope",
  "fainted",
  "fainting",
  "passed out",
];

export function getStageForSessions(sessions: number): number {
  const stages = [36, 30, 22, 14, 8, 3, 1];
  const stageNums = [7, 6, 5, 4, 3, 2, 1];
  for (let i = 0; i < stages.length; i++) {
    if (sessions >= stages[i]) return stageNums[i];
  }
  return 1;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
