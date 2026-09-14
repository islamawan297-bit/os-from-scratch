"use client";

import React from "react";
import { Cpu, Terminal } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-mono">
      <div className="w-12 h-12 rounded-xl bg-os-cyan/10 border border-os-cyan/40 flex items-center justify-center text-os-cyan animate-pulse">
        <Cpu className="w-6 h-6 animate-spin" />
      </div>

      <div className="text-sm text-os-cyan font-bold flex items-center space-x-2">
        <Terminal className="w-4 h-4" />
        <span>INITIALIZING KERNEL ENVIRONMENT...</span>
      </div>

      <div className="w-48 bg-os-surface h-1.5 rounded-full overflow-hidden border border-os-border">
        <div className="bg-gradient-to-r from-os-cyan to-os-emerald h-full w-2/3 animate-pulse" />
      </div>

      <div className="text-[11px] text-slate-500">
        [BIOS] Loading PML4 Paging & GDT Tables...
      </div>
    </div>
  );
}
