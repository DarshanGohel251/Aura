"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  HeartHandshake, 
  BookOpenCheck,
  RefreshCcw
} from "lucide-react";
import { api, ImpactSimulation } from "@/lib/api";

export default function ImpactPage() {
  const [cohortSize, setCohortSize] = useState(500);
  const [accessAdoption, setAccessAdoption] = useState(50);
  const [adaptiveAdoption, setAdaptiveAdoption] = useState(50);
  const [simulation, setSimulation] = useState<ImpactSimulation | null>(null);

  useEffect(() => {
    async function updateSim() {
      const result = await api.runImpactSimulation({
        cohortSize,
        accessibilityAdoption: accessAdoption,
        adaptiveAdoption: adaptiveAdoption,
        averageSessionMinutes: 5,
      });
      setSimulation(result);
    }
    updateSim();
  }, [cohortSize, accessAdoption, adaptiveAdoption]);

  const fixedComp = simulation?.fixedCompletionRate ?? 42;
  const adaptiveComp = simulation?.adaptiveCompletionRate ?? 72;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <header className="border-b border-neutral-800 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              UN SDG 4 · TARGET 4.5 & 4.6
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            From Product Features to Educational Impact
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-2xl">
            What happens when digital learning stops enforcing a rigid format and instead molds itself to neurodivergence, limited windows, and varying focus?
          </p>
        </header>

        {/* 4 Pillars of SDG 4 Alignment */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Accessibility</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Eliminates reading fatigue for dyslexia, visual impairment, and vestibular sensitivities with zero stigma.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Adaptability</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dynamically restructures knowledge into visual schematics, deep reading columns, or question-first practice.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>Inclusion</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Levels educational outcomes regardless of socioeconomic time scarcity or fluctuating attention windows.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <BookOpenCheck className="w-4 h-4" />
              <span>Lifelong Learning</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Transforms daunting courses into manageable, 2-minute repeatable micro-interactions that fit busy realities.
            </p>
          </div>
        </section>

        {/* Interactive Impact Simulator */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-10 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Prototype Impact Simulation
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Simulate learning behavior across diverse cohorts with varying adaptive adoption
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Prototype Simulation — Illustrative Data</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-medium mb-2">
                  <span className="text-neutral-300">Simulated Cohort Size</span>
                  <span className="font-mono text-purple-400 font-semibold">{cohortSize} Learners</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={cohortSize}
                  onChange={(e) => setCohortSize(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm font-medium mb-2">
                  <span className="text-neutral-300">Adaptive Engine Adoption</span>
                  <span className="font-mono text-purple-400 font-semibold">{adaptiveAdoption}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={adaptiveAdoption}
                  onChange={(e) => setAdaptiveAdoption(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>0% (Fixed Rigid LMS)</span>
                  <span>100% (Fully Adaptive)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm font-medium mb-2">
                  <span className="text-neutral-300">Accessibility Accommodation Rate</span>
                  <span className="font-mono text-purple-400 font-semibold">{accessAdoption}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={accessAdoption}
                  onChange={(e) => setAccessAdoption(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>Standard UI Only</span>
                  <span>Full WCAG AAA & Neurodivergent</span>
                </div>
              </div>
            </div>

            {/* Simulated Results Visualization */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span>Conventional Fixed LMS</span>
                  <span className="text-white">{fixedComp}% completion</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-600 transition-all" style={{ width: `${fixedComp}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-purple-300 mb-2">
                  <span>Aura Adaptive Environment</span>
                  <span className="font-bold text-emerald-400">{adaptiveComp}% completion</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${adaptiveComp}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80 text-xs">
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px] uppercase">Repeat Sessions</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">
                    {simulation?.repeatSessionRate}%
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px] uppercase">Est. Learning Minutes</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                    {simulation?.estimatedTotalLearningMinutes.toLocaleString()}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Aura Exists Section */}
        <section className="p-8 rounded-3xl border border-neutral-800 bg-neutral-900/40 space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Why Aura Exists: Breaking the Fixed-Format Barrier
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-3xl">
            In digital learning, failure is rarely a deficit of curiosity; it is a mismatch of format. When an overworked learner facing high cognitive load is handed an inflexible 45-minute reading block with dense typography, dropout occurs. Aura changes the fundamental thesis: the lesson must adapt to the human.
          </p>
        </section>
      </div>
    </main>
  );
}
