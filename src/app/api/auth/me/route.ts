import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = getAuthSession();

  if (!session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (user) {
      return NextResponse.json({ success: true, user });
    }
  } catch (e) {
    // DB fallback
  }

  return NextResponse.json({
    success: true,
    user: {
      id: session.userId,
      name: session.email.split("@")[0].toUpperCase(),
      email: session.email,
      role: session.role,
      avatar: null,
    },
  });
}
