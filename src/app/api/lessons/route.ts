import { NextResponse } from "next/server";
import { LESSONS_DATA } from "@/lib/data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const search = searchParams.get("search");

  let filtered = [...LESSONS_DATA];

  if (level && level !== "All") {
    filtered = filtered.filter((l) => l.level.toLowerCase() === level.toLowerCase());
  }

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.summary.toLowerCase().includes(query) ||
        l.module.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ success: true, count: filtered.length, lessons: filtered });
}
