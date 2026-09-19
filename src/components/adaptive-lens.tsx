"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Clock, Eye, BookOpen, Joystick, Target, Brain, Sparkles, Check } from "lucide-react";
import { Accessibility, LearnerProfile } from "@/lib/api";

interface AdaptiveLensProps {
  timeAvailable: "2m" | "5m" | "10m";
  preference: "VISUAL" | "READING" | "PRACTICE";
  focusLevel: "LOW" | "MEDIUM" | "HIGH";
  accessibility: Accessibility;
  onApply: (updates: {
    timeAvailable?: "2m" | "5m" | "10m";
    preference?: "VISUAL" | "READING" | "PRACTICE";
    focusLevel?: "LOW" | "MEDIUM" | "HIGH";
  }) => Promise<void>;
  isAdapting?: boolean;
}

export function AdaptiveLens({
  timeAvailable,
  preference,
  focusLevel,
  onApply,
  isAdapting = false,
}: AdaptiveLensProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTime, setLocalTime] = useState(timeAvailable);
  const [localPref, setLocalPref] = useState(preference);
  const [localFocus, setLocalFocus] = useState(focusLevel);

  const handleApply = async () => {
    await onApply({
      timeAvailable: localTime,
      preference: localPref,
      focusLevel: localFocus,
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 font-medium text-xs sm:text-sm transition-all shadow-sm"
        aria-label="Open Adaptive Lens Controls"
      >
        <SlidersHorizontal className="w-4 h-4 text-purple-400" />
        <span>Adaptive Lens</span>
        <span className="hidden md:inline text-purple-400/60 font-mono text-[11px]">
          ({timeAvailable} · {preference} · {focusLevel})
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Adaptive Lens</h3>
                    <p className="text-xs text-neutral-400">Dynamically transform this lesson in real time</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Time Available */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2.5 block">
                  Time Window
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["2m", "5m", "10m"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setLocalTime(t)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        localTime === t
                          ? "bg-purple-500/20 border-purple-500 text-white"
                          : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Preference */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2.5 block">
                  Learning Preference
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "VISUAL", label: "Visual", icon: Eye },
                    { id: "READING", label: "Reading", icon: BookOpen },
                    { id: "PRACTICE", label: "Practice", icon: Joystick },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setLocalPref(id as any)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        localPref === id
                          ? "bg-purple-500/20 border-purple-500 text-white"
                          : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Level */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2.5 block">
                  Cognitive Focus Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "LOW", label: "Low", icon: Target },
                    { id: "MEDIUM", label: "Medium", icon: Target },
                    { id: "HIGH", label: "High", icon: Brain },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setLocalFocus(id as any)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        localFocus === id
                          ? "bg-purple-500/20 border-purple-500 text-white"
                          : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={isAdapting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAdapting ? "Adapting..." : "Recalculate Lesson"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
