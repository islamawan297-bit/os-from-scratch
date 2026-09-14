import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signJWT } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check hardcoded demo users fallback or DB
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (e) {
      // DB offline fallback
    }

    if (!user) {
      // Fallback demo credentials check
      if (cleanEmail === "admin@kernel.org" && password === "admin123") {
        user = {
          id: "usr_admin",
          name: "Kernel Administrator",
          email: "admin@kernel.org",
          password: "",
          role: "ADMIN" as const,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        };
      } else if (cleanEmail === "user@kernel.org" && password === "user123") {
        user = {
          id: "usr_trainee",
          name: "Systems Engineer Trainee",
          email: "user@kernel.org",
          password: "",
          role: "USER" as const,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        };
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid email or password credentials." },
          { status: 401 }
        );
      }
    } else {
      // DB user password verification
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password credentials." },
          { status: 401 }
        );
      }
    }

    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set("os_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
