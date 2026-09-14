"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Map, FolderGit2, ArrowRight } from "lucide-react";
import { LESSONS_DATA, ROADMAP_STEPS, OS_PROJECTS } from "@/lib/data/mockData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filteredLessons = LESSONS_DATA.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRoadmap = ROADMAP_STEPS.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.overview.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = OS_PROJECTS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = filteredLessons.length + filteredRoadmap.length + filteredProjects.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-os-border bg-os-card shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-os-border bg-os-surface/50">
          <Search className="w-5 h-5 text-os-cyan mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bootloader, paging, GDT, kernel drivers, lessons..."
            className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-os-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() === "" ? (
            <div className="text-center py-8 text-slate-400 font-mono text-xs">
              Type to search operating system concepts, lessons, architecture & projects...
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-400 font-mono text-xs">
              No matching kernel topics found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {/* Lessons */}
              {filteredLessons.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs font-semibold text-os-cyan uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Lessons ({filteredLessons.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredLessons.map((l) => (
                      <Link
                        key={l.id}
                        href={`/lessons/${l.slug}`}
                        onClick={onClose}
                        className="p-2.5 rounded-lg bg-os-surface/50 hover:bg-os-surface border border-os-border/50 hover:border-os-cyan/40 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-mono text-xs font-medium text-white group-hover:text-os-cyan">
                            {l.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {l.summary}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-os-cyan group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmap */}
              {filteredRoadmap.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs font-semibold text-os-emerald uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5" /> Roadmap Stages ({filteredRoadmap.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredRoadmap.map((r) => (
                      <Link
                        key={r.id}
                        href="/roadmap"
                        onClick={onClose}
                        className="p-2.5 rounded-lg bg-os-surface/50 hover:bg-os-surface border border-os-border/50 hover:border-os-emerald/40 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-mono text-xs font-medium text-white group-hover:text-os-emerald">
                            {r.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {r.overview}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-os-emerald group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {filteredProjects.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs font-semibold text-os-violet uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" /> Open Source Projects ({filteredProjects.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredProjects.map((p) => (
                      <Link
                        key={p.id}
                        href="/projects"
                        onClick={onClose}
                        className="p-2.5 rounded-lg bg-os-surface/50 hover:bg-os-surface border border-os-border/50 hover:border-os-violet/40 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-mono text-xs font-medium text-white group-hover:text-os-violet">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {p.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-os-violet group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-2 border-t border-os-border bg-os-bg flex items-center justify-between font-mono text-[10px] text-slate-500">
          <span>Search index: v0.9.4 Kernel Docs</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
