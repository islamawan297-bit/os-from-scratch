import { NextResponse } from "next/server";
import { ROADMAP_STEPS } from "@/lib/data/mockData";

export async function GET() {
  return NextResponse.json({ success: true, steps: ROADMAP_STEPS });
}
