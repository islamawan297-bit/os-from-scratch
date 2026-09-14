"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Cpu,
  Terminal,
  Code2,
  HardDrive,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { ARCHITECTURE_LAYERS, ArchitectureLayer } from "@/lib/data/mockData";

export default function ArchitecturePage() {
  const [activeLayer, setActiveLayer] = useState<ArchitectureLayer>(ARCHITECTURE_LAYERS[0]);
  const [activeComponent, setActiveComponent] = useState(ARCHITECTURE_LAYERS[0].components[0]);

  const handleSelectLayer = (layer: ArchitectureLayer) => {
    setActiveLayer(layer);
    if (layer.components.length > 0) {
      setActiveComponent(layer.components[0]);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-os-border pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-violet/10 border border-os-violet/30 text-os-violet font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Subsystem Inspector</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          OS Subsystem <span className="os-gradient-text">Architecture</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          Explore the layered architectural layout of an operating system kernel. Click any layer or subsystem to inspect its C header declarations, CPU privilege rings, register flows, and data structures.
        </p>
      </div>

      {/* Main Interactive Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stacked Architectural Diagram Stack */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-mono text-xs text-os-violet uppercase tracking-wider">
            // Privilege Rings & Layer Stack
          </h2>

          <div className="space-y-3">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isSelected = activeLayer.id === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => handleSelectLayer(layer)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${
                    isSelected
                      ? "bg-os-surface/90 border-os-cyan shadow-[0_0_20px_rgba(0,242,254,0.15)]"
                      : "bg-os-card/70 border-os-border hover:border-os-cyan/40 hover:bg-os-surface/40"
                  }`}
                >
                  {/* Color Accent Pill */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: layer.color }}
                  />

                  <div className="flex items-center justify-between pl-2">
                    <div>
                      <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                        <span>{layer.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {layer.description}
                      </div>
                    </div>

                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-bg border border-os-border text-slate-400">
                      Layer {layer.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Layer Components & Subsystem Deep Inspector */}
        <div className="lg:col-span-7 space-y-6">
          <OSWindow
            title={`Architecture Inspector: ${activeLayer.name}`}
            badge={`Ring ${activeLayer.level === 1 ? "3 (User)" : activeLayer.level === 2 ? "3 -> 0" : "0 (Kernel)"}`}
          >
            <div className="space-y-6">
              {/* Layer Description */}
              <div className="space-y-2 border-b border-os-border pb-4">
                <h3 className="font-mono text-sm font-bold text-os-cyan">
                  {activeLayer.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeLayer.description}
                </p>
              </div>

              {/* Subsystems List Selector */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  Select Subsystem Component:
                </h4>

                <div className="flex flex-wrap gap-2">
                  {activeLayer.components.map((comp, idx) => {
                    const isCompSelected = activeComponent.name === comp.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveComponent(comp)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-all ${
                          isCompSelected
                            ? "bg-os-cyan/20 text-os-cyan border border-os-cyan/40"
                            : "bg-os-surface text-slate-400 hover:text-white border border-os-border"
                        }`}
                      >
                        {comp.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Component Details */}
              {activeComponent && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-os-surface/60 border border-os-border space-y-3">
                    <div className="flex items-center justify-between border-b border-os-border/60 pb-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {activeComponent.name}
                      </span>
                      <span className="font-mono text-[10px] text-os-emerald bg-os-bg px-2 py-0.5 rounded border border-os-border">
                        {activeComponent.headerFile}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans">
                      {activeComponent.description}
                    </p>

                    <div className="font-mono text-xs text-slate-400">
                      <span className="text-slate-500 font-semibold">Associated Hardware/Registers: </span>
                      <span className="text-os-cyan">{activeComponent.registers}</span>
                    </div>
                  </div>

                  {/* Header / Stub Code Snippet */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                        Implementation Code Snippet:
                      </h4>
                      <span className="font-mono text-[10px] text-slate-500">
                        {activeComponent.headerFile}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-os-code border border-os-border font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre className="text-os-cyan">
                        <code>{activeComponent.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </OSWindow>
        </div>
      </div>
    </div>
  );
}
