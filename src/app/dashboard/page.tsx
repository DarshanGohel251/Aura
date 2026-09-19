"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/components/profile-provider";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import { 
  ArrowLeft, 
  Flame, 
  Clock, 
  Brain, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Target,
  Eye,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { api, LearningSession } from "@/lib/api";

const mockRhythmData = [
  { day: "Mon", minutes: 12, adaptations: 4 },
  { day: "Tue", minutes: 8, adaptations: 3 },
  { day: "Wed", minutes: 18, adaptations: 6 },
  { day: "Thu", minutes: 10, adaptations: 4 },
  { day: "Fri", minutes: 6, adaptations: 2 },
  { day: "Sat", minutes: 22, adaptations: 7 },
  { day: "Sun", minutes: 15, adaptations: 5 },
];

export default function DashboardPage() {
  const { profile, currentPersona } = useProfile();
  const [sessions, setSessions] = useState<LearningSession[]>([]);

  useEffect(() => {
    async function load() {
      if (profile.id) {
        const hist = await api.getDashboardHistory(profile.id);
        setSessions(hist);
      }
    }
    load();
  }, [profile.id]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Your Learning Pulse
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Active Learner: <strong className="text-purple-300">{currentPersona.displayName}</strong> · Profile ID #{profile.id || 1}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Continue Learning →
            </Link>
          </div>
        </header>

        {/* Top 4 Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Weekly Minutes</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              91<span className="text-sm font-normal text-neutral-500">m</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Concepts Mastered</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">28</p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Current Streak</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              4<span className="text-sm font-normal text-neutral-500"> days</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Total Adaptations</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">31</p>
          </div>
        </div>

        {/* Learning Rhythm Chart & Simulated Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl border border-neutral-800 bg-neutral-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Learning Rhythm</h3>
                <p className="text-xs text-neutral-400">Daily learning volume and adaptation triggers</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-purple-500 inline-block" />
                <span>Minutes</span>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRhythmData}>
                  <XAxis dataKey="day" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "#262626" }}
                    contentStyle={{ backgroundColor: "#171717", border: "1px solid #404040", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Bar dataKey="minutes" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aura Insights */}
          <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/70 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">Aura Insights</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-neutral-300 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Pacing Efficiency
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    Your shortest sessions (2–5 min) exhibit a <strong className="text-white">43% higher completion rate</strong> than 10-minute sessions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-neutral-300 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Format Retention
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    You complete <strong className="text-white">Visual schematic lessons</strong> 1.8x faster with higher recorded confidence than reading columns.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800 justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Prototype Simulation · Behavioral Heuristic Model</span>
            </div>
          </div>
        </div>

        {/* Recent Session History (Backed by API) */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Recent Adaptive Sessions</h3>
              <p className="text-xs text-neutral-400">Verified session history persisted in database</p>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {sessions.length} Recorded
            </span>
          </div>

          <div className="space-y-2">
            {sessions.length > 0 ? (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-white text-sm">{s.lessonTitle}</div>
                    <div className="text-neutral-400 font-mono text-[11px]">
                      Session ID: {s.id} · {s.activeTimePreference} · {s.activeLayout} · {s.activeFocusLevel} Focus
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {s.totalAdaptations} Adaptations
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${
                      s.completed ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {s.completed ? "COMPLETED" : "IN PROGRESS"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                No previous sessions found. Start a lesson to record activity!
              </div>
            )}
          </div>
        </div>

        {/* Impact Lab Connection */}
        <div className="flex justify-center pt-4">
          <Link
            href="/impact"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            Explore Prototype Impact Simulation (SDG 4) →
          </Link>
        </div>
      </div>
    </main>
  );
}
