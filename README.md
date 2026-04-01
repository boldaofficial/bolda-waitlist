# Bolda Waitlist
## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill these variables in `.env.local`:
   - `NEXT_PUBLIC_SITE_URL`
   - `MANTA_WAITLIST_URL`
   - `MANTA_WAITLIST_LOOKUP_URL`
   - `MANTA_AUTHORIZATION` if your endpoint requires it
   - `MANTA_WAITLIST_ROLE`
   - `MANTA_WAITLIST_SOURCE`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `RESEND_REPLY_TO_EMAIL`
   - `RESEND_WEBHOOK_SECRET` if you want signed webhook verification
   - `NEXT_PUBLIC_LINKEDIN_URL`
   - `NEXT_PUBLIC_X_URL`
   - `NEXT_PUBLIC_INSTAGRAM_URL`
4. Start the app with `npm run dev`.

## Database

The waitlist uses MantaHQ for it's database.

- The app submits to `POST /api/waitlist`.
- The server forwards submissions to the MantaHQ endpoint and then sends a confirmation email with Resend.
- Before inserting, the server checks `get-waitlist?email=...` to avoid duplicate waitlist emails.
- The request body sent to MantaHQ is:
  - `fullname`
  - `email`
  - `role`
  - `status`
  - `event`
  - `event_history`
  - `created_at`
  - `source`

## Resend webhook

Configure a Resend webhook for:

- `email.delivered`
- `email.bounced`
- `email.opened`
- `email.clicked`

Point it to `/api/webhooks/resend`.
