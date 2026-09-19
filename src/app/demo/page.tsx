"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  Layers, 
  ArrowRight, 
  Eye, 
  Clock, 
  Target, 
  Type, 
  Zap,
  Activity,
  Database,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { api, AdaptationDecision, LearningSession } from "@/lib/api";
import { AdaptationDiff } from "@/components/adaptation-diff";

const DEMO_STEPS = [
  { step: 1, title: "Initial Baseline", desc: "Default one-size-fits-all lesson presentation (10 min, reading, high focus)." },
  { step: 2, title: "Learner Constraints", desc: "Learner indicates 5 min window, Low Focus, and Dyslexia needs." },
  { step: 3, title: "Engine Computation", desc: "Backend AdaptiveLearningEngine evaluates multi-signal constraints." },
  { step: 4, title: "Live Transformation", desc: "UI morphs to Visual Diagram mode, relaxed spacing, and reduced cognitive load." },
  { step: 5, title: "Explainable Audit", desc: "Aura generates explainable adaptation diff with verified reasons." },
  { step: 6, title: "Confidence Loop", desc: "Learner marks confidence as 2/5 -> Aura instantly pivots to Real-World Analogy." },
  { step: 7, title: "Outcome & Impact", desc: "Session successfully completed with zero cognitive dropout." },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [session, setSession] = useState<LearningSession | null>(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [decisions, setDecisions] = useState<AdaptationDecision[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function init() {
      const s = await api.startSession(1, "lesson_sound_waves");
      setSession(s);
      const decs = await api.getSessionDecisions(s.id);
      setDecisions(decs);
    }
    init();
  }, []);

  const runStep = async (stepNum: number) => {
    setCurrentStep(stepNum);
    if (!session) return;

    if (stepNum === 2) {
      // Step 2: Change profile state
      const updated = await api.adaptSession(session.id, {
        timeAvailable: "5m",
        focusLevel: "LOW",
        preference: "VISUAL",
      });
      setSession(updated);
    } else if (stepNum === 4) {
      // Step 4: Add accessibility
      const updated = await api.adaptSession(session.id, {
        accessibility: {
          dyslexiaFriendly: true,
          highContrast: false,
          largeText: true,
          increasedSpacing: true,
          reducedMotion: true,
          focusMode: false,
        },
      });
      setSession(updated);
      const decs = await api.getSessionDecisions(session.id);
      setDecisions(decs);
    } else if (stepNum === 5) {
      setIsDiffOpen(true);
    } else if (stepNum === 6) {
      setIsDiffOpen(false);
      const updated = await api.recordConfidence(session.id, 2, session.concepts[0]?.id);
      setSession(updated);
      const decs = await api.getSessionDecisions(session.id);
      setDecisions(decs);
    } else if (stepNum === 7) {
      const completed = await api.completeSession(session.id);
      setSession(completed);
    }
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(1);

    let step = 1;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step <= 7) {
        runStep(step);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
      }
    }, 4500);
  };

  const resetDemo = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsDiffOpen(false);
    setCurrentStep(1);
    const s = await api.startSession(2, "lesson_sound_waves"); // Arjun default
    setSession(s);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                JUDGE SHOWCASE
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-neutral-400 font-mono">30–60s Automated Sequence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Aura Live Demonstration Flow
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Witness the exact transformation: a single learning objective reconstructed on-the-fly around learner time, focus, and neurodivergent accessibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetDemo}
              className="p-3 rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Reset Demo"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={startDemo}
              disabled={isPlaying}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isPlaying ? `Step ${currentStep} of 7...` : "Run Aura Demo"}</span>
            </button>
          </div>
        </div>

        {/* Step Progress Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {DEMO_STEPS.map((s) => {
            const isCurrent = currentStep === s.step;
            const isPast = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => runStep(s.step)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? "border-purple-500 bg-purple-500/15 shadow-md shadow-purple-900/20"
                    : isPast
                    ? "border-neutral-800 bg-neutral-900/80 text-neutral-300"
                    : "border-neutral-900 bg-neutral-950/40 text-neutral-600"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span>0{s.step}</span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-semibold text-xs text-white truncate">{s.title}</div>
              </button>
            );
          })}
        </div>

        {/* Main Live Stage Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Controller State */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Live Engine State
              </span>
              <span className="text-[10px] font-mono text-emerald-400">ACTIVE SESSION</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                <span className="text-neutral-500">Learner ID:</span>
                <span className="text-white font-semibold">Maya Chen (042)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                <span className="text-neutral-500">Active Layout:</span>
                <span className="text-purple-400 font-semibold">{session?.activeLayout || "VISUAL"}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                <span className="text-neutral-500">Time Window:</span>
                <span className="text-emerald-400 font-semibold">{session?.activeTimePreference || "5m"}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                <span className="text-neutral-500">Focus State:</span>
                <span className="text-amber-400 font-semibold">{session?.activeFocusLevel || "LOW"}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                <span className="text-neutral-500">Explanation Mode:</span>
                <span className="text-cyan-400 font-semibold">{session?.activeExplanationStrategy || "ANALOGY"}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                <span className="text-neutral-500">Adaptation Count:</span>
                <span className="text-white font-semibold">{session?.totalAdaptations || 4} Rules Fired</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsDiffOpen(true)}
                className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Open "See What Changed" Diff</span>
              </button>
            </div>
          </div>

          {/* Rendered Live Transformation Screen */}
          <div className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {DEMO_STEPS[currentStep - 1]?.title}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {DEMO_STEPS[currentStep - 1]?.desc}
                </h3>
              </div>
              <Link
                href="/learn"
                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 font-semibold"
              >
                Open Full Screen Room →
              </Link>
            </div>

            {/* Visual Transformation Preview */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400">The Physics of Sound Waves</span>
                <span className="text-neutral-500">Concept 1 of {session?.concepts?.length || 1}</span>
              </div>

              {session?.activeLayout === "VISUAL" ? (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl border border-purple-500/40 bg-purple-950/20 text-center">
                    <p className="text-xs font-mono text-purple-300 uppercase mb-1">Visual Schematic Node</p>
                    <p className="text-sm sm:text-base font-semibold text-emerald-300 font-mono">
                      {"Vibrating Source ──> Molecular Compression Grid ──> Ear Tympanum"}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {session?.activeExplanationStrategy === "ANALOGY"
                      ? "Think of sound like a line of dominoes falling into each other. If there are no dominoes (a vacuum like space), the knock cannot reach your ear."
                      : "Sound is a mechanical longitudinal wave requiring physical particulate matter to transfer energy via cyclical compression."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                    Dense Reading Format (Enforced 10 minutes)
                  </div>
                  <p className="text-sm text-neutral-400 leading-loose">
                    A sound wave is the pattern of disturbance caused by the movement of energy traveling through a medium (such as air, water, or any other liquid or solid matter) as it propagates away from the source...
                  </p>
                </div>
              )}
            </div>

            {/* Audit List of Fired Decisions */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold block mb-2">
                Engine Audit Log (Live Reasoning)
              </span>
              <div className="space-y-1 text-xs text-neutral-300">
                {session?.adaptationPlan?.humanReadableExplanations?.map((exp, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdaptationDiff
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        plan={session?.adaptationPlan}
        decisions={decisions}
      />
    </main>
  );
}
