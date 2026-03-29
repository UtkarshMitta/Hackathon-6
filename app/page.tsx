"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav, { Tab } from "@/components/BottomNav";
import HomeScreen from "@/components/screens/HomeScreen";
import JourneyScreen from "@/components/screens/JourneyScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: "easeInOut" },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="relative flex flex-col max-w-[430px] mx-auto min-h-screen bg-background">
      {/* Screen content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide" style={{ paddingBottom: "72px" }}>
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" {...PAGE_TRANSITION}>
              <HomeScreen onNavigate={(tab) => setActiveTab(tab as Tab)} />
            </motion.div>
          )}
          {activeTab === "journey" && (
            <motion.div key="journey" {...PAGE_TRANSITION}>
              <JourneyScreen />
            </motion.div>
          )}
          {activeTab === "chat" && (
            <motion.div key="chat" {...PAGE_TRANSITION} className="h-screen">
              <ChatScreen />
            </motion.div>
          )}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" {...PAGE_TRANSITION}>
              <DashboardScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}
