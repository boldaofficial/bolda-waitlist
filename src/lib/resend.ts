import { Resend, type WebhookEventPayload } from "resend";

import type { WaitlistEvent } from "@/lib/manta";
import { siteConfig } from "@/lib/site";

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL?.trim() || "Bolda <hello@usebolda.com>";
const teamInboxEmail = "hello@bolda.com";
const resendReplyToEmail =
  process.env.RESEND_REPLY_TO_EMAIL?.trim() || teamInboxEmail;
const resendWebhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
const emailBannerUrl =
  "https://res.cloudinary.com/dhd6wvd09/image/upload/v1775027048/Bolda_mail_qk3hig.png";

const resend = new Resend(resendApiKey);

const trackedResendEvents = new Set<TrackedResendEvent>([
  "email.delivered",
  "email.bounced",
  "email.opened",
  "email.clicked",
]);

type TrackedResendEvent =
  | "email.delivered"
  | "email.bounced"
  | "email.opened"
  | "email.clicked";

type TrackedResendWebhookPayload = Extract<
  WebhookEventPayload,
  { type: TrackedResendEvent }
>;

export function isResendConfigured() {
  return Boolean(resendApiKey);
}

export function getResendWebhookSecret() {
  return resendWebhookSecret;
}

export async function sendWaitlistConfirmationEmail({
  email,
}: {
  email: string;
}) {
  const { data, error } = await resend.emails.send({
    from: resendFromEmail,
    to: email,
    replyTo: resendReplyToEmail,
    subject: "Welcome to Bolda!",
    html: getWaitlistConfirmationEmailHtml(),
    text: getWaitlistConfirmationEmailText(),
    tags: [
      { name: "flow", value: "waitlist" },
      { name: "source", value: "website" },
    ],
  });

  if (error) {
    throw new Error(getResendErrorMessage(error));
  }

  return data?.id ?? null;
}

export async function parseResendWebhookPayload(request: Request) {
  const payload = await request.text();
  const webhookSecret = getResendWebhookSecret();

  if (webhookSecret) {
    const headers = getResendWebhookHeaders(request);

    if (!headers) {
      throw new Error("Missing Resend webhook signature headers.");
    }

    return resend.webhooks.verify({
      payload,
      headers,
      webhookSecret,
    });
  }

  return JSON.parse(payload) as WebhookEventPayload;
}

export function getTrackedResendWebhookPayload(event: WebhookEventPayload) {
  if (!trackedResendEvents.has(event.type as TrackedResendEvent)) {
    return null;
  }

  return event as TrackedResendWebhookPayload;
}

export function getWaitlistEventFromResendType(
  type: TrackedResendEvent,
): Exclude<WaitlistEvent, "submitted"> {
  switch (type) {
    case "email.delivered":
      return "delivered";
    case "email.bounced":
      return "bounced";
    case "email.opened":
      return "opened";
    case "email.clicked":
      return "clicked";
  }
}

export function getTrackedResendEventDetails(
  event: TrackedResendWebhookPayload,
) {
  switch (event.type) {
    case "email.bounced":
      return {
        bounce_message: event.data.bounce.message,
        bounce_sub_type: event.data.bounce.subType,
        bounce_type: event.data.bounce.type,
      };
    case "email.clicked":
      return {
        clicked_link: event.data.click.link,
      };
    default:
      return undefined;
  }
}

function getResendWebhookHeaders(request: Request) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return null;
  }

  return {
    id,
    timestamp,
    signature,
  };
}

function getWaitlistConfirmationEmailHtml() {
  const socialLinks = getSocialLinks();
  const socialLinksHtml = socialLinks
    .map(
      ({ href, label }) =>
        `<li style="margin: 0 0 8px;"><a href="${href}" style="color: #121212; font-weight: 600; text-decoration: underline;">${label}</a></li>`,
    )
    .join("");

  return [
    '<div style="background: #f6f3ea; margin: 0; padding: 24px 12px; width: 100%;">',
    '<div style="background: #ffffff; border-radius: 24px; color: #121212; font-family: Arial, Helvetica, sans-serif; margin: 0 auto; max-width: 560px; overflow: hidden;">',
    `<img alt="Bolda banner" src="${emailBannerUrl}" style="display: block; height: auto; width: 100%;" width="560" />`,
    '<div style="padding: 32px 24px;">',
    '<p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">You&rsquo;re on the Bolda waitlist.</p>',
    '<p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">And honestly, we&rsquo;re glad you&rsquo;re here. If you&rsquo;re here, it probably means one thing. <br><br> Either you&rsquo;ve had an interview that didn&rsquo;t go the way you wanted or you want to experience that at all.</p>',
    '<p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">That&rsquo;s why we&rsquo;re building Bolda.</p>',
    '<p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">Bolda places you in real interview scenarios with professionals from top companies and AI, where you&rsquo;re not just practicing answers but being pushed to think, respond, and communicate the way real interviews demand. Over time, you get better at structuring your thoughts, speaking with clarity, and handling pressure across both technical and behavioral rounds.</p>',
    '<p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">We&rsquo;ll let you know when we launch.</p>',
    '<p style="font-size: 16px; font-weight: 700; line-height: 1.5; margin: 24px 0 12px;">In the meantime, here are a few things to do:</p>',
    '<ol style="font-size: 16px; line-height: 1.7; margin: 0 0 20px; padding-left: 20px;">',
    '<li style="margin: 0 0 12px;">Follow us on our socials.',
    socialLinksHtml
      ? `<ul style="margin: 8px 0 0; padding-left: 20px;">${socialLinksHtml}</ul>`
      : "",
    "</li>",
    '<li style="margin: 0;">Share the word about Bolda. Every mention helps us reach more people who are working hard to ace their next interview and land their next opportunity.</li>',
    "</ol>",
    '<p style="font-size: 16px; font-weight: 700; line-height: 1.7; margin: 0 0 16px;">Hit reply and tell us what&rsquo;s been hardest about interviews for you</p>',
    `<p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">Reply to us at <a href="mailto:${teamInboxEmail}" style="color: #121212; font-weight: 600; text-decoration: underline;">${teamInboxEmail}</a>. We read and reply to every email.</p>`,
    '<p style="font-size: 16px; line-height: 1.7; margin: 24px 0 0;">Cheers,<br />The Bolda team.</p>',
    "</div>",
    "</div>",
    "</div>",
  ].join("");
}

function getWaitlistConfirmationEmailText() {
  const socialLinks = getSocialLinks();

  return [
    "You’re on the Bolda waitlist.",
    "",
    "We’re genuinely glad you’re here. We’re building Bolda because too many talented people miss opportunities not because they lack ability, but because interviews are hard to practice for in a real, supportive way.",
    "",
    "Bolda helps you prepare through one-on-one interview practice with professionals and AI, so you can build confidence, sharpen your answers, and show up ready to get hired.",
    "",
    "We’ll let you know when it’s time.",
    "",
    "Here are a few things to do while waiting:",
    "1. Follow us on our socials:",
    ...socialLinks.map(({ href, label }) => `- ${label}: ${href}`),
    "2. Share the word about Bolda. Every mention helps us reach more people who are working hard to land their next opportunity.",
    "",
    "Hit reply and tell us what has felt hardest about job hunting, especially when it comes to interviews.",
    `Reply to us at ${teamInboxEmail}. We read and reply to every email.`,
    "",
    "Cheers,",
    "The Bolda team",
  ].join("\n");
}

function getSocialLinks() {
  return [
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "X", href: siteConfig.social.x },
    { label: "Instagram", href: siteConfig.social.instagram },
  ].filter((link) => Boolean(link.href));
}

function getResendErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Resend could not send the confirmation email.";
}
