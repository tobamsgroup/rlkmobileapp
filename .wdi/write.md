# WDI Write Phase
_Generated: 2026-04-27_
_Task: Change Password + Account Deletion — mobile app implementation_

## Goal
Wire up `ChangePassword.tsx` and `AccountDeletion.tsx` / `AccountDeletionReason.tsx` with form validation, API calls, and proper navigation. The existing UI, text, and screen flow must remain exactly as-is — only logic and connectivity are added. One backend route-order bug must also be fixed.

## Task Breakdown

### Backend
- 🟢 T1 — Fix `@Delete('me')` / `@Delete(':id')` route order in `guardian.controller.ts`
  NestJS matches routes top-to-bottom; `@Delete(':id')` is currently defined before `@Delete('me')` so `DELETE /guardian/me` would be swallowed by the wildcard and never reach the soft-delete handler.

### Actions (API layer — mobile)
- 🟢 T2 — Add `changePassword(currentPassword, newPassword)` action → `POST /auth/update-password`
- 🟢 T3 — Add `scheduleAccountDeletion(reason)` action → `DELETE /guardian/me`

### ChangePassword Screen
- 🟡 T4 — Add React Hook Form + Zod schema (currentPassword, newPassword, confirmPassword — min 8 chars, passwords match)
- 🟢 T5 — Wire `SimpleInput` fields to `control` and display field-level errors
- 🟢 T6 — `useMutation` for `changePassword`; success → `showToast` + `router.back()`; error → `showToast` error

### AccountDeletion Screen
- 🟢 T7 — Add `useState` for password field; gate the DELETE ACCOUNT button (disable/prevent modal open) if field is empty
- 🟢 T8 — Wire "Log Out Instead" Pressable to logout action

### AccountDeletionReason Screen
- 🟡 T9 — Wire TextInput to local state (`customReason`); build final reason string (selected preset OR custom text)
- 🟢 T10 — `useMutation` for `scheduleAccountDeletion(reason)`; on success open existing `CustomizedAlert` modal (already wired to `setOpenModal(true)`)
- 🟢 T11 — Modal CLOSE handler: call logout, navigate to login screen

## Dependencies
- T4, T5, T6 require T2 (action must exist before mutation)
- T9, T10, T11 require T3 (action must exist before mutation)
- T1 is independent (backend only)

## Risks & Unknowns
- Password in `AccountDeletion.tsx` is not verified server-side (backend `DELETE /guardian/me` only accepts `reason`). Plan: treat it as a local UX confirmation gate — field must be non-empty to allow proceeding. No server round-trip for password check.
- `SimpleInput` (without `control`) is the current UI; switching to the controlled `Input` component means passing `control` prop. Must confirm `SimpleInput` accepts/ignores unknown props cleanly.
- Logout action location: `actions/logout.ts` exists — need to verify its export signature.

## Task Index (for review)
| ID  | Task | Group | Complexity |
|-----|------|-------|------------|
| T1  | Fix Delete route order in guardian.controller.ts | Backend | 🟢 Small |
| T2  | Add changePassword action | Actions | 🟢 Small |
| T3  | Add scheduleAccountDeletion action | Actions | 🟢 Small |
| T4  | RHF + Zod schema for ChangePassword | ChangePassword | 🟡 Medium |
| T5  | Wire inputs + field errors | ChangePassword | 🟢 Small |
| T6  | useMutation + toast + navigation | ChangePassword | 🟢 Small |
| T7  | Password gate for AccountDeletion modal | AccountDeletion | 🟢 Small |
| T8  | Wire Log Out Instead | AccountDeletion | 🟢 Small |
| T9  | Wire reason TextInput + build reason string | AccountDeletionReason | 🟡 Medium |
| T10 | useMutation for scheduleAccountDeletion | AccountDeletionReason | 🟢 Small |
| T11 | Modal CLOSE → logout + navigate | AccountDeletionReason | 🟢 Small |
