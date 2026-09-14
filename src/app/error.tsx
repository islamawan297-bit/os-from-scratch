"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Terminal } from "lucide-react";
import OSWindow from "@/components/OSWindow";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Kernel Exception Caught:", error);
  }, [error]);

  return (
    <div className="py-12 max-w-2xl mx-auto space-y-6">
      <OSWindow title="kernel_panic_recovery.sys" badge="PANIC #0x0E">
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-rose-500 font-bold border-b border-os-border pb-2">
            <AlertTriangle className="w-5 h-5" />
            <span>KERNEL PANIC: UNHANDLED EXCEPTION DETECTED</span>
          </div>

          <div className="p-3 rounded-lg bg-black border border-rose-500/40 text-rose-400 space-y-1">
            <div>CR2 Faulting Address: 0x0000000000000000</div>
            <div>Error Message: {error.message || "General Protection Fault"}</div>
            {error.digest && <div>Digest Code: {error.digest}</div>}
          </div>

          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            The kernel encountered an unexpected runtime state. You can issue a reboot signal to restart the system process safely.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold flex items-center space-x-1.5 hover:bg-os-cyan/90 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Issue Soft Reset</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-os-surface border border-os-border text-white font-mono text-xs hover:border-os-cyan/40 flex items-center space-x-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Kernel Home</span>
            </Link>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
