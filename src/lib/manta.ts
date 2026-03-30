const mantaWaitlistUrl =
  process.env.MANTA_WAITLIST_URL?.trim() ||
  "https://api.mantahq.com/api/workflow/trevor/bolda/bolda-waitlist";

const mantaAuthorization = process.env.MANTA_AUTHORIZATION?.trim();
const mantaWaitlistRole = process.env.MANTA_WAITLIST_ROLE?.trim() || "candidate";

export function isMantaConfigured() {
  return Boolean(mantaWaitlistUrl);
}

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
