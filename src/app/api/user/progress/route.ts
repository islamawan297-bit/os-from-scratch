import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId: session.userId },
      include: { lesson: true },
    });
    return NextResponse.json({ success: true, progress });
  } catch (err) {
    return NextResponse.json({ success: true, progress: [] });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lessonSlug } = body;

    const lesson = await prisma.lesson.findUnique({
      where: { slug: lessonSlug },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.userId,
          lessonId: lesson.id,
        },
      },
    });

    if (existing) {
      await prisma.userProgress.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, isCompleted: false });
    } else {
      await prisma.userProgress.create({
        data: {
          userId: session.userId,
          lessonId: lesson.id,
          isCompleted: true,
        },
      });
      return NextResponse.json({ success: true, isCompleted: true });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}
