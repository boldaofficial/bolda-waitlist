import { NextResponse } from "next/server";

import {
  buildMantaWaitlistSubmissionPayload,
  postToMantaWaitlist,
  waitlistEntryExists,
} from "@/lib/manta";
import { isResendConfigured, sendWaitlistConfirmationEmail } from "@/lib/resend";

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

    if (!fullName) {
      return NextResponse.json(
        { error: "Please provide your full name." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          error: "Enter a valid email",
        },
        { status: 400 },
      );
    }

    if (await waitlistEntryExists(email)) {
      return NextResponse.json(
        {
          error: "This email is already on the waitlist.",
        },
        { status: 409 },
      );
    }

    const response = await postToMantaWaitlist(
      buildMantaWaitlistSubmissionPayload({
        email,
        fullName,
        role,
      }),
    );

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

    let emailSent = false;

    if (isResendConfigured()) {
      try {
        emailSent = Boolean(await sendWaitlistConfirmationEmail({ email }));
      } catch (error) {
        console.error("Waitlist confirmation email failed", error);
      }
    }

    return NextResponse.json({ ok: true, emailSent }, { status: 201 });
  } catch (error) {
    console.error("Waitlist submission failed", error);

    return NextResponse.json(
      { error: "We couldn't save your details right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
