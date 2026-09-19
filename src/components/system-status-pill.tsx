"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useProfile } from "./profile-provider";
import { Activity, Database, Cpu, Radio, ShieldCheck, ChevronDown, UserCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function SystemStatusPill() {
  const [health, setHealth] = useState<{
    api: string;
    database: string;
    adaptationEngine: string;
    eventStream: string;
    isFallback?: boolean;
  }>({
    api: "CHECKING",
    database: "CHECKING",
    adaptationEngine: "CHECKING",
    eventStream: "CHECKING",
  });

  const [expanded, setExpanded] = useState(false);
  const { currentPersona, setPersona, personas } = useProfile();

  useEffect(() => {
    async function check() {
      const res = await api.checkHealth();
      setHealth(res);
    }
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health.api === "UP" && health.database === "UP";

  return (
    <div className="fixed top-4 right-4 z-50 text-xs font-mono">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 text-neutral-300 backdrop-blur-md hover:border-neutral-700 shadow-lg transition-all"
          aria-expanded={expanded}
          aria-label="Toggle Judge Mode System Status"
        >
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isHealthy ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isHealthy ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>
          <span className="font-semibold tracking-wider text-[11px] text-white">JUDGE MODE</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">{currentPersona.displayName}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        <Link
          href="/demo"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 font-semibold hover:bg-purple-500/20 transition-colors shadow-sm"
        >
          <Radio className="w-3.5 h-3.5 text-purple-400" />
          <span>Run Demo</span>
        </Link>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl text-neutral-300 space-y-4 font-sans"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <span className="font-semibold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Live System Health
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {health.isFallback ? "FALLBACK MODE" : "LIVE BACKEND"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Activity className="w-3.5 h-3.5 text-blue-400" /> API
                  </span>
                  <span className={health.api === "UP" ? "text-emerald-400" : "text-amber-400"}>
                    {health.api}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Database className="w-3.5 h-3.5 text-emerald-400" /> DB
                  </span>
                  <span className={health.database === "UP" ? "text-emerald-400" : "text-amber-400"}>
                    {health.database}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" /> Engine
                  </span>
                  <span className="text-emerald-400">{health.adaptationEngine}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" /> Stream
                  </span>
                  <span className="text-emerald-400">{health.eventStream}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-neutral-400 mb-2 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Select Seeded Persona
              </div>
              <div className="space-y-1.5">
                {personas.map((p) => (
                  <button
                    key={p.username}
                    onClick={() => setPersona(p.username)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors border ${
                      currentPersona.username === p.username
                        ? "bg-purple-500/10 border-purple-500/50 text-white font-medium"
                        : "bg-neutral-950/40 border-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{p.displayName}</div>
                      <div className="text-[10px] text-neutral-400">
                        {p.timeAvailable} · {p.preference} · {p.focusLevel} Focus
                      </div>
                    </div>
                    {currentPersona.username === p.username && (
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-[11px]">
              <Link href="/demo" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
                Launch 45s Scripted Demo →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
