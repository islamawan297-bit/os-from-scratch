"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Github,
  CheckCircle2,
  Terminal,
  Cpu,
  ArrowRight,
  ExternalLink,
  Code2,
  Bookmark,
  Check,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { OS_PROJECTS, ProjectItem } from "@/lib/data/mockData";
import { useAuth } from "@/components/AuthProvider";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(OS_PROJECTS[0]);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [copiedSetup, setCopiedSetup] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/user/projects")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.projects) {
            setSavedProjectIds(data.projects.map((p: any) => p.project.slug));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleToggleSaveProject = async () => {
    if (!user) {
      alert("Please log in to save reference projects to your user profile.");
      return;
    }

    try {
      const res = await fetch("/api/user/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug: selectedProject.slug }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.isSaved) {
          setSavedProjectIds((prev) => [...prev, selectedProject.slug]);
        } else {
          setSavedProjectIds((prev) => prev.filter((slug) => slug !== selectedProject.slug));
        }
      }
    } catch (e) {
      console.error("Failed to save project", e);
    }
  };

  const handleCopySetup = () => {
    navigator.clipboard.writeText(selectedProject.setupGuide);
    setCopiedSetup(true);
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  const isSaved = savedProjectIds.includes(selectedProject.slug);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-os-border pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-emerald/10 border border-os-emerald/30 text-os-emerald font-mono text-xs">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Open-Source Reference Operating Systems</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          OS Projects <span className="os-gradient-text">Showcase</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          Explore complete open-source kernel projects, bootloaders, file system drivers, and RISC-V microkernels built using the concepts taught on this platform.
        </p>
      </div>

      {/* Main Grid: Projects List Cards | Selected Project Deep Spec Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Projects Catalog */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-mono text-xs text-os-emerald uppercase tracking-wider">
            // Select Project ({OS_PROJECTS.length})
          </h2>

          <div className="space-y-3">
            {OS_PROJECTS.map((proj) => {
              const isSelected = selectedProject.id === proj.id;
              const isProjSaved = savedProjectIds.includes(proj.slug);
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`p-5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-os-surface/90 border-os-emerald shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "bg-os-card/70 border-os-border hover:border-os-emerald/40 hover:bg-os-surface/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-bg border border-os-border text-os-emerald">
                      {proj.difficulty}
                    </span>

                    <div className="flex items-center space-x-2">
                      {isProjSaved && (
                        <span className="font-mono text-[10px] text-os-cyan font-bold flex items-center gap-1">
                          <Bookmark className="w-3 h-3 fill-os-cyan" />
                          Saved
                        </span>
                      )}
                      <div className="flex space-x-1">
                        {proj.techStack.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="font-mono text-[10px] text-slate-400">
                            {t}
                            {idx === 0 ? " •" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-mono text-base font-bold text-white mt-2">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Project Architecture & Setup Inspector */}
        <div className="lg:col-span-7">
          <OSWindow
            title={`project_specs_${selectedProject.slug}.md`}
            badge={selectedProject.difficulty}
          >
            <div className="space-y-6">
              {/* Title & Github Action */}
              <div className="space-y-3 border-b border-os-border pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="font-mono text-xl font-bold text-white">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleToggleSaveProject}
                      className={`px-3 py-1 rounded border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSaved
                          ? "bg-os-cyan/20 text-os-cyan border-os-cyan/40"
                          : "bg-os-surface text-slate-300 border-os-border hover:text-white"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-os-cyan" : ""}`} />
                      <span>{isSaved ? "Saved" : "Save Project"}</span>
                    </button>

                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-os-surface border border-os-border hover:border-os-emerald/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedProject.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-bg border border-os-border text-os-cyan"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  Key Kernel Capabilities:
                </h4>
                <div className="space-y-1.5">
                  {selectedProject.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-os-surface/60 border border-os-border/50 text-xs text-slate-300 flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-os-emerald shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Specifications */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  Architecture Specifications:
                </h4>
                <div className="p-3 rounded-lg bg-os-surface border border-os-border text-xs text-slate-300 font-sans leading-relaxed">
                  {selectedProject.architectureSpecs}
                </div>
              </div>

              {/* Build & Setup Terminal Instructions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                    Local Setup & QEMU Build Commands:
                  </h4>
                  <button
                    onClick={handleCopySetup}
                    className="font-mono text-[11px] text-slate-400 hover:text-os-emerald flex items-center gap-1 transition-colors"
                  >
                    {copiedSetup ? <Check className="w-3 h-3 text-os-emerald" /> : <Terminal className="w-3 h-3" />}
                    <span>{copiedSetup ? "Copied!" : "Copy Commands"}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-os-code border border-os-border font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre className="text-os-emerald">
                    <code>{selectedProject.setupGuide}</code>
                  </pre>
                </div>
              </div>
            </div>
          </OSWindow>
        </div>
      </div>
    </div>
  );
}
