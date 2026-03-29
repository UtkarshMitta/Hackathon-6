"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Share2, Lock, ChevronRight, X } from "lucide-react";
import HeartVisualization from "@/components/HeartVisualization";
import { MARIA, JOURNEY_STAGES } from "@/lib/data";

export default function JourneyScreen() {
  const currentSessions = MARIA.sessionsCompleted;
  const [shareStage, setShareStage] = useState<number | null>(null);
  const [sharedStages, setSharedStages] = useState<Set<number>>(new Set());

  const getStageStatus = (stage: typeof JOURNEY_STAGES[0]) => {
    if (currentSessions >= stage.sessionThreshold) return "completed";
    const prevThreshold = JOURNEY_STAGES[stage.id - 2]?.sessionThreshold ?? 0;
    if (currentSessions >= prevThreshold && stage.id === MARIA.currentStage + 1) return "current";
    if (stage.id === MARIA.currentStage) return "current";
    return "locked";
  };

  const progress = currentSessions / MARIA.totalSessions;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <motion.h1
          className="text-2xl font-bold text-navy"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Journey
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentSessions} of {MARIA.totalSessions} sessions complete
        </p>
      </div>

      {/* Large Heart */}
      <motion.div
        className="flex flex-col items-center py-6 bg-gradient-to-b from-[#fff1f2] to-background mx-5 mt-4 rounded-3xl"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55 }}
      >
        <HeartVisualization stage={MARIA.currentStage} size="lg" showGlow />
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-base font-bold text-navy">
            Stage {MARIA.currentStage}: {JOURNEY_STAGES[MARIA.currentStage - 1].name}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5 italic px-8 text-balance">
            &ldquo;{JOURNEY_STAGES[MARIA.currentStage - 1].tagline.replace(/&apos;/g, "'")}&rdquo;
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full px-8 mt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted-foreground">Session 1</span>
            <span className="text-xs font-semibold text-primary">{Math.round(progress * 100)}%</span>
            <span className="text-xs text-muted-foreground">Session 36</span>
          </div>
        </div>
      </motion.div>

      {/* Milestone Timeline */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">
          Milestones
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-border" />

          <div className="space-y-3">
            {JOURNEY_STAGES.map((stage, i) => {
              const status = getStageStatus(stage);
              const isCompleted = status === "completed";
              const isCurrent = status === "current";
              const isLocked = status === "locked";

              return (
                <motion.div
                  key={stage.id}
                  className="relative flex items-start gap-4 pl-0"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  {/* Timeline node */}
                  <div className="relative z-10 flex-shrink-0 w-10 flex items-center justify-center pt-2">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: i * 0.07 + 0.2 }}
                      >
                        <CheckCircle2
                          size={20}
                          className="text-accent"
                          fill="currentColor"
                        />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        className="w-5 h-5 rounded-full bg-primary border-4 border-primary/30"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                        <Lock size={8} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 rounded-2xl px-4 py-3 transition-all ${
                      isCompleted
                        ? "bg-card shadow-card border border-accent/20"
                        : isCurrent
                        ? "bg-primary/8 border border-primary/25 shadow-card"
                        : "bg-muted/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-bold ${
                              isLocked ? "text-muted-foreground" : "text-navy"
                            }`}
                          >
                            {stage.name}
                          </span>
                          {isCompleted && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                              Complete
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
                          }`}
                        >
                          Session {stage.sessionThreshold}
                          {isLocked &&
                            ` · ${stage.sessionThreshold - currentSessions} sessions away`}
                        </p>
                        {!isLocked && (
                          <p className="text-xs text-foreground/70 mt-1 italic leading-relaxed">
                            &ldquo;{stage.unlockMessage.replace(/&apos;/g, "'")}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Share button for completed shareable stages */}
                      {isCompleted && stage.shareable && (
                        <button
                          onClick={() => setShareStage(stage.id)}
                          className="flex-shrink-0 flex items-center gap-1 text-xs text-primary font-medium py-1 px-2.5 rounded-lg bg-primary/8 active:scale-95 transition-transform"
                          aria-label={`Share ${stage.name} milestone`}
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                      )}

                      {/* Locked preview */}
                      {isLocked && (
                        <ChevronRight size={16} className="text-muted-foreground/40 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {shareStage !== null && (
          <>
            <motion.div
              className="fixed inset-0 bg-navy/40 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareStage(null)}
            />
            <motion.div
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl z-50 px-6 py-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
            >
              <button
                onClick={() => setShareStage(null)}
                className="absolute top-4 right-4 text-muted-foreground"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {(() => {
                const s = JOURNEY_STAGES[shareStage - 1];
                return (
                  <div className="flex flex-col items-center text-center">
                    <HeartVisualization stage={shareStage} size="sm" />
                    <h3 className="text-lg font-bold text-navy mt-3">
                      Stage {shareStage}: {s.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      &ldquo;{s.unlockMessage.replace(/&apos;/g, "'")}&rdquo;
                    </p>

                    <div className="mt-5 w-full bg-gradient-to-br from-[#fff1f2] to-[#FFF8F0] border border-primary/20 rounded-2xl px-5 py-5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        HeartPath Milestone
                      </p>
                      <p className="text-xl font-bold text-primary mt-1">
                        {s.name}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        Maria completed Session {s.sessionThreshold} of her cardiac rehab journey.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        &ldquo;{s.tagline.replace(/&apos;/g, "'")}&rdquo;
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSharedStages((prev) => new Set([...prev, shareStage]));
                        setShareStage(null);
                      }}
                      className="mt-4 w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform"
                    >
                      {sharedStages.has(shareStage) ? "Shared!" : "Share with Family"}
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
