const mantaWaitlistUrl =
  process.env.MANTA_WAITLIST_URL?.trim() ||
  "https://api.mantahq.com/api/workflow/trevor/bolda/bolda-waitlist";
const mantaWaitlistLookupUrl =
  process.env.MANTA_WAITLIST_LOOKUP_URL?.trim() ||
  "https://api.mantahq.com/api/workflow/trevor/bolda/get-waitlist";

const mantaAuthorization = process.env.MANTA_AUTHORIZATION?.trim();
const mantaWaitlistRole = process.env.MANTA_WAITLIST_ROLE?.trim() || "candidate";
const mantaWaitlistSource = process.env.MANTA_WAITLIST_SOURCE?.trim() || "website";

export type WaitlistEvent = "submitted" | "delivered" | "bounced" | "opened" | "clicked";

type WaitlistEventDetails = Record<string, string | undefined>;

type WaitlistHistoryEntry = {
  event: WaitlistEvent;
  occurred_at: string;
  source: string;
  email_id?: string;
  details?: WaitlistEventDetails;
};

export function getMantaWaitlistUrl() {
  return mantaWaitlistUrl;
}

export function getMantaWaitlistHeaders() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (mantaAuthorization) {
    headers.Authorization = mantaAuthorization;
  }

  return headers;
}

export function getMantaWaitlistRole() {
  return mantaWaitlistRole;
}

export function getMantaWaitlistSource() {
  return mantaWaitlistSource;
}

export function buildMantaWaitlistSubmissionPayload({
  email,
  fullName,
  role,
}: {
  email: string;
  fullName: string;
  role?: string;
}) {
  const createdAt = new Date().toISOString();

  return {
    fullname: fullName,
    email,
    role: role?.trim() || getMantaWaitlistRole(),
    status: getMantaWaitlistStatus("submitted"),
    event: "submitted" as const,
    event_history: serializeWaitlistHistory([
      buildWaitlistHistoryEntry({
        event: "submitted",
        occurredAt: createdAt,
      }),
    ]),
    created_at: createdAt,
    source: getMantaWaitlistSource(),
  };
}

export function buildMantaWaitlistEventPayload({
  email,
  event,
  occurredAt,
  emailId,
  details,
}: {
  email: string;
  event: WaitlistEvent;
  occurredAt?: string;
  emailId?: string;
  details?: WaitlistEventDetails;
}) {
  const eventTimestamp = occurredAt || new Date().toISOString();

  return {
    email,
    status: getMantaWaitlistStatus(event),
    event,
    event_history: serializeWaitlistHistory([
      buildWaitlistHistoryEntry({
        event,
        occurredAt: eventTimestamp,
        emailId,
        details,
      }),
    ]),
    source: getMantaWaitlistSource(),
  };
}

export async function postToMantaWaitlist(payload: Record<string, unknown>) {
  return fetch(getMantaWaitlistUrl(), {
    body: JSON.stringify(payload),
    headers: getMantaWaitlistHeaders(),
    method: "POST",
    cache: "no-store",
  });
}

export async function waitlistEntryExists(email: string) {
  const lookupUrl = new URL(mantaWaitlistLookupUrl);
  lookupUrl.searchParams.set("email", email);

  const response = await fetch(lookupUrl, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error("We couldn't confirm your waitlist status right now.");
  }

  const payload = (await response.json().catch(() => null)) as
    | { data?: Array<{ email?: string }> }
    | null;

  return Boolean(payload?.data?.some((entry) => entry.email?.trim().toLowerCase() === email));
}

function buildWaitlistHistoryEntry({
  event,
  occurredAt,
  emailId,
  details,
}: {
  event: WaitlistEvent;
  occurredAt: string;
  emailId?: string;
  details?: WaitlistEventDetails;
}): WaitlistHistoryEntry {
  const cleanedDetails = Object.fromEntries(
    Object.entries(details ?? {}).filter(
      ([, value]) => typeof value === "string" && value.trim().length > 0,
    ),
  );

  return {
    event,
    occurred_at: occurredAt,
    source: getMantaWaitlistSource(),
    ...(emailId ? { email_id: emailId } : {}),
    ...(Object.keys(cleanedDetails).length > 0 ? { details: cleanedDetails } : {}),
  };
}

function serializeWaitlistHistory(history: WaitlistHistoryEntry[]) {
  return JSON.stringify(history);
}

function getMantaWaitlistStatus(event: WaitlistEvent) {
  switch (event) {
    case "submitted":
      return "pending";
    case "delivered":
      return "delivered";
    case "bounced":
      return "bounced";
    case "opened":
    case "clicked":
      return "engaged";
  }
}
