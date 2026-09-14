"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Map,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { ROADMAP_STEPS, RoadmapItem } from "@/lib/data/mockData";
import { getCompletedRoadmapSteps, toggleRoadmapStepCompletion } from "@/lib/progress";

export default function RoadmapPage() {
  const [selectedArch, setSelectedArch] = useState<"x86-64" | "RISC-V" | "ARM64">("x86-64");
  const [activeStep, setActiveStep] = useState<RoadmapItem>(ROADMAP_STEPS[0]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setCompletedSteps(getCompletedRoadmapSteps());
    const handleUpdate = () => setCompletedSteps(getCompletedRoadmapSteps());
    window.addEventListener("os_progress_updated", handleUpdate);
    return () => window.removeEventListener("os_progress_updated", handleUpdate);
  }, []);

  const handleToggleStep = (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRoadmapStepCompletion(stepId);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeStep.codeExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / ROADMAP_STEPS.length) * 100);

  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-os-border pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-cyan/10 border border-os-cyan/30 text-os-cyan font-mono text-xs">
              <Map className="w-3.5 h-3.5" />
              <span>Interactive System Engineering Path</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              OS Kernel Development <span className="os-gradient-text">Roadmap</span>
            </h1>
          </div>

          {/* Progress Bar Card */}
          <div className="p-4 rounded-xl bg-os-card border border-os-border font-mono text-xs space-y-2 min-w-[220px]">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Overall Progress</span>
              <span className="text-os-cyan">{progressPercent}%</span>
            </div>
            <div className="w-full bg-os-surface h-2 rounded-full overflow-hidden border border-os-border">
              <div
                className="bg-gradient-to-r from-os-cyan to-os-emerald h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 text-right">
              {completedCount} of {ROADMAP_STEPS.length} Stages Mastered
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          Follow our proven step-by-step engineering trajectory to construct an operating system from 16-bit real mode BIOS vectors to 64-bit multi-tasking kernel execution.
        </p>

        {/* Architecture Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="font-mono text-xs text-slate-400">Target CPU Arch:</span>
          {(["x86-64", "RISC-V", "ARM64"] as const).map((arch) => (
            <button
              key={arch}
              onClick={() => setSelectedArch(arch)}
              className={`px-3.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
                selectedArch === arch
                  ? "bg-os-cyan/20 text-os-cyan border border-os-cyan/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]"
                  : "bg-os-surface text-slate-400 hover:text-white border border-os-border"
              }`}
            >
              {arch}
            </button>
          ))}
        </div>
      </div>

      {/* Main Roadmap Timeline & Detail Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timeline Stage Steps */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="font-mono text-xs text-os-cyan uppercase tracking-wider mb-2">
            // Sequential Build Stages ({ROADMAP_STEPS.length})
          </h2>

          <div className="space-y-2">
            {ROADMAP_STEPS.map((step) => {
              const isSelected = activeStep.id === step.id;
              const isDone = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-os-surface/90 border-os-cyan shadow-[0_0_20px_rgba(0,242,254,0.15)]"
                      : "bg-os-card/70 border-os-border hover:border-os-cyan/40 hover:bg-os-surface/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => handleToggleStep(step.id, e)}
                        className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-os-emerald text-slate-950 font-bold"
                            : isSelected
                            ? "bg-os-cyan text-slate-950"
                            : "bg-os-surface text-slate-400 border border-os-border hover:border-os-emerald"
                        }`}
                        title={isDone ? "Mark as Incomplete" : "Mark Stage as Completed"}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                      </button>

                      <div>
                        <div
                          className={`font-mono text-xs font-semibold ${
                            isDone ? "text-os-emerald line-through" : "text-white"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{step.category}</div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-os-cyan translate-x-1" : "text-slate-600"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage Detail & Memory/Registers Inspector */}
        <div className="lg:col-span-7">
          <OSWindow
            title={`Stage ${activeStep.stepNumber}: ${activeStep.slug}.asm`}
            badge={selectedArch}
          >
            <div className="space-y-6">
              {/* Header Info & Completion Toggle */}
              <div className="space-y-3 border-b border-os-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-os-cyan font-bold">
                    {activeStep.title}
                  </span>
                  <button
                    onClick={(e) => handleToggleStep(activeStep.id, e)}
                    className={`px-3 py-1 rounded font-mono text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      completedSteps.includes(activeStep.id)
                        ? "bg-os-emerald/20 text-os-emerald border-os-emerald/40"
                        : "bg-os-surface text-slate-400 border-os-border hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {completedSteps.includes(activeStep.id) ? "Stage Mastered" : "Mark Completed"}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeStep.overview}
                </p>
              </div>

              {/* Hardware Telemetry: Registers & Memory Range */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 rounded-lg bg-os-code border border-os-border space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">
                    CPU Registers Modified:
                  </div>
                  <div className="text-os-cyan flex flex-wrap gap-1">
                    {activeStep.registersAffected.map((reg, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-os-surface border border-os-border">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-os-code border border-os-border space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">
                    Memory Segment Range:
                  </div>
                  <div className="text-os-emerald font-bold">{activeStep.memoryRange}</div>
                </div>
              </div>

              {/* Key Concepts List */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  Key Engineering Concepts:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeStep.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-os-surface/60 border border-os-border/50 text-xs text-slate-300 flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-os-cyan shrink-0" />
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Example Snippet & Copy Action */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                    Reference Source Code:
                  </h4>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCopyCode}
                      className="font-mono text-[11px] text-slate-400 hover:text-os-cyan flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-os-emerald" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>
                    <Link
                      href="/playground"
                      className="font-mono text-[11px] text-os-cyan hover:underline flex items-center gap-1"
                    >
                      <Code2 className="w-3 h-3" />
                      <span>Run in Sandbox</span>
                    </Link>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-os-code border border-os-border overflow-x-auto font-mono text-xs text-slate-300">
                  <pre className="text-os-cyan">
                    <code>{activeStep.codeExample}</code>
                  </pre>
                </div>
              </div>

              {/* Related Lesson Link */}
              <div className="pt-4 border-t border-os-border flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <BookOpen className="w-4 h-4 text-os-cyan" />
                  <span>Deep-dive tutorial available</span>
                </div>
                <Link
                  href="/lessons"
                  className="px-4 py-2 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-os-cyan/90 transition-colors"
                >
                  <span>Read Stage Tutorial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </OSWindow>
        </div>
      </div>
    </div>
  );
}
