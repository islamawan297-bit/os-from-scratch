"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Code2,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { LESSONS_DATA, LessonItem } from "@/lib/data/mockData";
import { getCompletedLessons, toggleLessonCompletion } from "@/lib/progress";
import { useAuth } from "@/components/AuthProvider";

export default function LessonDetailClient({ lesson }: { lesson: LessonItem }) {
  const { user } = useAuth();

  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!lesson) return;
    const completed = getCompletedLessons();
    setIsCompleted(completed.includes(lesson.slug));
    setCompletedCount(completed.length);

    // Fetch from database API if logged in
    if (user) {
      fetch("/api/user/progress")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.progress) {
            const dbDone = data.progress.some(
              (p: any) => p.lesson && p.lesson.slug === lesson.slug
            );
            if (dbDone) {
              setIsCompleted(true);
            }
          }
        })
        .catch(() => {});
    }

    const handleUpdate = () => {
      const updated = getCompletedLessons();
      setIsCompleted(updated.includes(lesson.slug));
      setCompletedCount(updated.length);
    };

    window.addEventListener("os_progress_updated", handleUpdate);
    return () => window.removeEventListener("os_progress_updated", handleUpdate);
  }, [lesson, user]);

  const handleToggleCompletion = async () => {
    const nextState = toggleLessonCompletion(lesson.slug);
    setIsCompleted(nextState);

    // Sync with DB API if user logged in
    if (user) {
      try {
        await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonSlug: lesson.slug }),
        });
      } catch (e) {
        console.error("Failed to sync progress with database", e);
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lesson.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    lesson.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const progressPercent = Math.round((completedCount / LESSONS_DATA.length) * 100);

  return (
    <div className="space-y-10 pb-16">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between border-b border-os-border pb-4">
        <Link
          href="/lessons"
          className="font-mono text-xs text-slate-400 hover:text-os-cyan flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Lessons</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleCompletion}
            className={`px-3 py-1 rounded font-mono text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              isCompleted
                ? "bg-os-emerald/20 text-os-emerald border-os-emerald/40"
                : "bg-os-surface text-slate-400 border-os-border hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? "Completed" : "Mark as Completed"}</span>
          </button>

          <span className="font-mono text-xs text-os-cyan bg-os-cyan/10 border border-os-cyan/30 px-2.5 py-0.5 rounded">
            {lesson.level}
          </span>
        </div>
      </div>

      {/* Lesson Hero Header */}
      <div className="space-y-3">
        <div className="font-mono text-xs text-os-emerald uppercase tracking-wider">
          {lesson.module}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-3xl">
          {lesson.summary}
        </p>
      </div>

      {/* Main Technical Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lesson Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 sm:p-8 rounded-xl bg-os-card border border-os-border space-y-6 text-slate-200 text-sm font-sans leading-relaxed">
            {/* Quick Action Banner */}
            <div className="p-4 rounded-lg bg-os-surface/80 border border-os-border flex items-center justify-between">
              <div className="flex items-center space-x-2 font-mono text-xs text-os-cyan">
                <Code2 className="w-4 h-4" />
                <span>Reference snippet ready to test</span>
              </div>
              <Link
                href="/playground"
                className="px-3 py-1 rounded bg-os-cyan text-slate-950 font-mono text-xs font-bold hover:bg-os-cyan/90 transition-colors"
              >
                Run in Sandbox
              </Link>
            </div>

            {/* Markdown rendered text body simulation */}
            <div className="prose prose-invert max-w-none space-y-4">
              <div className="whitespace-pre-line leading-relaxed text-slate-300">
                {lesson.content}
              </div>
            </div>
          </div>

          {/* Interactive Self-Check Quiz */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <OSWindow title="lesson_knowledge_verification.quiz" badge="Self Check">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-os-border pb-3">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-os-cyan" />
                    <span className="font-mono text-xs font-bold text-white uppercase">
                      Interactive Knowledge Self-Check ({lesson.quiz.length} Questions)
                    </span>
                  </div>
                  {quizSubmitted && (
                    <span className="font-mono text-xs font-bold text-os-emerald">
                      Score: {calculateScore()} / {lesson.quiz.length} Correct
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {lesson.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <div className="font-mono text-xs font-semibold text-white">
                        {qIdx + 1}. {q.question}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;

                          let btnStyle = "bg-os-surface border-os-border text-slate-300";
                          if (isSelected) {
                            btnStyle = "bg-os-cyan/20 border-os-cyan text-os-cyan";
                          }
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = "bg-os-emerald/20 border-os-emerald text-os-emerald font-bold";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "bg-rose-500/20 border-rose-500 text-rose-400";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(qIdx, oIdx)}
                              className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-os-emerald shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 rounded bg-os-code border border-os-border font-mono text-xs text-slate-400">
                          <span className="text-os-cyan font-bold">Explanation: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="w-full py-3 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold hover:bg-os-cyan/90 transition-colors"
                  >
                    Submit Answers & Calculate Score
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="w-full py-2.5 rounded-lg bg-os-surface border border-os-border text-white font-mono text-xs hover:border-os-cyan/40 transition-colors"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </OSWindow>
          )}
        </div>

        {/* Right Column: Code Snippet & Navigation Outline */}
        <div className="lg:col-span-4 space-y-6">
          <OSWindow title="reference_code.asm" badge="x86_64">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-white">
                  Implementation Code:
                </span>
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-[11px] text-slate-400 hover:text-os-cyan flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-os-emerald" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-os-code border border-os-border font-mono text-xs text-slate-300 overflow-x-auto max-h-[300px]">
                <pre className="text-os-cyan">
                  <code>{lesson.codeSnippet}</code>
                </pre>
              </div>

              <Link
                href="/playground"
                className="w-full py-2.5 rounded-lg bg-os-surface border border-os-cyan/40 hover:bg-os-cyan/20 text-os-cyan font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                <span>Test Code in Emulator</span>
              </Link>
            </div>
          </OSWindow>

          {/* Curriculum Progress Footer Card */}
          <div className="p-6 rounded-xl bg-os-card border border-os-border space-y-4 text-xs font-mono">
            <div className="text-slate-400 font-bold uppercase tracking-wider">
              Curriculum Progress
            </div>
            <div className="w-full bg-os-surface h-2 rounded-full overflow-hidden border border-os-border">
              <div
                className="bg-os-cyan h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-slate-400 flex justify-between text-[11px]">
              <span>Completed {completedCount} of {LESSONS_DATA.length} Lessons</span>
              <span className="text-os-cyan">{progressPercent}%</span>
            </div>

            <Link
              href="/lessons"
              className="w-full py-2 rounded bg-os-surface hover:bg-os-surface/80 text-white border border-os-border flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>View All Lessons</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
