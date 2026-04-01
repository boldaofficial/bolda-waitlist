import { NextResponse } from "next/server";

import { buildMantaWaitlistEventPayload, postToMantaWaitlist } from "@/lib/manta";
import {
  getTrackedResendEventDetails,
  getTrackedResendWebhookPayload,
  getWaitlistEventFromResendType,
  parseResendWebhookPayload,
} from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const event = await parseResendWebhookPayload(request);
    const trackedEvent = getTrackedResendWebhookPayload(event);

    if (!trackedEvent) {
      return NextResponse.json({ ignored: true, received: true }, { status: 200 });
    }

    const email = trackedEvent.data.to[0]?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Missing recipient email in webhook payload." }, { status: 400 });
    }

    const mantaResponse = await postToMantaWaitlist(
      buildMantaWaitlistEventPayload({
        email,
        event: getWaitlistEventFromResendType(trackedEvent.type),
        occurredAt: trackedEvent.created_at || trackedEvent.data.created_at,
        emailId: trackedEvent.data.email_id,
        details: getTrackedResendEventDetails(trackedEvent),
      }),
    );

    if (!mantaResponse.ok) {
      const payload = (await mantaResponse.json().catch(() => null)) as { message?: string } | null;

      return NextResponse.json(
        {
          error: payload?.message || "We couldn't update the waitlist email event in Manta.",
        },
        { status: mantaResponse.status || 502 },
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const isClientError =
      error instanceof SyntaxError ||
      (error instanceof Error && error.message.toLowerCase().includes("signature"));

    console.error("Resend webhook handling failed", error);

    return NextResponse.json(
      { error: isClientError ? "Invalid webhook payload." : "We couldn't process the webhook right now." },
      { status: isClientError ? 400 : 500 },
    );
  }
}
