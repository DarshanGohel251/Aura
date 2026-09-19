"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Eye, Type, Scaling, Minimize, ShieldCheck, SunMoon, Focus } from "lucide-react";
import { useProfile } from "./profile-provider";
import { cn } from "@/lib/utils";

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, toggleAccessibility } = useProfile();
  const { accessibility } = profile;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-neutral-900/95 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all hover:bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-105 active:scale-95"
        aria-label="Open Accessibility Control Center"
      >
        <Settings className="h-4 w-4 text-purple-400" />
        <span>Accessibility</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-88 max-w-sm overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl p-5 space-y-4"
              role="dialog"
              aria-label="Accessibility Settings"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Universal Accessibility</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <AccessibilityToggle
                  icon={<Type className="h-4 w-4 text-purple-400" />}
                  label="Dyslexia Friendly"
                  desc="Increased letter spacing, 1.8x line height, distinct character geometry"
                  active={accessibility.dyslexiaFriendly}
                  onClick={() => toggleAccessibility("dyslexiaFriendly")}
                />
                <AccessibilityToggle
                  icon={<SunMoon className="h-4 w-4 text-amber-400" />}
                  label="High Contrast"
                  desc="High luminance contrast (>7:1 AAA ratio) with sharp delineations"
                  active={accessibility.highContrast}
                  onClick={() => toggleAccessibility("highContrast")}
                />
                <AccessibilityToggle
                  icon={<Scaling className="h-4 w-4 text-blue-400" />}
                  label="Large Text"
                  desc="Scales base typography to 1.25x for enhanced legibility"
                  active={accessibility.largeText}
                  onClick={() => toggleAccessibility("largeText")}
                />
                <AccessibilityToggle
                  icon={<Minimize className="h-4 w-4 text-emerald-400" />}
                  label="Reduced Motion"
                  desc="Eliminates non-essential kinetic spring transitions"
                  active={accessibility.reducedMotion}
                  onClick={() => toggleAccessibility("reducedMotion")}
                />
                <AccessibilityToggle
                  icon={<Focus className="h-4 w-4 text-cyan-400" />}
                  label="Zen Focus Mode"
                  desc="Hides peripheral ambients and streamlines the workspace"
                  active={accessibility.focusMode}
                  onClick={() => toggleAccessibility("focusMode")}
                />
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 font-mono text-center">
                SDG 4.5 Inclusive Learning Compliance
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AccessibilityToggle({
  icon,
  label,
  desc,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start justify-between rounded-2xl border p-3 text-left text-xs transition-all focus:outline-none focus:ring-2 focus:ring-purple-500",
        active
          ? "border-purple-500/50 bg-purple-500/10 text-white"
          : "border-neutral-800/80 bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60"
      )}
    >
      <div className="flex items-start gap-2.5 pr-2">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="font-semibold">{label}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{desc}</div>
        </div>
      </div>
      <div
        className={cn(
          "flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors mt-1",
          active ? "bg-purple-500" : "bg-neutral-700"
        )}
      >
        <div
          className={cn(
            "h-3 w-3 rounded-full bg-white transition-transform",
            active ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    </button>
  );
}
