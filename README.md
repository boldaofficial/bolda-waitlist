# Bolda Waitlist
## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill these variables in `.env.local`:
   - `NEXT_PUBLIC_SITE_URL`
   - `MANTA_WAITLIST_URL`
   - `MANTA_AUTHORIZATION` if your endpoint requires it
   - `MANTA_WAITLIST_ROLE`
   - `NEXT_PUBLIC_LINKEDIN_URL`
   - `NEXT_PUBLIC_X_URL`
   - `NEXT_PUBLIC_INSTAGRAM_URL`
4. Start the app with `npm run dev`.

## Database

The waitlist uses MantaHQ for it's database.

- The app submits to `POST /api/waitlist`.
- The server forwards submissions to the MantaHQ endpoint.
- The request body sent to MantaHQ is:
  - `fullname`
  - `email`
  - `role` (optional)

