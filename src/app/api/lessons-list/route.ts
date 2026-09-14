import { NextResponse } from "next/server";
import { LESSONS_DATA } from "@/lib/data/mockData";

export async function GET() {
  return NextResponse.json({ success: true, count: LESSONS_DATA.length, lessons: LESSONS_DATA });
}
