# Cuchermercado MIS

Management Information System for projected vs. real cash flow, with role-based
screens for Admin, Treasury, and Operator users.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, Edge Functions
- Recharts and Lucide React

## Local Development

```bash
npm install
npm run dev -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars the app runs in demo mode with seeded cash-flow data.

## Supabase Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Apply `supabase/migrations/20260504150000_initial_cashflow_schema.sql`.
4. Deploy `supabase/functions/liquidity-alert`.
5. Configure `LIQUIDITY_ALERT_EMAIL` and `RESEND_API_KEY` for email alerts.

## Routes

- `/login`: email/password login.
- `/dashboard`: Admin dashboard for Dana.
- `/operator`: mobile-first blind entry form.
- `/treasury`: weekly reconciliation and period lock.

## Reports and Filters

- Dashboard supports global filtering by `Todo`, `Mayorista`, or `Minorista`.
- Dashboard exports management reports to Excel and PDF.
- Treasury exports the weekly reconciliation table to Excel.
- Operator keeps a blind-entry-only interface.

## SQL Editor

Use `supabase/schema.sql` when creating the Supabase database manually from the
SQL Editor.

## Architecture Notes

See `docs/architecture-and-quality.md` for the MVC, Repository, Strategy, and
quality checklist mapping used by the prototype.

## Verification

```bash
npm run lint
npm run build
```
