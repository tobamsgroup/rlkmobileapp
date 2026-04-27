# WDI Design Phase
_Generated: 2026-04-26_
_Status: PENDING APPROVAL_

## Architecture

```
Stripe Dashboard
      │  webhooks (checkout.session.completed, invoice.*)
      ▼
NestJS POST /api/v1/subscription/webhook   ← fix: @RawBody() Buffer
      │  on success: updateSubscription in DB
      │
NestJS GET /api/v1/subscription/billing-history
      │  stripe.invoices.list({ customer: stripeCustomerId })
      │  mapped to BillingInvoice[]
      ▼
React Native BillingHistory screen
      │  fetch on mount via React Query
      │  client-side filter by status + date range
      ▼
BillingCard component
      │  Download icon → Linking.openURL(receiptUrl)
```

## Tech Stack
| Layer      | Choice                          | Reason                                      |
|------------|---------------------------------|---------------------------------------------|
| Backend    | NestJS + Stripe SDK             | Already in use                              |
| Data       | No new DB schema — Stripe is source of truth | Invoices live in Stripe; we just proxy them |
| Frontend   | React Query (TanStack)          | Already used for all server state           |
| Receipt    | Expo `Linking.openURL()`        | Opens hosted_invoice_url in browser         |
| Filtering  | Client-side array filter        | Invoice counts are small; no pagination needed for MVP |

## Bug Fix Detail — T1
**Root cause:** `@Body()` in the webhook endpoint returns a parsed JS object (because Stripe sends `Content-Type: application/json`). `stripe.webhooks.constructEvent()` requires the raw Buffer to verify the HMAC signature. It fails silently and every event is dropped.

**Fix:** Replace `@Body() rawBody: Buffer` with `@RawBody() rawBody: Buffer`.
`rawBody: true` is already set in `main.ts` — so this is a one-line change.

## Backend Module Plan

### `subscription.controller.ts`
- T1: `@Body()` → `@RawBody()`
- T2: New `GET /billing-history` route (auth-guarded, guardian only)

### `subscription.service.ts`
- T2/T3/T4: New method `getBillingHistory(guardian)` that:
  1. Returns `[]` if no `stripeCustomerId`
  2. Calls `stripe.invoices.list({ customer, limit: 100, expand: ['data.lines'] })`
  3. Maps each invoice → `BillingInvoice`

### `BillingInvoice` shape (response DTO)
```ts
{
  id: string;
  planName: string;        // derived from invoice line item description or price nickname
  amount: number;          // in pence/cents
  currency: string;        // 'gbp' | 'usd'
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;            // ISO date string (invoice.created)
  receiptUrl: string | null;   // hosted_invoice_url
  pdfUrl: string | null;       // invoice_pdf
}
```

**Stripe status mapping:**
| Stripe status       | App status |
|---------------------|------------|
| `paid`              | Paid       |
| `open`, `draft`     | Pending    |
| `uncollectible`, `void` | Failed |

## Frontend Module Plan

### `actions/subscription/index.ts`
- Add `getBillingHistory(): Promise<BillingInvoice[]>`
- Add exported `BillingInvoice` type

### `app/guardian/BillingHistory.tsx`
- Use `useQuery(['billing-history'], getBillingHistory)`
- Filter the result client-side by selected `status` tab and `dateRange`
- Show loading skeleton while fetching, empty state if no invoices
- Pass each invoice to `<BillingCard />`

### `components/Subscription/BillingCard.tsx`
Props:
```ts
{
  planName: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
  receiptUrl: string | null;
}
```
- Status badge colours:
  - Paid → green bg `#0D8A3E1A` / text `#0D8A3E`
  - Pending → amber bg `#D5B3001A` / text `#D5B300`
  - Failed → red bg `#DE21211A` / text `#DE2121`
- Download icon → `Linking.openURL(receiptUrl)` if available, else disabled/greyed

### `app/guardian/Subscription.tsx`
- Remove the `disabled` prop from the "VIEW ALL" button (navigation already calls `/guardian/BillingHistory`)

## File Structure
```
Modified:
  RL4KIDS-BE/src/subscription/subscription.controller.ts   ← T1, T2
  RL4KIDS-BE/src/subscription/subscription.service.ts      ← T2, T3, T4
  rlkmobileapp/actions/subscription/index.ts               ← T5, T6
  rlkmobileapp/app/guardian/BillingHistory.tsx             ← T7, T10
  rlkmobileapp/components/Subscription/BillingCard.tsx     ← T8, T9
  rlkmobileapp/app/guardian/Subscription.tsx               ← T11
```

## Open Decisions
- [x] Receipt action — open `hosted_invoice_url` (web page) not PDF download, since Expo Linking is simpler and Stripe's hosted page is better UX than a raw PDF on mobile
- [x] Date range filter — client-side on the fetched list (no backend pagination); fetch last 100 invoices max from Stripe
- [ ] Should "Failed" invoices show a "Retry payment" CTA? — not in scope for this task, can add later
