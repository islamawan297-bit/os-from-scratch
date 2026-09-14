import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Message)." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // In a production server with active DB, we save with Prisma.
    // We return success confirmation:
    return NextResponse.json({
      success: true,
      message: `Thank you, ${name}! Your transmission has been received by the OS Architect team.`,
      ticketId: `KERNEL-TICK-${Math.floor(100000 + Math.random() * 900000)}`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to transmit message." },
      { status: 500 }
    );
  }
}
