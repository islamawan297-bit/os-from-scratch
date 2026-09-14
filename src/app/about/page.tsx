"use client";

import React from "react";
import Link from "next/link";
import {
  Info,
  Cpu,
  Terminal,
  ShieldCheck,
  Code2,
  Users,
  Sparkles,
  ArrowRight,
  Globe,
  Github,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-os-border pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-cyan/10 border border-os-cyan/30 text-os-cyan font-mono text-xs">
          <Info className="w-3.5 h-3.5" />
          <span>About the Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Demystifying <span className="os-gradient-text">Systems Engineering</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          &quot;Building an Operating System from Scratch&quot; is an open-access technical platform dedicated to educating software engineers, students, and low-level enthusiasts on how modern kernels operate from bare-metal hardware up.
        </p>
      </div>

      {/* Mission & Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 sm:p-8 rounded-xl bg-os-card border border-os-border space-y-4">
          <div className="w-10 h-10 rounded-lg bg-os-cyan/10 border border-os-cyan/30 flex items-center justify-center text-os-cyan">
            <Cpu className="w-5 h-5" />
          </div>

          <h2 className="font-mono text-xl font-bold text-white">Our Engineering Philosophy</h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Most computer science curricula teach operating systems abstractly through high-level slides. We believe the true way to master systems programming is by getting your hands dirty with real assembly code, page tables, registers, and memory allocators.
          </p>

          <p className="text-xs text-slate-400 font-sans">
            Our platform provides step-by-step guidance so you never get stuck on cryptic BIOS boot sector bugs or quiet QEMU reboot loops.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-os-card border border-os-border space-y-4">
          <div className="w-10 h-10 rounded-lg bg-os-violet/10 border border-os-violet/30 flex items-center justify-center text-os-violet">
            <Code2 className="w-5 h-5" />
          </div>

          <h2 className="font-mono text-xl font-bold text-white">No Magic, Pure Bare-Metal</h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Every lesson includes standalone executable code blocks without third-party black-box dependencies. You control every byte written to 0x7C00 or 0xB8000.
          </p>

          <p className="text-xs text-slate-400 font-sans">
            We cover x86-64 real/protected/long mode, 64-bit PAE 4-level paging, IRQ handlers, buddy allocators, ELF parsing, and POSIX shell system calls.
          </p>
        </div>
      </div>

      {/* Target CPU Architectures Breakdown Table */}
      <OSWindow title="cpu_architectures_matrix.sys" badge="x86-64 / RISC-V / ARM64">
        <div className="space-y-4">
          <div className="font-mono text-xs font-semibold text-white uppercase border-b border-os-border pb-2">
            Target Architecture Technical Comparison
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead>
                <tr className="border-b border-os-border bg-os-surface/60 text-os-cyan">
                  <th className="p-3">Architecture</th>
                  <th className="p-3">Boot Standard</th>
                  <th className="p-3">Paging Model</th>
                  <th className="p-3">Key Registers</th>
                  <th className="p-3">Recommended For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border/60">
                <tr className="hover:bg-os-surface/40">
                  <td className="p-3 font-bold text-white">x86-64</td>
                  <td className="p-3">BIOS MBR / Multiboot2</td>
                  <td className="p-3 text-os-emerald">4-Level (PML4)</td>
                  <td className="p-3 text-slate-400">CR0, CR3, RAX, RSP</td>
                  <td className="p-3 text-os-cyan">PC & Intel/AMD Systems</td>
                </tr>
                <tr className="hover:bg-os-surface/40">
                  <td className="p-3 font-bold text-white">RISC-V (RV32I/64I)</td>
                  <td className="p-3">OpenSBI Firmware</td>
                  <td className="p-3 text-os-emerald">Sv32 / Sv39 Paging</td>
                  <td className="p-3 text-slate-400">satp, mstatus, mepc</td>
                  <td className="p-3 text-os-cyan">Open Hardware & Embedded</td>
                </tr>
                <tr className="hover:bg-os-surface/40">
                  <td className="p-3 font-bold text-white">ARM64 (AArch64)</td>
                  <td className="p-3">UEFI / DeviceTree</td>
                  <td className="p-3 text-os-emerald">ARMv8-A Stage 1/2</td>
                  <td className="p-3 text-slate-400">TTBR0_EL1, ESR_EL1</td>
                  <td className="p-3 text-os-cyan">Apple Silicon & Raspberry Pi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </OSWindow>

      {/* Contributors & Community */}
      <div className="p-8 rounded-xl bg-os-card border border-os-border space-y-6 text-center max-w-3xl mx-auto">
        <Users className="w-10 h-10 text-os-cyan mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold text-white">Join the Kernel Developer Community</h2>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          Connect with thousands of systems engineers, contribute reference kernel projects, or ask questions in our discussion forum.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/roadmap"
            className="px-6 py-2.5 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold hover:bg-os-cyan/90 transition-colors"
          >
            Start OS Roadmap
          </Link>
          <Link
            href="/contact"
            className="px-6 py-2.5 rounded-lg bg-os-surface border border-os-border text-white font-mono text-xs hover:border-os-cyan/40 transition-colors"
          >
            Contact Architect Team
          </Link>
        </div>
      </div>
    </div>
  );
}
