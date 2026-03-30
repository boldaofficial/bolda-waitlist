import { NextResponse } from "next/server";

import {
  getMantaWaitlistHeaders,
  getMantaWaitlistRole,
  getMantaWaitlistUrl,
  isMantaConfigured,
} from "@/lib/manta";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      role?: string;
    };

    const fullName = body.fullName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const role = body.role?.trim() ?? "";

    if (!fullName || !emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please provide a full name and a valid email address." },
        { status: 400 },
      );
    }

    if (!isMantaConfigured()) {
      return NextResponse.json(
        {
          error: "MantaHQ is not configured yet. Add MANTA_WAITLIST_URL to .env.local.",
        },
        { status: 503 },
      );
    }

    const response = await fetch(getMantaWaitlistUrl(), {
      body: JSON.stringify({
        email,
        fullname: fullName,
        role: role || getMantaWaitlistRole(),
      }),
      headers: getMantaWaitlistHeaders(),
      method: "POST",
      cache: "no-store",
    });

    if (response.status === 409) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      return NextResponse.json(
        {
          error: payload?.message || "We couldn't save your details right now. Please try again.",
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Waitlist submission failed", error);

    return NextResponse.json(
      { error: "We couldn't save your details right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
