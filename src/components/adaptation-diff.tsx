"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, ArrowRight, Layers, FileText, Type, Gauge, Zap } from "lucide-react";
import { AdaptationDecision, AdaptationPlan } from "@/lib/api";

interface AdaptationDiffProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: AdaptationPlan;
  decisions?: AdaptationDecision[];
}

export function AdaptationDiff({ isOpen, onClose, plan, decisions }: AdaptationDiffProps) {
  if (!isOpen) return null;

  const activeDecisions = decisions && decisions.length > 0 ? decisions : (plan?.decisions || []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-8 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Adaptation Diff · What Changed
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Same learning objective. Radically different learner experience.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              aria-label="Close diff modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Before Aura (Fixed Standard) */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  Conventional Fixed LMS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-neutral-800 text-neutral-300">
                  One-Size-Fits-All
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-400">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-neutral-500 font-mono">✕</span>
                  <div>
                    <strong className="text-neutral-300">Rigid 15-Minute Volume:</strong> All 3 technical concepts enforced regardless of time pressure.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-neutral-500 font-mono">✕</span>
                  <div>
                    <strong className="text-neutral-300">Wall-of-Text Reading:</strong> Dense academic prose with zero diagrammatic alternatives.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-neutral-500 font-mono">✕</span>
                  <div>
                    <strong className="text-neutral-300">Fixed 14px Typography:</strong> Standard tight line height (1.2x) triggering dyslexia fatigue.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-neutral-500 font-mono">✕</span>
                  <div>
                    <strong className="text-neutral-300">Unfiltered Animation:</strong> High-frequency visual motion with no vestibular accommodations.
                  </div>
                </li>
              </ul>
            </div>

            {/* After Aura (Adaptive) */}
            <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-5 space-y-4 shadow-lg shadow-purple-900/10">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  Aura Adaptive Engine
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  Active Profile
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Cognitive Chunking:</strong> {plan?.conceptCount || 1} focused concept tailored to your session window.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Dynamic {plan?.layout || "VISUAL"} Mode:</strong> Instant schematic relationship map and interactive reveal.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Accessible Geometry:</strong> {plan?.fontScale ? `${plan.fontScale}x scale` : "Scaled"}, generous {plan?.spacing?.toLowerCase() || "relaxed"} spacing.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Vestibular Comfort:</strong> Motion dynamically set to {plan?.motion || "REDUCED"}.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Audit Trail of Adaptation Decisions */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3">
              Server-Calculated Adaptation Decisions ({activeDecisions.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {activeDecisions.map((d, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-neutral-800 text-purple-300 border border-neutral-700">
                      {d.adaptationType}
                    </span>
                    <span className="text-neutral-400 line-through">{d.previousValue}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span className="font-semibold text-white">{d.newValue}</span>
                  </div>
                  <div className="text-neutral-400 sm:text-right italic">
                    {d.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-sm"
            >
              Return to Lesson
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
