# WIPE PH Sales Monitoring - Vercel Version

This is the Next.js rewrite of the PHP/XAMPP sales monitoring system.

## Stack

- Next.js App Router
- Vercel Postgres
- Cookie-based signed auth
- Nodemailer SMTP for OTP emails

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Create a free Vercel Postgres database and paste `POSTGRES_URL`.
4. Run the SQL in `schema.sql`.
5. Run `npm run dev`.

Default seeded accounts:

- `admin` / `password`
- `staff` / `password`

Change these immediately after deployment.

## Vercel deployment

1. Push this `vercel-app` folder to GitHub as the app root, or import the repository in Vercel and set the root directory to `vercel-app`.
2. In Vercel, add a Postgres/Neon database integration.
3. Add these environment variables:
   - `POSTGRES_URL`
   - `AUTH_SECRET`
   - `MAIL_HOST`
   - `MAIL_PORT`
   - `MAIL_USER`
   - `MAIL_PASS`
   - `MAIL_FROM_NAME`
4. Open the database SQL editor and run `schema.sql`.
5. Deploy.

## Ported PHP flows

- Login/logout with admin and staff roles
- Add sales with multiple service types
- Category-specific add-ons
- Transaction status monitoring
- Balance/status history
- Dashboard summaries
- Sales report generation and saved report history
- Data management for categories, services, and add-ons
- User management
- Forgot password OTP flow
- Mobile-responsive layout

## Notes

The old PHP/XAMPP app was not deleted. This rewrite lives in `vercel-app` so you still have the original system as fallback while testing the Vercel version.
