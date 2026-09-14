import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed to Kernel Dispatch! You will receive weekly OS engineering digests."
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Subscription failed." },
      { status: 500 }
    );
  }
}
