"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Eye, 
  BookOpen, 
  Joystick, 
  Target, 
  Brain, 
  Zap, 
  SlidersHorizontal,
  Layers,
  CheckCircle2,
  Play,
  ShieldCheck,
  Award
} from "lucide-react";
import { useProfile } from "@/components/profile-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const { profile, updateProfile, setPersona, personas } = useProfile();
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<"2m" | "5m" | "10m">(profile.timeAvailable);
  const [selectedPref, setSelectedPref] = useState<"VISUAL" | "READING" | "PRACTICE">(profile.preference);
  const [selectedFocus, setSelectedFocus] = useState<"LOW" | "MEDIUM" | "HIGH">(profile.focusLevel);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLesson = async () => {
    setIsStarting(true);
    await updateProfile({
      timeAvailable: selectedTime,
      preference: selectedPref,
      focusLevel: selectedFocus,
    });
    router.push("/learn");
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center px-4 sm:px-6 pt-12 pb-24 relative overflow-hidden">
      {/* Subtle controlled gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-purple-950/20 via-neutral-950/0 to-transparent pointer-events-none blur-3xl" />

      {/* Hero Header */}
      <div className="z-10 flex flex-col items-center text-center max-w-4xl pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium">UN SDG 4 — Quality & Inclusive Education</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Learning should <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400">
            adapt to the learner.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mb-8 leading-relaxed font-normal">
          Aura changes how a lesson is delivered based on your time window, focus state, confidence signal, and neurodivergent accessibility needs.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-12">
          <button
            onClick={handleStartLesson}
            disabled={isStarting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
          >
            <span>{isStarting ? "Adapting Lesson..." : "Start Adaptive Lesson"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/demo"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-neutral-700 bg-neutral-900/80 text-white font-medium text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-purple-400" />
            <span>Watch Aura Adapt (45s Demo)</span>
          </Link>
        </div>

        {/* Visual Architecture Miniature: CONTEXT -> ENGINE -> LESSON */}
        <div className="w-full max-w-3xl rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-md mb-12 shadow-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-6 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            Adaptive Synthesis Pipeline
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* 1. Context */}
            <div className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/70 space-y-2">
              <span className="text-[11px] font-mono text-purple-400 font-semibold block">01 · INPUT SIGNALS</span>
              <h4 className="text-sm font-bold text-white">Learner Context</h4>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Available window ({selectedTime})</li>
                <li>• Focus level ({selectedFocus})</li>
                <li>• Learning style ({selectedPref})</li>
                <li>• Universal accessibility</li>
              </ul>
            </div>

            {/* 2. Engine */}
            <div className="p-4 rounded-2xl border border-purple-500/40 bg-purple-950/20 space-y-2">
              <span className="text-[11px] font-mono text-emerald-400 font-semibold block">02 · COMPUTATION</span>
              <h4 className="text-sm font-bold text-white">Adaptive Engine</h4>
              <ul className="text-xs text-neutral-300 space-y-1">
                <li>• Deterministic rules</li>
                <li>• Cognitive chunking</li>
                <li>• Strategy formulation</li>
                <li>• Explainable audit trail</li>
              </ul>
            </div>

            {/* 3. Output */}
            <div className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/70 space-y-2">
              <span className="text-[11px] font-mono text-blue-400 font-semibold block">03 · TRANSFORMATION</span>
              <h4 className="text-sm font-bold text-white">Tailored Experience</h4>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Visual diagram cards</li>
                <li>• Dyslexia spaced type</li>
                <li>• Confidence checkpoints</li>
                <li>• Active analogies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Learner Setup Module */}
        <div className="w-full max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-10 text-left space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Tell Aura how you learn right now.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Select your immediate conditions to reconstruct the sound waves lesson.
              </p>
            </div>

            {/* Persona Quick Preset */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">Quick Preset:</span>
              {personas.map((p) => (
                <button
                  key={p.username}
                  onClick={() => {
                    setPersona(p.username);
                    setSelectedTime(p.timeAvailable);
                    setSelectedPref(p.preference);
                    setSelectedFocus(p.focusLevel);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    profile.username === p.username
                      ? "bg-purple-500/20 border-purple-500 text-white"
                      : "bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {p.displayName.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3 block">
                1. Time Available
              </label>
              <div className="space-y-2">
                {(["2m", "5m", "10m"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      selectedTime === t
                        ? "bg-purple-500/20 border-purple-500 text-white"
                        : "bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      {t === "2m" ? "2 Minutes (Micro)" : t === "5m" ? "5 Minutes (Paced)" : "10 Minutes (Standard)"}
                    </span>
                    {selectedTime === t && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Preference */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3 block">
                2. Presentation Style
              </label>
              <div className="space-y-2">
                {[
                  { id: "VISUAL", label: "Visual & Diagrams", icon: Eye },
                  { id: "READING", label: "Structured Reading", icon: BookOpen },
                  { id: "PRACTICE", label: "Active Practice First", icon: Joystick },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedPref(id as any)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      selectedPref === id
                        ? "bg-purple-500/20 border-purple-500 text-white"
                        : "bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-400" />
                      {label}
                    </span>
                    {selectedPref === id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3 block">
                3. Cognitive Focus
              </label>
              <div className="space-y-2">
                {[
                  { id: "LOW", label: "Low Focus (Chunked)", icon: Target },
                  { id: "MEDIUM", label: "Medium Focus (Balanced)", icon: Target },
                  { id: "HIGH", label: "High Focus (Deep Dive)", icon: Brain },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedFocus(id as any)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      selectedFocus === id
                        ? "bg-purple-500/20 border-purple-500 text-white"
                        : "bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      {label}
                    </span>
                    {selectedFocus === id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Accessibility settings (Dyslexia, High Contrast, Motion) can be adjusted any time.</span>
            </div>

            <button
              onClick={handleStartLesson}
              disabled={isStarting}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
            >
              <span>Build My Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Impact & SDG 4 Anchor Links */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
          <Link href="/impact" className="hover:text-white underline underline-offset-4 transition-colors">
            Interactive SDG 4 Impact Simulation →
          </Link>
          <span className="text-neutral-700">·</span>
          <Link href="/dashboard" className="hover:text-white underline underline-offset-4 transition-colors">
            Your Learning Pulse Dashboard →
          </Link>
          <span className="text-neutral-700">·</span>
          <Link href="/demo" className="hover:text-purple-400 underline underline-offset-4 transition-colors font-semibold">
            Judge Showcase (45s Demo) →
          </Link>
        </div>
      </div>
    </main>
  );
}
