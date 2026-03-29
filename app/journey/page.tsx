"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, Share2, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import HeartVisualization from "@/components/HeartVisualization";
import { MARIA, MILESTONES } from "@/lib/data";

interface ShareModalProps {
  milestone: (typeof MILESTONES)[0];
  onClose: () => void;
}

function ShareModal({ milestone, onClose }: ShareModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="rounded-3xl p-8 w-full max-w-sm text-center"
        style={{ background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative heart */}
        <div className="flex justify-center mb-4">
          <HeartVisualization
            stage={milestone.stage}
            sessions={milestone.sessions}
            totalSessions={36}
            size="sm"
            showLabel={false}
          />
        </div>

        <div
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: "var(--color-primary)" }}
        >
          Stage {milestone.stage} Unlocked
        </div>
        <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: "var(--color-foreground)" }}>
          {milestone.name}
        </h3>
        <p className="text-base leading-relaxed mb-1" style={{ color: "var(--color-muted)" }}>
          {milestone.description}
        </p>
        <p className="text-sm italic mt-3 mb-6 px-4 leading-relaxed" style={{ color: "var(--color-foreground)" }}>
          &ldquo;{milestone.quote.replace(/&apos;/g, "'")}&rdquo;
        </p>

        <div
          className="rounded-2xl p-4 mb-5 text-sm"
          style={{
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted)",
          }}
        >
          Maria completed {milestone.sessions} sessions on her path to healing.
          <br />
          <span style={{ color: "var(--color-foreground)", fontWeight: 600 }}>
            HeartPath &bull; Stage {milestone.stage} of 7
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-semibold text-base"
            style={{
              background: "var(--color-background)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            Close
          </button>
          <button
            className="flex-1 py-3 rounded-2xl font-semibold text-base text-white"
            style={{ background: "var(--color-primary)" }}
            onClick={() => {
              // In a real app, this would generate a shareable image
              onClose();
            }}
          >
            Share
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function JourneyPage() {
  const [shareTarget, setShareTarget] = useState<(typeof MILESTONES)[0] | null>(null);
  const currentStage = MARIA.currentStage;

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <header
        className="px-5 pt-12 pb-4 flex items-center gap-3"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          className="p-2 rounded-xl hover:opacity-70 transition-opacity"
          aria-label="Go back to home"
        >
          <ArrowLeft size={20} style={{ color: "var(--color-foreground)" }} />
        </Link>
        <div>
          <h1 className="text-xl font-serif font-semibold" style={{ color: "var(--color-foreground)" }}>
            Your Healing Journey
          </h1>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {MARIA.sessionsCompleted} of {MARIA.totalSessions} sessions complete
          </p>
        </div>
      </header>

      <div className="px-5 max-w-lg mx-auto">
        {/* Large heart visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="py-8 flex justify-center"
        >
          <HeartVisualization
            stage={currentStage}
            sessions={MARIA.sessionsCompleted}
            totalSessions={MARIA.totalSessions}
            size="lg"
            showLabel={true}
          />
        </motion.div>

        {/* Current milestone motivational banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl px-5 py-4 mb-6 text-center"
          style={{
            background: "var(--color-primary)14",
            border: "1.5px solid var(--color-primary-light)",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
            You are here — keep going
          </p>
          <p className="text-base mt-1 font-serif" style={{ color: "var(--color-foreground)" }}>
            {MARIA.sessionsCompleted < MARIA.totalSessions
              ? `${MARIA.totalSessions - MARIA.sessionsCompleted} more sessions to Unbreakable`
              : "You did it — your heart is whole again!"}
          </p>
        </motion.div>

        {/* Milestone timeline */}
        <section aria-labelledby="milestones-heading">
          <h2
            id="milestones-heading"
            className="text-base font-semibold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            Your 7 Milestones
          </h2>

          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div
              className="absolute left-5 top-6 bottom-6 w-0.5 rounded-full"
              style={{ background: "var(--color-border)" }}
              aria-hidden="true"
            />
            {/* Progress line */}
            <motion.div
              className="absolute left-5 top-6 w-0.5 rounded-full origin-top"
              style={{ background: "var(--color-primary)" }}
              initial={{ height: 0 }}
              animate={{
                height: `${Math.min(100, ((currentStage - 1) / 6) * 100)}%`,
              }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              aria-hidden="true"
            />

            {MILESTONES.map((milestone, idx) => {
              const isCompleted = MARIA.sessionsCompleted >= milestone.sessions;
              const isCurrent = milestone.stage === currentStage;
              const isLocked = !isCompleted && !isCurrent;

              return (
                <motion.div
                  key={milestone.stage}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex gap-4 pb-6 relative z-10"
                >
                  {/* Stage dot */}
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isCompleted
                        ? "var(--color-primary)"
                        : isCurrent
                        ? "var(--color-surface)"
                        : "var(--color-background)",
                      border: isCurrent
                        ? `2px solid var(--color-primary)`
                        : isLocked
                        ? `2px solid var(--color-border)`
                        : "none",
                      boxShadow: isCurrent ? "0 0 0 4px var(--color-primary)20" : "none",
                    }}
                    animate={
                      isCurrent
                        ? { boxShadow: ["0 0 0 4px #E8446D20", "0 0 0 8px #E8446D10", "0 0 0 4px #E8446D20"] }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="white" />
                    ) : isCurrent ? (
                      <Star size={16} style={{ color: "var(--color-primary)" }} />
                    ) : (
                      <Lock size={14} style={{ color: "var(--color-border)" }} />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div
                    className="flex-1 rounded-2xl p-4"
                    style={{
                      background: isCurrent
                        ? "var(--color-surface)"
                        : isLocked
                        ? "transparent"
                        : "var(--color-surface)",
                      border: isCurrent
                        ? "1.5px solid var(--color-primary)"
                        : isLocked
                        ? "1.5px solid var(--color-border)"
                        : "1.5px solid var(--color-border)",
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{
                              color: isCompleted || isCurrent
                                ? "var(--color-primary)"
                                : "var(--color-muted)",
                            }}
                          >
                            Stage {milestone.stage}
                          </span>
                          {isCurrent && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--color-primary)18",
                                color: "var(--color-primary)",
                              }}
                            >
                              You are here
                            </span>
                          )}
                        </div>
                        <h3
                          className="text-base font-semibold font-serif mt-0.5"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {milestone.name}
                        </h3>
                        <p className="text-sm mt-1 leading-snug" style={{ color: "var(--color-muted)" }}>
                          {milestone.description}
                        </p>
                        {(isCompleted || isCurrent) && (
                          <p
                            className="text-sm italic mt-2 leading-snug"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            &ldquo;{milestone.quote.replace(/&apos;/g, "'")}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Session count badge */}
                      <div className="text-right shrink-0">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--color-muted)" }}
                        >
                          Session
                        </span>
                        <br />
                        <span
                          className="text-base font-bold"
                          style={{
                            color: isCompleted
                              ? "var(--color-primary)"
                              : "var(--color-muted)",
                          }}
                        >
                          {milestone.sessions}
                        </span>
                      </div>
                    </div>

                    {/* Share button for completed milestones */}
                    {isCompleted && (
                      <button
                        onClick={() => setShareTarget(milestone)}
                        className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                        aria-label={`Share Stage ${milestone.stage}: ${milestone.name}`}
                      >
                        <Share2 size={13} />
                        Share this milestone
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {shareTarget && (
          <ShareModal
            milestone={shareTarget}
            onClose={() => setShareTarget(null)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}
