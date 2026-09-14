"use client";

import React from "react";
import { Terminal, Maximize2, Minimize2, X } from "lucide-react";

interface OSWindowProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
}

export default function OSWindow({
  title,
  subtitle,
  children,
  className = "",
  badge = "x86_64",
}: OSWindowProps) {
  return (
    <div
      className={`rounded-xl border border-os-border bg-os-card shadow-2xl overflow-hidden glass-panel ${className}`}
    >
      {/* OS Window Control Header Bar */}
      <div className="px-4 py-2.5 bg-os-surface/80 border-b border-os-border flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          {/* Mac / Terminal Window Buttons */}
          <div className="flex items-center space-x-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>

          <Terminal className="w-4 h-4 text-os-cyan" />
          <span className="font-mono text-xs font-semibold text-white tracking-wide">
            {title}
          </span>
          {subtitle && (
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
              — {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-bg border border-os-border text-os-cyan">
            {badge}
          </span>
        </div>
      </div>

      {/* Window Body */}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
