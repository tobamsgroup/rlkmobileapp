# WDI Design Phase
_Generated: 2026-04-27_
_Status: APPROVED — 2026-04-27_

## Architecture

```
guardian.controller.ts        (BE)  @Delete('me') moved above @Delete(':id')
        │
        ▼
actions/index.ts              (FE)  changePassword(), scheduleAccountDeletion()
        │
        ├── ChangePassword.tsx
        │     RHF useForm<ChangePasswordForm>
        │     Zod: currentPassword, newPassword (min 8), confirmPassword (must match newPassword)
        │     useMutation → changePassword() → toast + router.back()
        │
        ├── AccountDeletion.tsx
        │     useState<string>('') for password field
        │     DELETE ACCOUNT button: disabled/blocked when password is empty
        │     'Log Out Instead': handleLogout(dispatch) + router.replace('/auth/Login')
        │
        └── AccountDeletionReason.tsx
              existing: useState selectedReason
              new:      useState<string>('') customReason (TextInput)
              reason = selectedReason
                        + (customReason.trim() ? ` — ${customReason.trim()}` : '')
                        || customReason.trim()   ← fallback if no preset selected
              useMutation → scheduleAccountDeletion(reason)
              success → setOpenModal(true)  [already in UI]
              Modal CLOSE → handleLogout(dispatch) + router.replace('/auth/Login')
```

## Tech Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| Forms | React Hook Form + Zod | Already used project-wide |
| Server state | TanStack useMutation | Already used project-wide |
| Toast | showToast from @/utils/toast | Already used project-wide |
| Logout | handleLogout from actions/logout | Already exists |
| Routing | expo-router | Already used project-wide |

## Component / Module Plan

### Backend — `guardian.controller.ts`
Swap lines so `@Delete('me')` is defined before `@Delete(':id')`. No logic changes.

### `actions/index.ts` (additions)
```ts
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await axios.post('/auth/update-password', { currentPassword, newPassword });
  return res.data;
};

export const scheduleAccountDeletion = async (reason: string) => {
  const res = await axios.delete('/guardian/me', { data: { reason } });
  return res.data;
};
```

### `ChangePassword.tsx`
- Zod schema:
  ```ts
  z.object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  }).refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  ```
- Replace `SimpleInput` with `Input<ChangePasswordForm>` and pass `control` + `error`
- `useMutation({ mutationFn: ({ currentPassword, newPassword }) => changePassword(...) })`
- Button `onPress` → `handleSubmit(onSubmit)` with `disabled={isPending}`
- On success: `showToast('success', 'Password updated successfully')` + `router.back()`
- On error: `showToast('error', err.response?.data?.message ?? 'Something went wrong')`

### `AccountDeletion.tsx`
- Add `const [password, setPassword] = useState('')`
- Wire `SimpleInput` with `value={password}` + custom `onChangeText` via `handleChange` prop (SimpleInput accepts it)
  - SimpleInput doesn't expose `handleChange` directly from JSX — we use `Input` component without `control` and pass `handleChange`
- Gate: `onPress={() => { if (!password.trim()) return; setOpenDeletion(true); }}`
- "Log Out Instead": import `useAppDispatch` + `handleLogout`; `onPress={() => { handleLogout(dispatch); router.replace('/auth/Login'); }}`
- No other visual or text changes

### `AccountDeletionReason.tsx`
- Add `const [customReason, setCustomReason] = useState('')`
- Wire TextInput: `value={customReason}` + `onChangeText={setCustomReason}`
- Build reason string before submit:
  ```ts
  const reason = selectedReason
    ? customReason.trim()
      ? `${selectedReason} — ${customReason.trim()}`
      : selectedReason
    : customReason.trim();
  ```
- `useMutation` on SUBMIT press → `scheduleAccountDeletion(reason)`
  - Guard: if `!reason` show toast 'Please select a reason or describe why'
  - `isPending` → disable SUBMIT button
  - success → `setOpenModal(true)` (already exists)
  - error → `showToast('error', message)`
- Modal CLOSE `onClose`: `handleLogout(dispatch)` + `router.replace('/auth/Login')`

## File Structure
```
Modified:
  /Users/mobolaji/Documents/GitHub/RL4KIDS-BE/src/guardian/guardian.controller.ts   (route order)
  /Users/mobolaji/Documents/GitHub/rlkmobileapp/actions/index.ts                   (2 new exports)
  /Users/mobolaji/Documents/GitHub/rlkmobileapp/app/guardian/ChangePassword.tsx    (full implementation)
  /Users/mobolaji/Documents/GitHub/rlkmobileapp/app/guardian/AccountDeletion.tsx   (password state + gate + logout)
  /Users/mobolaji/Documents/GitHub/rlkmobileapp/app/guardian/AccountDeletionReason.tsx (reason wiring + mutation + modal close)

No new files created.
```

## Open Decisions
- [x] Password in AccountDeletion: local UX gate only, not sent to backend — confirmed by backend DTO shape
- [x] Reason logic: concatenate preset + custom if both provided; require at least one before submitting
- [x] Modal CLOSE on AccountDeletionReason logs out (account is now scheduled for deletion — keeping user logged in would be confusing)
