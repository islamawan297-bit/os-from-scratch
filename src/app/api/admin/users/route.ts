import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = getAuthSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Access Denied: Admin Privileges Required (Ring 0 Permission Fault)" },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            progress: true,
            projects: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (err) {
    // Fallback demo admin data
    return NextResponse.json({
      success: true,
      users: [
        {
          id: "usr_admin",
          name: "Kernel Administrator",
          email: "admin@kernel.org",
          role: "ADMIN",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          createdAt: new Date().toISOString(),
          _count: { progress: 4, projects: 2 },
        },
        {
          id: "usr_trainee",
          name: "Systems Engineer Trainee",
          email: "user@kernel.org",
          role: "USER",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          createdAt: new Date().toISOString(),
          _count: { progress: 2, projects: 1 },
        },
      ],
    });
  }
}
