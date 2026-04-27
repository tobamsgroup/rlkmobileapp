# WDI Write Phase
_Generated: 2026-04-26_
_Task: Fix subscription update + implement billing history with receipt download_

## Goal
After a successful Stripe payment the guardian's plan remains on "free" because the webhook controller receives a parsed JSON object instead of the raw Buffer Stripe requires for signature verification — so every webhook event is silently rejected. Fix that, then implement a full billing history screen (Paid / Pending / Failed) with receipt download on both the NestJS backend and the React Native frontend.

## Task Breakdown

### Group 1: Bug Fix — Webhook Raw Body
- 🟢 T1 — Change `@Body()` to `@RawBody()` in `subscription.controller.ts` so the raw Buffer reaches `stripe.webhooks.constructEvent()` correctly

### Group 2: Backend — Billing History
- 🟡 T2 — Add `GET /subscription/billing-history` endpoint that fetches the guardian's invoices from Stripe using `stripe.invoices.list({ customer: stripeCustomerId })`
- 🟢 T3 — Map Stripe invoice statuses to `Paid | Pending | Failed` (paid → Paid, open/draft → Pending, uncollectible/void → Failed)
- 🟢 T4 — Include `hosted_invoice_url` and `invoice_pdf` per invoice so the frontend can open the receipt

### Group 3: Frontend — API + Types
- 🟢 T5 — Add `getBillingHistory()` action in `actions/subscription/index.ts`
- 🟢 T6 — Add `BillingInvoice` type (id, plan, amount, currency, status, date, receiptUrl, pdfUrl)

### Group 4: Frontend — Billing History Screen
- 🟡 T7 — Wire `BillingHistory.tsx` to fetch real invoices; replace hardcoded mock cards
- 🟡 T8 — Update `BillingCard.tsx` to accept real props (plan name, amount, date, status, receiptUrl); make status badge dynamic (Paid green / Pending amber / Failed red)
- 🟢 T9 — Implement receipt download: tapping the download icon opens `receiptUrl` via `Linking.openURL()`
- 🟡 T10 — Apply status filter (All / Paid / Pending / Failed) client-side on the fetched list
- 🟢 T11 — Enable the "VIEW ALL" / billing history navigation in `Subscription.tsx`

## Dependencies
- T2, T3, T4 must be done before T5, T7
- T5, T6 before T7, T8
- T8 before T10
- T9 depends on T8 (receiptUrl prop)
- T11 is independent (just routing)
- T1 is fully independent — deploy first

## Risks & Unknowns
- Guardian may have no stripeCustomerId yet (never upgraded) — endpoint must handle gracefully (return empty array)
- Stripe invoice `description` doesn't always contain the plan name — need to derive from price ID or line items
- PDF URL is only present once the invoice is finalised; `hosted_invoice_url` is safer to use as primary action
- Date range filter on frontend will be client-side only (no pagination needed for MVP)

## Task Index
| ID  | Task                                      | Group             | Complexity |
|-----|-------------------------------------------|-------------------|------------|
| T1  | Fix `@RawBody()` in webhook controller    | Bug Fix           | 🟢 Small   |
| T2  | Add billing-history endpoint              | Backend           | 🟡 Medium  |
| T3  | Map Stripe status → Paid/Pending/Failed   | Backend           | 🟢 Small   |
| T4  | Include receipt URLs in response          | Backend           | 🟢 Small   |
| T5  | Add `getBillingHistory()` action          | Frontend API      | 🟢 Small   |
| T6  | Add `BillingInvoice` type                 | Frontend API      | 🟢 Small   |
| T7  | Wire BillingHistory.tsx to real data      | Frontend Screen   | 🟡 Medium  |
| T8  | Update BillingCard to accept real props   | Frontend Screen   | 🟡 Medium  |
| T9  | Receipt download via Linking.openURL      | Frontend Screen   | 🟢 Small   |
| T10 | Client-side status + date range filter    | Frontend Screen   | 🟡 Medium  |
| T11 | Enable VIEW ALL navigation                | Frontend Screen   | 🟢 Small   |
