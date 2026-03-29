"use client";

import { motion } from "framer-motion";
import { Home, Map, MessageCircle, LayoutDashboard } from "lucide-react";

export type Tab = "home" | "journey" | "chat" | "dashboard";

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "journey", label: "Journey", Icon: Map },
  { id: "chat", label: "Compass", Icon: MessageCircle },
  { id: "dashboard", label: "Care Team", Icon: LayoutDashboard },
];

interface BottomNavProps {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border pb-safe z-30"
      aria-label="Main navigation"
    >
      <div className="flex">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
            >
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  layoutId="nav-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                className="transition-all"
              />
              <span className={`text-[10px] font-sans ${isActive ? "font-semibold" : "font-normal"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
