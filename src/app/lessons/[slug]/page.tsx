import React from "react";
import { notFound } from "next/navigation";
import { LESSONS_DATA } from "@/lib/data/mockData";
import LessonDetailClient from "./LessonDetailClient";

export async function generateStaticParams() {
  return LESSONS_DATA.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default function LessonDetailPage({ params }: { params: { slug: string } }) {
  const lesson = LESSONS_DATA.find((l) => l.slug === params.slug);

  if (!lesson) {
    notFound();
  }

  return <LessonDetailClient lesson={lesson} />;
}
