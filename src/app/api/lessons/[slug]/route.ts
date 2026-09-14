import { NextResponse } from "next/server";
import { LESSONS_DATA } from "@/lib/data/mockData";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const lesson = LESSONS_DATA.find((l) => l.slug === params.slug);

  if (!lesson) {
    return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, lesson });
}
