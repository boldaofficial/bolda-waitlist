# Bolda Waitlist

Landing page and confirmation experience for the Bolda waitlist, built with Next.js and wired for MantaHQ submissions.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill these variables in `.env.local`:
   - `NEXT_PUBLIC_SITE_URL`
   - `MANTA_WAITLIST_URL`
   - `MANTA_AUTHORIZATION` if your endpoint later requires it
   - `MANTA_WAITLIST_ROLE`
   - `NEXT_PUBLIC_LINKEDIN_URL`
   - `NEXT_PUBLIC_X_URL`
   - `NEXT_PUBLIC_INSTAGRAM_URL`
4. Start the app with `npm run dev`.

## MantaHQ notes

- The app submits to `POST /api/waitlist`.
- The server forwards submissions to your MantaHQ workflow endpoint.
- Duplicate emails are rejected. If MantaHQ returns `409`, the UI shows `This email is already on the waitlist.`
- The request body sent to MantaHQ is:
  - `fullname`
  - `email`
  - `role`

## Font note

The headline now uses the bundled local `ABC Ginto Nord` font via `next/font/local`, while body copy uses `Plus Jakarta Sans` from Google Fonts through Next's font optimization.
