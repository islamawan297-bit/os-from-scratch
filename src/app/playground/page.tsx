"use client";

import React, { useState } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  Cpu,
  Monitor,
  Database,
  Terminal,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { PLAYGROUND_PRESETS } from "@/lib/data/mockData";

export default function PlaygroundPage() {
  const [selectedPreset, setSelectedPreset] = useState(PLAYGROUND_PRESETS[0]);
  const [code, setCode] = useState(PLAYGROUND_PRESETS[0].code);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState(PLAYGROUND_PRESETS[0].simulatedOutput);

  const handleSelectPreset = (preset: (typeof PLAYGROUND_PRESETS)[0]) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setOutput(preset.simulatedOutput);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, presetId: selectedPreset.id }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.output);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-4 border-b border-os-border pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-cyan/10 border border-os-cyan/30 text-os-cyan font-mono text-xs">
          <Code2 className="w-3.5 h-3.5" />
          <span>Interactive Assembly & C Kernel Emulator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Kernel Code <span className="os-gradient-text">Playground</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          Write and simulate x86 Assembly or C Kernel code directly in your browser. Inspect CPU register states (CR0, CR3, EAX, ESP, EIP), memory hex dumps, and 80x25 VGA text mode output in real time.
        </p>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="font-mono text-xs text-slate-400">Load Preset:</span>
          {PLAYGROUND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-all ${
                selectedPreset.id === preset.id
                  ? "bg-os-cyan/20 text-os-cyan border border-os-cyan/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]"
                  : "bg-os-surface text-slate-400 hover:text-white border border-os-border"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Code Editor | Right Hardware Telemetry & Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-6 space-y-4">
          <OSWindow title="kernel_source.asm" badge={selectedPreset.language.toUpperCase()}>
            <div className="space-y-4">
              {/* Controls Header */}
              <div className="flex items-center justify-between border-b border-os-border pb-3">
                <div className="font-mono text-xs font-semibold text-white">
                  Source Code Editor
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setCode(selectedPreset.code)}
                    className="p-1.5 rounded bg-os-surface border border-os-border text-slate-400 hover:text-white transition-colors"
                    title="Reset to Preset Default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleRunCode}
                    disabled={isExecuting}
                    className="px-4 py-1.5 rounded bg-os-cyan text-slate-950 font-mono text-xs font-bold flex items-center space-x-1.5 hover:bg-os-cyan/90 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{isExecuting ? "Simulating CPU..." : "Run Emulator"}</span>
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={16}
                  className="w-full p-4 rounded-xl bg-os-code border border-os-border font-mono text-xs text-os-cyan leading-relaxed focus:outline-none focus:border-os-cyan/60 resize-y"
                  spellCheck={false}
                />
              </div>

              <div className="font-mono text-[11px] text-slate-500 flex justify-between">
                <span>Lines: {code.split("\n").length}</span>
                <span>Language: {selectedPreset.language}</span>
              </div>
            </div>
          </OSWindow>
        </div>

        {/* Right Column: Simulated Hardware State, VGA Screen & Registers */}
        <div className="lg:col-span-6 space-y-6">
          {/* 80x25 Virtual VGA Text Mode Screen */}
          <OSWindow title="vga_display_0xB8000.crt" badge="VGA 80x25">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-os-border pb-2">
                <Monitor className="w-4 h-4 text-os-emerald" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  Virtual Text Matrix Screen
                </span>
              </div>

              <div className="p-4 rounded-lg bg-black border border-os-emerald/40 font-mono text-xs text-os-emerald min-h-[140px] space-y-1 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]">
                {output.vgaText.map((line, idx) => (
                  <div key={idx} className="whitespace-pre">
                    {line || " "}
                  </div>
                ))}
              </div>
            </div>
          </OSWindow>

          {/* CPU Register Inspector */}
          <OSWindow title="cpu_registers_inspector.sys" badge="Registers">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-os-border pb-2">
                <Cpu className="w-4 h-4 text-os-cyan" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  CPU Register State
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {Object.entries(output.registers).map(([reg, val], idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-os-code border border-os-border/70 flex flex-col justify-between"
                  >
                    <span className="text-slate-500 text-[10px] font-semibold">{reg}</span>
                    <span className="text-os-cyan font-bold truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </OSWindow>

          {/* Hex Memory Dump Inspector */}
          <OSWindow title="memory_hex_dump.ram" badge="RAM 0x7C00">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-os-border pb-2">
                <Database className="w-4 h-4 text-os-violet" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  Physical RAM Hex Viewer
                </span>
              </div>

              <div className="p-3 rounded-lg bg-os-code border border-os-border font-mono text-xs text-slate-300 space-y-1">
                {output.memoryHex.map((row, idx) => (
                  <div key={idx} className="flex space-x-3">
                    <span className="text-os-violet font-bold">{row.addr}</span>
                    <span className="text-slate-300">{row.bytes}</span>
                  </div>
                ))}
              </div>
            </div>
          </OSWindow>

          {/* Serial Execution Console */}
          <div className="p-4 rounded-xl bg-os-card border border-os-border space-y-2 font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-400 font-semibold border-b border-os-border pb-2">
              <Terminal className="w-4 h-4 text-os-cyan" />
              <span>SERIAL COM1 LOG MESSAGES:</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 max-h-[120px] overflow-y-auto">
              {output.logs.map((log, idx) => (
                <div key={idx} className="text-slate-400">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
