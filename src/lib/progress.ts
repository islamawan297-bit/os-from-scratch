"use client";

import { useState, useEffect } from "react";

export function getCompletedLessons(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("os_completed_lessons");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function toggleLessonCompletion(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getCompletedLessons();
  let updated: string[];
  let isCompleted = false;

  if (current.includes(slug)) {
    updated = current.filter((s) => s !== slug);
    isCompleted = false;
  } else {
    updated = [...current, slug];
    isCompleted = true;
  }

  localStorage.setItem("os_completed_lessons", JSON.stringify(updated));
  window.dispatchEvent(new Event("os_progress_updated"));
  return isCompleted;
}

export function getCompletedRoadmapSteps(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("os_completed_roadmap");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function toggleRoadmapStepCompletion(stepId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getCompletedRoadmapSteps();
  let updated: string[];
  let isCompleted = false;

  if (current.includes(stepId)) {
    updated = current.filter((s) => s !== stepId);
    isCompleted = false;
  } else {
    updated = [...current, stepId];
    isCompleted = true;
  }

  localStorage.setItem("os_completed_roadmap", JSON.stringify(updated));
  window.dispatchEvent(new Event("os_progress_updated"));
  return isCompleted;
}
