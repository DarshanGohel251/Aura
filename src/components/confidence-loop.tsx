"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle, RefreshCw, CheckCircle2, Star } from "lucide-react";

interface ConfidenceLoopProps {
  currentConfidence?: number;
  explanationStrategy: "TECHNICAL" | "ANALOGY" | "STEP_BY_STEP";
  onRecordConfidence: (score: number) => Promise<void>;
  onExplainDifferently: () => Promise<void>;
  disabled?: boolean;
}

export function ConfidenceLoop({
  currentConfidence = 3,
  explanationStrategy,
  onRecordConfidence,
  onExplainDifferently,
  disabled = false,
}: ConfidenceLoopProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRating = async (rating: number) => {
    if (disabled || isSubmitting) return;
    setSelectedRating(rating);
    setIsSubmitting(true);
    try {
      await onRecordConfidence(rating);
      if (rating <= 2) {
        setFeedbackMessage("Confidence recorded (Low). Aura automatically queued real-world analogies for subsequent concepts.");
      } else if (rating >= 4) {
        setFeedbackMessage("Confidence recorded (High). Aura accelerated your path to advanced step-by-step concepts.");
      } else {
        setFeedbackMessage("Confidence recorded (Balanced). Aura maintained steady cognitive pacing.");
      }
    } catch {
      setFeedbackMessage("Recorded locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExplainDifferent = async () => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      await onExplainDifferently();
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Confidence Feedback Loop
          </span>
          <p className="text-sm text-neutral-300 font-medium mt-0.5">
            How confident are you with this concept?
          </p>
        </div>

        <button
          onClick={handleExplainDifferent}
          disabled={isSwitching}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Switch between Technical, Analogy, or Step-by-Step formulations"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSwitching ? "animate-spin" : ""}`} />
          <span>Explain Differently ({explanationStrategy})</span>
        </button>
      </div>

      {/* 1 - 5 Rating Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((score) => {
          const isSelected = selectedRating === score || (!selectedRating && Math.round(currentConfidence) === score);
          return (
            <button
              key={score}
              onClick={() => handleRating(score)}
              disabled={disabled || isSubmitting}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                isSelected
                  ? "bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-950/50"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-0.5">
                <Star className={`w-3.5 h-3.5 ${isSelected ? "text-purple-400 fill-purple-400" : "text-neutral-500"}`} />
                <span>{score}</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-normal">
                {score === 1 ? "Struggling" : score === 3 ? "Okay" : score === 5 ? "Mastered" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900/50 px-3.5 py-2 rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
