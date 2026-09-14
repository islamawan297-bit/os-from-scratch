import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userProjects = await prisma.userProject.findMany({
      where: { userId: session.userId },
      include: { project: true },
    });
    return NextResponse.json({ success: true, projects: userProjects });
  } catch (err) {
    return NextResponse.json({ success: true, projects: [] });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectSlug } = body;

    const project = await prisma.project.findUnique({
      where: { slug: projectSlug },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const existing = await prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: session.userId,
          projectId: project.id,
        },
      },
    });

    if (existing) {
      await prisma.userProject.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, isSaved: false });
    } else {
      await prisma.userProject.create({
        data: {
          userId: session.userId,
          projectId: project.id,
          status: "SAVED",
        },
      });
      return NextResponse.json({ success: true, isSaved: true });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update user project" },
      { status: 500 }
    );
  }
}
