# vibe-web-template

A general-purpose Next.js web application template with database initialization and AI-friendly foundations.

## Features

- **Standardized Utilities**: Client-safe wrappers for `fetch` and a leveled `logger`.
- **Database Ready**: Drizzle ORM + PostgreSQL initialization pre-configured.
- **UI System**: Tailwind CSS 4, the full Radix UI primitive set (shadcn-style components under `components/ui/`), and `sonner` for notifications.
- **Offline-safe Builds**: The default system font stack does not fetch Google Fonts during builds.
- **Forms**: React Hook Form + Zod resolvers.
- **AI-Friendly**: Ships with `docs/AI_GUIDE.md` to keep AI-generated code consistent.

## Tech Stack

- Next.js 16 (App Router)
- React 19 / TypeScript 5
- Tailwind CSS 4
- Drizzle ORM + PostgreSQL (`postgres` driver)
- Zod + React Hook Form
- Zustand (state management)
- Vercel Analytics + optional Umami script injection

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment variables**:
   Copy `.env.example` to `.env` and configure at minimum `DATABASE_URL`. Umami analytics variables (`NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) are optional and only injected in production.

3. **Run development server** (port 13000):
   ```bash
   pnpm dev
   ```

4. **Verify changes**:
   ```bash
   pnpm test
   pnpm typecheck
   pnpm build
   ```

5. **Database commands**:
   - `pnpm db:generate` — generate migrations
   - `pnpm db:migrate` — run migrations
   - `pnpm db:studio` — open Drizzle Studio

## Netlify Deployment

The repository's `netlify.toml` configures `pnpm build`, publishes `.next`, and enables Netlify's Next.js adapter to serve pages and API routes. Deploy from the repository root; publishing `public/` alone does not deploy the application.

Configure runtime environment variables in the Netlify project settings. A new deployment is required after changing deployment settings.

## Heleket payments

Heleket is the only checkout provider. In Netlify project settings, add `HELEKET_MERCHANT_ID` and `HELEKET_API_KEY` as secret environment variables available to Functions. Use the **payment** API key from an approved Heleket merchant, not a payout key. Never put credentials into source files, browser code, or the admin environment editor. Redeploy after configuring them.

Set `HELEKET_SITE_URL` to the public HTTPS origin used by customers if it differs from the site's default Netlify domain. The merchant must be approved and this domain verified in Heleket. The public callback is `/api/payments/heleket/webhook`; it must accept unauthenticated network requests from Heleket (the handler authenticates their signatures). Site-wide password protection must not prevent Heleket from reaching this callback.

The existing PostgreSQL `DATABASE_URL`, schema, and package records must be configured for orders to work. No database schema changes were introduced. For `HELEKET` orders, `walletAddress` stores the hosted checkout URL and `txId` stores the invoice UUID, allowing retries and callbacks to match the same invoice. Older orders retain their original meanings and remain available for tracking and support, but manual payment submissions are disabled.

Checkout uses the server-calculated USD total after discounts. Customers choose their cryptocurrency and network on Heleket. Invoices last 30 minutes; retrying the same order reuses the invoice or refreshes it after expiry. Returning to the site never proves payment. Signed callbacks and fallback status checks query Heleket directly and validate invoice ID, order, currency, amount, final status, and the full payer amount before marking an order paid. Duplicate notifications do not reset fulfillment or deliver products twice. Fulfillment remains the existing administrator workflow.

Before accepting customer payments, test an approved merchant with a small real payment, verify the callback updates the order to paid, repeat the callback, and verify the return page and tracking state. Also test underpayment, expiry, and a temporarily unavailable callback. No real payment was submitted during implementation.

## Project Structure

- `app/` — Next.js App Router (`layout.tsx`, `page.tsx`, `api/`).
- `components/` — `AgentationGuard.tsx` plus shadcn-style primitives in `components/ui/`.
- `db/` — Drizzle client (`db/index.ts`).
- `lib/` — Core utilities: `api-response.ts`, `api-error-response.ts`, `request.ts`, `logger.ts`, `errors.ts`, `utils.ts`, `agentationFeedbackMode.ts`.
- `hooks/` — Shared hooks (`use-mobile.ts`, `use-toast.ts`).
- `utils/` — `cn.ts` (clsx + tailwind-merge).
- `docs/` — `AI_GUIDE.md` (AI/developer conventions).
- `Dockerfile` — Multi-stage node:22-slim build exposing port 13000.
