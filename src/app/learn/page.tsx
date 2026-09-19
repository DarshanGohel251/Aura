"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/components/profile-provider";
import { api, LearningSession, Concept, AdaptationDecision } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  SlidersHorizontal, 
  HelpCircle, 
  Eye, 
  BookOpen, 
  Joystick, 
  Check, 
  RotateCcw, 
  Award,
  Clock,
  Brain,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AdaptiveLens } from "@/components/adaptive-lens";
import { AdaptationDiff } from "@/components/adaptation-diff";
import { ConfidenceLoop } from "@/components/confidence-loop";

export default function LearnPage() {
  const { profile, updateProfile, toggleAccessibility } = useProfile();
  const [session, setSession] = useState<LearningSession | null>(null);
  const [currentConceptIdx, setCurrentConceptIdx] = useState(0);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [decisions, setDecisions] = useState<AdaptationDecision[]>([]);
  const [revealedVisual, setRevealedVisual] = useState(false);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize or start session from backend
  useEffect(() => {
    async function init() {
      setIsAdapting(true);
      try {
        const s = await api.startSession(profile.id || 1, "lesson_sound_waves");
        setSession(s);
        const decs = await api.getSessionDecisions(s.id);
        setDecisions(decs);
      } catch (e) {
        console.error("Session start fallback", e);
      } finally {
        setIsAdapting(false);
      }
    }
    init();
  }, []);

  const handleApplyLens = async (updates: {
    timeAvailable?: "2m" | "5m" | "10m";
    preference?: "VISUAL" | "READING" | "PRACTICE";
    focusLevel?: "LOW" | "MEDIUM" | "HIGH";
  }) => {
    if (!session) return;
    setIsAdapting(true);
    try {
      const updated = await api.adaptSession(session.id, updates);
      setSession(updated);
      const decs = await api.getSessionDecisions(session.id);
      setDecisions(decs);
      if (updates.timeAvailable || updates.preference || updates.focusLevel) {
        updateProfile(updates);
      }
    } finally {
      setIsAdapting(false);
    }
  };

  const handleConfidence = async (score: number) => {
    if (!session) return;
    const currentConcept = session.concepts[currentConceptIdx];
    const updated = await api.recordConfidence(session.id, score, currentConcept?.id);
    setSession(updated);
    const decs = await api.getSessionDecisions(session.id);
    setDecisions(decs);
  };

  const handleExplainDifferently = async () => {
    if (!session) return;
    const currentConcept = session.concepts[currentConceptIdx];
    const updated = await api.switchExplanationStrategy(session.id, currentConcept?.id);
    setSession(updated);
    const decs = await api.getSessionDecisions(session.id);
    setDecisions(decs);
  };

  const handleAdvance = async () => {
    if (!session) return;
    if (currentConceptIdx < session.concepts.length - 1) {
      setCurrentConceptIdx((prev) => prev + 1);
      setRevealedVisual(false);
      setSelectedPracticeOption(null);
      setShowHint(false);
      setShowExplanation(false);
      await api.advanceConcept(session.id);
    } else {
      const completed = await api.completeSession(session.id);
      setSession(completed);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-400">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-sm">Evaluating learner profile and synthesizing adaptive lesson...</p>
      </div>
    );
  }

  const plan = session.adaptationPlan;
  const concepts = session.concepts || [];
  const currentConcept: Concept | undefined = concepts[currentConceptIdx] || concepts[0];
  const isCompleted = session.completed;

  // Compute CSS styling based on accessibility & adaptation
  const isDyslexic = session.activeAccessibility.dyslexiaFriendly || plan.dyslexiaFriendly;
  const isHighContrast = session.activeAccessibility.highContrast || plan.contrastMode === "HIGH_CONTRAST";
  const isLargeText = session.activeAccessibility.largeText || plan.fontScale > 1.1;
  const isReducedMotion = session.activeAccessibility.reducedMotion || plan.motion === "REDUCED";
  const isRelaxedSpacing = plan.spacing === "RELAXED" || session.activeAccessibility.increasedSpacing;

  const fontClass = isDyslexic ? "tracking-wider leading-loose font-sans" : "font-sans";
  const textSizeClass = isLargeText ? "text-lg sm:text-xl" : "text-base";
  const bgClass = isHighContrast ? "bg-black text-white" : "bg-neutral-950 text-neutral-100";
  const cardBgClass = isHighContrast ? "bg-black border-2 border-white" : "bg-neutral-900 border-neutral-800";

  // Dynamic explanation content selector
  const activeStrategy = session.activeExplanationStrategy || "TECHNICAL";
  let explanationText = currentConcept?.technicalExplanation;
  if (activeStrategy === "ANALOGY" && currentConcept?.analogyExplanation) {
    explanationText = currentConcept.analogyExplanation;
  } else if (activeStrategy === "STEP_BY_STEP" && currentConcept?.stepByStepExplanation) {
    explanationText = currentConcept.stepByStepExplanation;
  }

  const MotionDiv = isReducedMotion ? "div" : motion.div;

  return (
    <main className={cn("min-h-screen pb-24 transition-all", bgClass, fontClass)}>
      {/* Top Learning Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold tracking-tight text-white text-lg sm:text-xl hover:opacity-80 transition-opacity">
              Aura
            </Link>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <span>Mode:</span>
              <span className="font-semibold text-white uppercase">{session.activeLayout}</span>
              <span>·</span>
              <span className="text-neutral-300">{session.activeTimePreference}</span>
              <span>·</span>
              <span className="text-neutral-300 capitalize">{session.activeFocusLevel} Focus</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsDiffOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-200 hover:border-neutral-600 hover:text-white transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>See What Changed ({session.totalAdaptations})</span>
            </button>

            <AdaptiveLens
              timeAvailable={session.activeTimePreference}
              preference={session.activeLayout}
              focusLevel={session.activeFocusLevel}
              accessibility={session.activeAccessibility}
              onApply={handleApplyLens}
              isAdapting={isAdapting}
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {!isCompleted ? (
          <>
            {/* Lesson Title & Progress */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold block mb-1">
                    {session.lessonTitle}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {currentConcept?.title || "Concept"}
                  </h1>
                </div>
                <div className="text-right font-mono">
                  <span className="text-white font-semibold">Concept {currentConceptIdx + 1}</span>
                  <span className="text-neutral-500"> of {concepts.length}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${((currentConceptIdx + 1) / concepts.length) * 100}%` }}
                />
              </div>
            </div>

            {/* "Aura Adapted This Lesson" Active Banner */}
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Aura adapted this lesson for your active context
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {session.totalAdaptations} Active Decisions
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-300">
                    {plan.humanReadableExplanations.slice(0, 3).map((exp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setIsDiffOpen(true)}
                className="hidden sm:inline-flex text-xs text-purple-300 hover:text-white underline underline-offset-4 shrink-0 font-medium"
              >
                Inspect Diff
              </button>
            </div>

            {/* Dynamic Adaptive Content Presentation */}
            <MotionDiv
              key={currentConcept?.id + session.activeLayout + activeStrategy}
              className={cn(
                "rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl",
                cardBgClass,
                isRelaxedSpacing ? "space-y-8 p-8 sm:p-10" : "space-y-6"
              )}
            >
              {/* Strategy Pill Indicator */}
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 text-xs">
                <div className="flex items-center gap-2 font-mono text-neutral-400">
                  <span>Strategy:</span>
                  <span className="font-semibold text-purple-400 uppercase">
                    {activeStrategy === "TECHNICAL" ? "Standard Technical" : activeStrategy === "ANALOGY" ? "Real-World Analogy" : "Step-by-Step Breakdown"}
                  </span>
                </div>
                <button
                  onClick={handleExplainDifferently}
                  className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Explain Differently</span>
                </button>
              </div>

              {/* Layout A: VISUAL */}
              {session.activeLayout === "VISUAL" && (
                <div className="space-y-6">
                  {/* Schematic Interactive Box */}
                  <div className="w-full rounded-2xl border border-purple-500/30 bg-neutral-950 p-6 sm:p-8 text-center space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      <Eye className="w-3.5 h-3.5" /> Visual Relationship Map
                    </div>
                    <div className="py-4 text-sm sm:text-base font-semibold text-emerald-300 font-mono tracking-wide">
                      {currentConcept?.visualDiagramLabel}
                    </div>

                    {!revealedVisual ? (
                      <button
                        onClick={() => setRevealedVisual(true)}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors shadow-md"
                      >
                        Tap to Reveal Visual Synthesis
                      </button>
                    ) : (
                      <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs sm:text-sm text-neutral-200">
                        {currentConcept?.shortSummary}
                      </div>
                    )}
                  </div>

                  <div className={cn("text-neutral-300 leading-relaxed", textSizeClass)}>
                    {explanationText}
                  </div>
                </div>
              )}

              {/* Layout B: READING */}
              {session.activeLayout === "READING" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-2">
                    <BookOpen className="w-3.5 h-3.5" /> Deep Reading Column
                  </div>
                  <div className={cn("text-neutral-200 leading-loose space-y-4", textSizeClass)}>
                    <p>{explanationText}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-400">
                    <strong className="text-white block mb-1">Key Takeaway:</strong>
                    {currentConcept?.shortSummary}
                  </div>
                </div>
              )}

              {/* Layout C: PRACTICE */}
              {session.activeLayout === "PRACTICE" && (
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    <Joystick className="w-3.5 h-3.5" /> Question-First Active Checkpoint
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {currentConcept?.question}
                    </h3>

                    <div className="space-y-2.5">
                      {currentConcept?.options.map((option, idx) => {
                        const isSelected = selectedPracticeOption === idx;
                        const isCorrect = idx === currentConcept.correctOptionIndex;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedPracticeOption(idx);
                              setShowExplanation(true);
                            }}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3",
                              isSelected
                                ? isCorrect
                                  ? "border-emerald-500 bg-emerald-950/30 text-white"
                                  : "border-red-500 bg-red-950/30 text-white"
                                : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800"
                            )}
                          >
                            <span className="font-mono text-neutral-500">{String.fromCharCode(65 + idx)}.</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <div className="pt-3 border-t border-neutral-800 text-xs sm:text-sm">
                        {selectedPracticeOption === currentConcept?.correctOptionIndex ? (
                          <div className="text-emerald-400 font-semibold flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct Retrieval!
                          </div>
                        ) : (
                          <div className="text-amber-400 font-semibold flex items-center gap-2 mb-1">
                            <Info className="w-4 h-4" /> Review Explanation:
                          </div>
                        )}
                        <p className="text-neutral-300">{currentConcept?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </MotionDiv>

            {/* Confidence Feedback Loop */}
            <ConfidenceLoop
              currentConfidence={session.confidenceRating}
              explanationStrategy={activeStrategy}
              onRecordConfidence={handleConfidence}
              onExplainDifferently={handleExplainDifferently}
            />

            {/* Action Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
              <Link
                href="/"
                className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
              >
                ← Exit Session
              </Link>

              <button
                onClick={handleAdvance}
                className="px-6 sm:px-8 py-3 rounded-2xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
              >
                <span>{currentConceptIdx < concepts.length - 1 ? "Next Concept" : "Complete Session"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Session Completion Summary */
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 sm:p-12 text-center space-y-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Objective Met
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Session Complete.</h2>
              <p className="text-neutral-400 text-sm mt-2 max-w-md mx-auto">
                Aura adapted this lesson through {session.totalAdaptations} individual engine adjustments to match your constraints.
              </p>
            </div>

            {/* Session Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/60">
                <span className="text-[11px] text-neutral-500 font-mono uppercase block">Estimated Time</span>
                <span className="text-xl font-bold text-white mt-1 block">{plan.estimatedMinutes}m</span>
              </div>
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/60">
                <span className="text-[11px] text-neutral-500 font-mono uppercase block">Concepts Mastered</span>
                <span className="text-xl font-bold text-white mt-1 block">{concepts.length}</span>
              </div>
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/60">
                <span className="text-[11px] text-neutral-500 font-mono uppercase block">Final Confidence</span>
                <span className="text-xl font-bold text-white mt-1 block">{session.confidenceRating.toFixed(1)} / 5</span>
              </div>
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/60">
                <span className="text-[11px] text-neutral-500 font-mono uppercase block">Total Adaptations</span>
                <span className="text-xl font-bold text-purple-400 mt-1 block">{session.totalAdaptations}</span>
              </div>
            </div>

            {/* "What Aura Learned About You" Insights */}
            <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-left space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> What Aura learned about you
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                You maintained a high completion rate with the <strong>{session.activeLayout}</strong> presentation format and <strong>{session.activeTimePreference}</strong> duration. We have saved this profile affinity to optimize your next lesson automatically.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setIsDiffOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-700 bg-neutral-800 text-white font-semibold text-xs hover:bg-neutral-700 transition-colors"
              >
                Inspect Final Adaptation Diff
              </button>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/30"
              >
                View Learning Pulse →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Signature Adaptation Diff Modal */}
      <AdaptationDiff
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        plan={plan}
        decisions={decisions}
      />
    </main>
  );
}
