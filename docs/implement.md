# WDI Implementation Log
_Started: 2026-04-26_
_Design approved: 2026-04-26_

## Execution Plan
1. [T1] Fix @RawBody() in webhook controller
2. [T2] Add GET /subscription/billing-history endpoint
3. [T3] Map Stripe status → Paid/Pending/Failed
4. [T4] Include receipt URLs in response
5. [T5] Add getBillingHistory() action (frontend)
6. [T6] Add BillingInvoice type (frontend)
7. [T7] Wire BillingHistory.tsx to real data
8. [T8] Update BillingCard.tsx with real props + dynamic badge
9. [T9] Receipt download via Linking.openURL
10. [T10] Client-side status + date range filter
11. [T11] Enable VIEW ALL navigation in Subscription.tsx

## Task Log

### T1 — Fix @RawBody() in webhook controller
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `subscription.controller.ts` — `@Body()` replaced with `@RawBody()`, `RawBody` imported from `@nestjs/common`
- Notes: Root cause confirmed — `@Body()` parses JSON before stripe.webhooks.constructEvent() can verify HMAC. `rawBody: true` was already set in main.ts so no other changes needed.

### T2 — Add GET /subscription/billing-history endpoint
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `subscription.controller.ts` — new `GET /billing-history` route added, auth-guarded for Parent/Teacher roles

### T3 — Map Stripe status → Paid/Pending/Failed
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `subscription.service.ts` — `mapStripeStatus()` private method: paid→Paid, open/draft→Pending, everything else→Failed

### T4 — Include receipt URLs in response
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `subscription.service.ts` — `getBillingHistory()` includes `hosted_invoice_url` as `receiptUrl` and `invoice_pdf` as `pdfUrl`. Plan name derived from price nickname or config price map via `getPlanNameFromInvoice()`.

### T5 — Add getBillingHistory() action
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `actions/subscription/index.ts` — `getBillingHistory()` fetches GET /subscription/billing-history

### T6 — Add BillingInvoice type
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `actions/subscription/index.ts` — `BillingInvoice` and `BillingStatus` types exported

### T7 — Wire BillingHistory.tsx to real data
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `app/guardian/BillingHistory.tsx` — useQuery(['billing-history'], getBillingHistory), loading spinner, empty state, real BillingCard list

### T8 — Update BillingCard with real props + dynamic badge
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `components/Subscription/BillingCard.tsx` — typed props, STATUS_STYLES map for Paid/Pending/Failed, formatAmount() converts pence→pounds with currency symbol

### T9 — Receipt download via Linking.openURL
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `components/Subscription/BillingCard.tsx` — download icon is a Pressable; calls Linking.openURL(receiptUrl); disabled+greyed when receiptUrl is null

### T10 — Client-side status + date range filter
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `app/guardian/BillingHistory.tsx` — useMemo filters by statusFilter (All/Paid/Pending/Failed) and dateRange (All time / Last 3/6/12 months)

### T11 — Enable VIEW ALL navigation
- Status: ✅ Complete
- Completed: 2026-04-26
- Output: `app/guardian/Subscription.tsx` — removed `disabled` prop from VIEW ALL button

---

## Review

# WDI Review
_Completed: 2026-04-26_

## Task Coverage
| ID  | Planned Task                          | Status       | Output                                              | Deviation? |
|-----|---------------------------------------|--------------|-----------------------------------------------------|------------|
| T1  | Fix @RawBody() in webhook controller  | ✅ Complete  | subscription.controller.ts                          | None       |
| T2  | Add billing-history endpoint          | ✅ Complete  | GET /subscription/billing-history                   | None       |
| T3  | Map Stripe status                     | ✅ Complete  | mapStripeStatus() in service                        | None       |
| T4  | Include receipt URLs                  | ✅ Complete  | receiptUrl + pdfUrl in BillingInvoice               | None       |
| T5  | getBillingHistory() action            | ✅ Complete  | actions/subscription/index.ts                       | None       |
| T6  | BillingInvoice type                   | ✅ Complete  | BillingInvoice + BillingStatus exported             | None       |
| T7  | Wire BillingHistory.tsx               | ✅ Complete  | useQuery, loading state, empty state                | None       |
| T8  | BillingCard real props + badge        | ✅ Complete  | STATUS_STYLES map, formatAmount()                   | None       |
| T9  | Receipt download                      | ✅ Complete  | Pressable + Linking.openURL, disabled when null     | None       |
| T10 | Status + date range filter            | ✅ Complete  | useMemo client-side filter in BillingHistory.tsx    | None       |
| T11 | Enable VIEW ALL                       | ✅ Complete  | Removed disabled prop from Subscription.tsx         | None       |

## Design Compliance
- [x] Implementation matches approved architecture in design.md
- [x] File structure matches plan in design.md
- [x] Tech choices followed (React Query, Linking, Stripe invoices API)
- [x] Open decisions resolved (hosted_invoice_url for receipt, client-side date filter)

## Quality Check
- [x] All 11 tasks from write.md addressed
- [x] No placeholders or TODOs left
- [x] Files saved to correct locations

## Deviations
None — implementation matches design exactly.

## Summary
Fixed the webhook bug (one-line @RawBody change) that was preventing subscription updates. Added a full billing history endpoint that proxies Stripe invoices, and wired the existing BillingHistory screen skeleton to real data with dynamic status badges, date range filtering, and receipt download.

## Next Steps
- Deploy the backend change — the @RawBody fix is the most critical and should go out immediately
- Verify in Stripe dashboard that webhooks are now being delivered successfully (check webhook logs)
- Consider adding a "Retry payment" CTA on Failed invoice cards in a future iteration
