"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User as UserIcon,
  CheckCircle2,
  BookOpen,
  FolderGit2,
  Code2,
  Map,
  Shield,
  ArrowRight,
  Sparkles,
  LogOut,
  Award,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { useAuth } from "@/components/AuthProvider";
import { LESSONS_DATA, OS_PROJECTS } from "@/lib/data/mockData";
import { getCompletedLessons, getCompletedRoadmapSteps } from "@/lib/progress";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedRoadmap, setCompletedRoadmap] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setCompletedLessons(getCompletedLessons());
    setCompletedRoadmap(getCompletedRoadmapSteps());
  }, []);

  if (loading || !user) {
    return (
      <div className="py-20 text-center font-mono text-xs text-os-cyan animate-pulse">
        [SYS] Authenticating session tokens...
      </div>
    );
  }

  const finishedLessonItems = LESSONS_DATA.filter((l) => completedLessons.includes(l.slug));
  const progressPercent = Math.round((completedLessons.length / LESSONS_DATA.length) * 100);

  return (
    <div className="space-y-10 pb-16">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-os-card border border-os-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-panel-glow">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-os-cyan/20 to-os-violet/20 border border-os-cyan/40 flex items-center justify-center text-os-cyan text-2xl font-bold font-mono">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white font-mono">{user.name}</h1>
              {user.role === "ADMIN" && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-os-violet/20 text-os-violet border border-os-violet/40 font-bold uppercase">
                  RING 0 ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg bg-os-violet/20 hover:bg-os-violet/30 border border-os-violet/40 text-os-violet font-mono text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-os-surface border border-os-border hover:border-rose-500/40 text-rose-400 font-mono text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Progress Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        <div className="p-5 rounded-xl bg-os-card border border-os-border space-y-2">
          <div className="text-slate-400 text-xs flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-os-cyan" />
            <span>Curriculum Progress</span>
          </div>
          <div className="text-3xl font-bold text-white">{progressPercent}%</div>
          <div className="w-full bg-os-surface h-1.5 rounded-full overflow-hidden border border-os-border">
            <div className="bg-os-cyan h-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-[11px] text-slate-500">
            {completedLessons.length} of {LESSONS_DATA.length} Lessons Finished
          </div>
        </div>

        <div className="p-5 rounded-xl bg-os-card border border-os-border space-y-2">
          <div className="text-slate-400 text-xs flex items-center space-x-2">
            <Map className="w-4 h-4 text-os-emerald" />
            <span>Roadmap Mastered</span>
          </div>
          <div className="text-3xl font-bold text-os-emerald">
            {completedRoadmap.length} / 7
          </div>
          <div className="text-[11px] text-slate-500">Stages Marked Complete</div>
        </div>

        <div className="p-5 rounded-xl bg-os-card border border-os-border space-y-2">
          <div className="text-slate-400 text-xs flex items-center space-x-2">
            <Award className="w-4 h-4 text-os-violet" />
            <span>Developer Status</span>
          </div>
          <div className="text-xl font-bold text-os-violet uppercase">
            {progressPercent >= 75 ? "Kernel Master" : progressPercent >= 25 ? "Systems Engineer" : "Boot Trainee"}
          </div>
          <div className="text-[11px] text-slate-500">Verified System Profile</div>
        </div>
      </div>

      {/* Main Grid: Finished Lessons | Saved Reference Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Completed Lessons List */}
        <div className="lg:col-span-7 space-y-4">
          <OSWindow title="completed_lessons.log" badge="Progress">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-os-border pb-2">
                <span className="font-mono text-xs font-semibold text-white">
                  Completed Lessons ({finishedLessonItems.length})
                </span>
                <Link href="/lessons" className="font-mono text-[11px] text-os-cyan hover:underline">
                  Browse Catalog &gt;
                </Link>
              </div>

              {finishedLessonItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-mono text-xs space-y-3">
                  <p>No completed lessons recorded yet.</p>
                  <Link
                    href="/lessons"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-os-cyan text-slate-950 font-bold"
                  >
                    <span>Start Lesson 1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {finishedLessonItems.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3 rounded-lg bg-os-surface/60 border border-os-border flex items-center justify-between font-mono text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-os-emerald shrink-0" />
                        <div>
                          <div className="text-white font-medium">{lesson.title}</div>
                          <div className="text-[11px] text-slate-400">{lesson.module}</div>
                        </div>
                      </div>

                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="text-os-cyan hover:underline font-semibold"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </OSWindow>
        </div>

        {/* Right Column: Reference Projects & Quick Sandbox Tools */}
        <div className="lg:col-span-5 space-y-6">
          <OSWindow title="saved_projects.sys" badge="Open Source">
            <div className="space-y-3">
              <div className="font-mono text-xs font-semibold text-white border-b border-os-border pb-2">
                Reference Operating Systems
              </div>

              <div className="space-y-2 font-mono text-xs">
                {OS_PROJECTS.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-lg bg-os-surface/60 border border-os-border space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{proj.title}</span>
                      <span className="text-[10px] text-os-emerald">{proj.difficulty}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/projects"
                className="w-full py-2 rounded bg-os-surface hover:bg-os-surface/80 text-os-cyan border border-os-border flex items-center justify-center space-x-1.5 font-mono text-xs transition-colors"
              >
                <span>View Full Projects Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </OSWindow>
        </div>
      </div>
    </div>
  );
}
