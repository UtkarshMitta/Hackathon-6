"use client";

import { useState } from "react";
import { Home, MessageCircle, Dumbbell } from "lucide-react";
import HomeScreen from "@/components/HomeScreen";
import ChatScreen from "@/components/ChatScreen";
import ExerciseScreen from "@/components/ExerciseScreen";

type Tab = "home" | "chat" | "exercise";

const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "chat", label: "AI Coach", Icon: MessageCircle },
  { id: "exercise", label: "Exercise", Icon: Dumbbell },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === "home" && (
          <HomeScreen onNavigate={(tab) => setActiveTab(tab as Tab)} />
        )}
        {activeTab === "chat" && <ChatScreen />}
        {activeTab === "exercise" && <ExerciseScreen />}
      </main>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 border-t border-border bg-card pb-safe">
        <div className="flex">
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className={`text-xs font-sans ${active ? "font-semibold" : "font-normal"}`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute bottom-0 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
