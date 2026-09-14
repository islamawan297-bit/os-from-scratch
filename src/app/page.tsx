"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  ArrowRight,
  Cpu,
  Layers,
  HardDrive,
  Code2,
  CheckCircle2,
  ShieldAlert,
  Zap,
  BookOpen,
  Map,
  Sparkles,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { LESSONS_DATA, ROADMAP_STEPS, OS_PROJECTS } from "@/lib/data/mockData";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"asm" | "c">("asm");
  const [simulatedLog, setSimulatedLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const asmCode = `; x86 16-bit Bootloader
[org 0x7c00]
mov si, msg
print_loop:
    lodsb
    or al, al
    jz done
    mov ah, 0x0e
    int 0x10
    jmp print_loop
done:
    cli
    hlt
msg: db "BOOTING OS KERNEL V0.9...", 0
times 510-($-$$) db 0
dw 0xaa55`;

  const cCode = `// 64-bit Paging Setup
#define PAGE_PRESENT (1 << 0)
#define PAGE_WRITABLE (1 << 1)

void init_paging(void) {
    pml4[0] = (uint64_t)pdpt | PAGE_PRESENT | PAGE_WRITABLE;
    pdpt[0] = (uint64_t)pd   | PAGE_PRESENT | PAGE_WRITABLE;
    asm volatile("mov %0, %%cr3" : : "r"(pml4));
}`;

  const handleSimulate = () => {
    setIsRunning(true);
    setSimulatedLog(["[CPU] Power-On Self-Test (POST)..."]);

    setTimeout(() => {
      setSimulatedLog((prev) => [...prev, "[BIOS] Loading MBR sector @ 0x7C00"]);
    }, 400);

    setTimeout(() => {
      setSimulatedLog((prev) => [
        ...prev,
        "[BIOS] Magic 0xAA55 verified!",
        "[TTY] Video Interrupt 0x10 -> RENDER: 'BOOTING OS KERNEL V0.9...'",
      ]);
    }, 800);

    setTimeout(() => {
      setSimulatedLog((prev) => [
        ...prev,
        "[CPU] Execution Halted (HLT instruction reached)",
        "[SYS_OK] Virtual Sandbox execution complete!",
      ]);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-20 pb-12">
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Glow backdrop effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-os-cyan/15 via-os-violet/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-os-cyan/10 border border-os-cyan/30 text-os-cyan font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Full-Stack Bare Metal Engineering Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Building an <span className="os-gradient-text">Operating System</span> from Scratch
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Master low-level systems engineering from raw hardware boot vectors to 64-bit multi-tasking kernels, memory paging, interrupt handlers, virtual file systems, and userland shells.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/roadmap"
                className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-os-cyan to-blue-500 text-slate-950 font-mono text-sm font-bold flex items-center space-x-2 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-105 transition-all"
              >
                <Map className="w-4 h-4" />
                <span>Explore OS Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/playground"
                className="px-6 py-3.5 rounded-lg bg-os-surface border border-os-border hover:border-os-cyan/40 text-white font-mono text-sm font-semibold flex items-center space-x-2 hover:bg-os-surface/80 transition-all"
              >
                <Code2 className="w-4 h-4 text-os-cyan" />
                <span>Launch Emulator</span>
              </Link>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-os-border/60 font-mono">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">7 Stages</div>
                <div className="text-[11px] text-slate-400">Boot to Userland</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-os-cyan">x86-64 / RISC-V</div>
                <div className="text-[11px] text-slate-400">Target Architectures</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-os-emerald">100% Interactive</div>
                <div className="text-[11px] text-slate-400">Live Web Playground</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Live Interactive Terminal Sandbox */}
          <div className="lg:col-span-5">
            <OSWindow title="bootloader_sandbox.asm" badge="x86 Real Mode">
              <div className="space-y-4">
                {/* Code selector tabs */}
                <div className="flex items-center justify-between border-b border-os-border pb-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab("asm")}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        activeTab === "asm"
                          ? "bg-os-cyan/20 text-os-cyan border border-os-cyan/40"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Assembly MBR
                    </button>
                    <button
                      onClick={() => setActiveTab("c")}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        activeTab === "c"
                          ? "bg-os-violet/20 text-os-violet border border-os-violet/40"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Paging C
                    </button>
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={isRunning}
                    className="px-3 py-1 rounded bg-os-emerald/20 hover:bg-os-emerald/30 border border-os-emerald/40 text-os-emerald font-mono text-xs font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <Play className="w-3 h-3 fill-os-emerald" />
                    <span>{isRunning ? "Executing..." : "Boot Kernel"}</span>
                  </button>
                </div>

                {/* Code Box */}
                <div className="p-3 rounded-md bg-os-code border border-os-border font-mono text-xs text-slate-300 overflow-x-auto max-h-[220px]">
                  <pre className="text-os-cyan/90">
                    <code>{activeTab === "asm" ? asmCode : cCode}</code>
                  </pre>
                </div>

                {/* Simulated Terminal Log */}
                <div className="p-3 rounded-md bg-black/80 border border-os-border font-mono text-[11px] text-slate-300 min-h-[100px] space-y-1">
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    &gt; CPU Serial Output Console:
                  </div>
                  {simulatedLog.length === 0 ? (
                    <div className="text-slate-500 italic">
                      Click &quot;Boot Kernel&quot; to execute real-time CPU simulation...
                    </div>
                  ) : (
                    simulatedLog.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.includes("SYS_OK")
                            ? "text-os-emerald font-semibold"
                            : log.includes("TTY")
                            ? "text-os-cyan"
                            : "text-slate-300"
                        }
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </OSWindow>
          </div>
        </div>
      </section>

      {/* CORE SYSTEM PILLARS */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs font-mono text-os-cyan uppercase tracking-widest">
            // Core Architecture Modules
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Everything Required to Build a Real Kernel
          </h3>
          <p className="text-sm text-slate-400">
            From bare-metal CPU hardware vectors to high-level process scheduling and virtual file systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-os-card border border-os-border hover:border-os-cyan/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-os-cyan/10 border border-os-cyan/30 flex items-center justify-center text-os-cyan group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-mono text-base font-semibold text-white">
              01. Bootloader & GDT
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand BIOS interrupt vectors, Master Boot Record (MBR), 16-bit real mode memory segmentation, and switching to 32-bit protected mode.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-os-card border border-os-border hover:border-os-violet/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-os-violet/10 border border-os-violet/30 flex items-center justify-center text-os-violet group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-mono text-base font-semibold text-white">
              02. 64-Bit Paging & Heap
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build 4-level x86-64 page tables (PML4, PDPT, PD, PT), set CR3 base address, identity mapping, and design physical buddy & slab heap allocators.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-os-card border border-os-border hover:border-os-emerald/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-os-emerald/10 border border-os-emerald/30 flex items-center justify-center text-os-emerald group-hover:scale-110 transition-transform">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="font-mono text-base font-semibold text-white">
              03. Preemptive Scheduler & VFS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure LAPIC timer interrupts, preserve registers across task switches, parse ELF64 binaries, and mount virtual inode ramdisk filesystems.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED LESSONS & CURRICULUM */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-os-border pb-4">
          <div>
            <h2 className="font-mono text-xs text-os-cyan uppercase tracking-wider">
              // Step-by-Step Curriculum
            </h2>
            <h3 className="text-2xl font-bold text-white">Featured OS Engineering Lessons</h3>
          </div>
          <Link
            href="/lessons"
            className="font-mono text-xs text-os-cyan hover:underline flex items-center gap-1"
          >
            <span>View All Lessons ({LESSONS_DATA.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LESSONS_DATA.slice(0, 4).map((lesson) => (
            <div
              key={lesson.id}
              className="p-6 rounded-xl bg-os-card border border-os-border hover:border-os-cyan/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-surface border border-os-border text-os-cyan">
                    {lesson.level}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{lesson.duration}</span>
                </div>
                <h4 className="font-mono text-lg font-bold text-white hover:text-os-cyan transition-colors">
                  <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-os-border/60 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-500">{lesson.module}</span>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="font-mono text-xs text-os-cyan hover:text-white flex items-center gap-1 font-semibold"
                >
                  <span>Start Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE PLAYGROUND TEASER BANNER */}
      <section className="rounded-2xl border border-os-cyan/30 bg-gradient-to-r from-os-card via-os-surface to-os-card p-8 sm:p-10 relative overflow-hidden glass-panel-glow">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-emerald/20 text-os-emerald font-mono text-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Real-Time In-Browser Register & Memory Emulator</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Test Your Boot Sector & C Kernel Code Online
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
              Our emulator simulates 16-bit real mode interrupts, 32-bit CR0 switches, register states (EAX, EBX, ESP, EIP), memory hex dumps at 0x7C00, and 80x25 VGA text mode output without installing local toolchains!
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <Link
                href="/playground"
                className="px-6 py-3 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold flex items-center space-x-2 hover:bg-os-cyan/90 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              >
                <Code2 className="w-4 h-4" />
                <span>Open Interactive Playground</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="p-4 rounded-xl bg-os-code border border-os-border space-y-2 font-mono text-xs w-full max-w-xs">
              <div className="text-os-emerald font-semibold">&gt; REGISTER STATE:</div>
              <div className="text-slate-300">EAX: 0x0E00 | EBX: 0x0000</div>
              <div className="text-slate-300">ESP: 0x7C00 | EIP: 0x7C10</div>
              <div className="text-os-cyan">CR0: 0x00000010 (Real Mode)</div>
              <div className="text-slate-400">VRAM @ 0xB8000 OK</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-os-border pb-4">
          <div>
            <h2 className="font-mono text-xs text-os-emerald uppercase tracking-wider">
              // Reference Implementations
            </h2>
            <h3 className="text-2xl font-bold text-white">Open Source OS Projects</h3>
          </div>
          <Link
            href="/projects"
            className="font-mono text-xs text-os-emerald hover:underline flex items-center gap-1"
          >
            <span>View Projects Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OS_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-xl bg-os-card border border-os-border hover:border-os-emerald/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-surface text-os-emerald border border-os-emerald/30">
                    {proj.difficulty}
                  </span>
                  <div className="flex space-x-1.5">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-os-bg text-slate-400 border border-os-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="font-mono text-lg font-bold text-white">{proj.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>

                <div className="space-y-1">
                  {proj.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-os-emerald shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-os-border flex items-center justify-between">
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <span>Source Code</span>
                </a>
                <Link
                  href="/projects"
                  className="font-mono text-xs text-os-emerald font-semibold flex items-center gap-1"
                >
                  <span>Build Instructions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
