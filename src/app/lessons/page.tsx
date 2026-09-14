"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Clock, Award, Filter, Sparkles, CheckCircle2 } from "lucide-react";
import { LESSONS_DATA } from "@/lib/data/mockData";
import { getCompletedLessons } from "@/lib/progress";

export default function LessonsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    setCompletedLessons(getCompletedLessons());
    const handleUpdate = () => setCompletedLessons(getCompletedLessons());
    window.addEventListener("os_progress_updated", handleUpdate);
    return () => window.removeEventListener("os_progress_updated", handleUpdate);
  }, []);

  const filteredLessons = LESSONS_DATA.filter((lesson) => {
    const matchesLevel =
      selectedLevel === "All" || lesson.level.toLowerCase() === selectedLevel.toLowerCase();
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / LESSONS_DATA.length) * 100);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-os-border pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-cyan/10 border border-os-cyan/30 text-os-cyan font-mono text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Complete Bare Metal Curriculum</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Kernel Engineering <span className="os-gradient-text">Lessons</span>
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="p-4 rounded-xl bg-os-card border border-os-border font-mono text-xs space-y-2 min-w-[220px]">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Curriculum Progress</span>
              <span className="text-os-emerald">{progressPercent}%</span>
            </div>
            <div className="w-full bg-os-surface h-2 rounded-full overflow-hidden border border-os-border">
              <div
                className="bg-os-emerald h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 text-right">
              {completedCount} of {LESSONS_DATA.length} Lessons Finished
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          In-depth technical guides with complete C and assembly code implementations, architecture diagrams, and interactive self-check quizzes.
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          {/* Level Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? "bg-os-cyan/20 text-os-cyan border border-os-cyan/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]"
                    : "bg-os-surface text-slate-400 hover:text-white border border-os-border"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lesson topic..."
              className="w-full pl-9 pr-4 py-2 bg-os-surface border border-os-border rounded-lg font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-os-cyan"
            />
          </div>
        </div>
      </div>

      {/* Lesson Cards Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLessons.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-slate-400 font-mono text-sm">
            No lessons match your search criteria. Try changing the filter.
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isDone = completedLessons.includes(lesson.slug);
            return (
              <div
                key={lesson.id}
                className={`p-6 rounded-xl bg-os-card border transition-all flex flex-col justify-between space-y-4 group ${
                  isDone ? "border-os-emerald/50" : "border-os-border hover:border-os-cyan/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-mono text-[10px] px-2.5 py-0.5 rounded border ${
                          lesson.level === "Beginner"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : lesson.level === "Intermediate"
                            ? "bg-os-cyan/10 text-os-cyan border-os-cyan/30"
                            : "bg-os-violet/10 text-os-violet border-os-violet/30"
                        }`}
                      >
                        {lesson.level}
                      </span>
                      {isDone && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-emerald/20 text-os-emerald border border-os-emerald/40 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Finished</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 font-mono text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>

                  <h3 className="font-mono text-lg font-bold text-white group-hover:text-os-cyan transition-colors">
                    <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {lesson.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-os-border/60 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400">{lesson.module}</span>

                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="px-3.5 py-1.5 rounded-md bg-os-surface border border-os-border group-hover:border-os-cyan/40 text-os-cyan font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <span>{isDone ? "Review Guide" : "Start Guide"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
