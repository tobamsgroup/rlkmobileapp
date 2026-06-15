import axios from '@/lib/axios';

export type SubscriptionPlan =
  | 'free'
  | 'starter'
  | 'explorer'
  | 'builder'
  | 'future_skills'
  | 'library_pass';

export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'past_due'
  | 'incomplete';

export type SubscriptionData = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
  cancellationReason?: string | null;
};

export type GuardianBillingInfo = {
  stripeCustomerId: string | null;
  noOfAllowedChildren: number;
};

export type KidSubscriptionProfile = {
  kidId: string;
  name: string;
  username: string;
  picture?: string;
  age?: number;
  gender?: string;
  preferredLearningTopics?: string[];
  lastLogin?: string;
  totalXp?: number;
  subscription: SubscriptionData;
};

export type BillingStatus = 'Paid' | 'Pending' | 'Failed';

export type KidInfo = {
  kidId: string;
  name: string;
  username: string;
  picture?: string;
};

export type BillingInvoice = {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  status: BillingStatus;
  date: string;
  receiptUrl: string | null;
  pdfUrl: string | null;
  kid: KidInfo | null;
};

export type Plan = {
  id: SubscriptionPlan;
  name: string;
  price: number;
  kidsAllowed: number;
  booksAllowed: number;
  chaptersAllowed: number | null;
};

export type CheckoutResult =
  | { url: string; upgraded?: never }
  | { upgraded: true; url?: never };

// ─── Guardian billing ────────────────────────────────────────────────────────

// Returns guardian-level billing metadata (Stripe customer ID, max children).
// Per-kid plan/status lives on each kid — use getKidsSubscriptions for that.
export const getMySubscription = async (): Promise<GuardianBillingInfo | null> => {
  const res = await axios.get('/subscription/me');
  return res.data?.data ?? null;
};

// Returns all available plans with their limits and pricing.
export const getPlans = async (): Promise<Plan[]> => {
  const res = await axios.get('/subscription/plans');
  return res.data?.data ?? [];
};

// ─── Checkout ────────────────────────────────────────────────────────────────

// Subscribe a single kid to a plan. Each kid has their own independent
// Stripe subscription so cancel/reactivate on one never affects others.
//
// Returns { url } → open in browser/WebView to complete Stripe checkout.
// Returns { upgraded: true } → kid already had a subscription, plan changed
//   directly without needing a new checkout page.
export const createCheckoutSession = async (
  kidId: string,
  planId: SubscriptionPlan,
): Promise<CheckoutResult> => {
  const res = await axios.post('/subscription/checkout', { kidId, planId });
  return res.data?.data;
};

// Call this after Stripe redirects to the success URL with ?session_id=...
// It confirms the checkout server-side and assigns each kid their own
// subscription. Acts as a fallback when the webhook hasn't fired yet.
export const confirmCheckoutSession = async (
  sessionId: string,
): Promise<void> => {
  await axios.post(`/subscription/confirm?session_id=${sessionId}`);
};

// Opens the Stripe billing portal for the guardian to manage payment methods,
// view invoices, etc.
export const createPortalSession = async (): Promise<{ url: string }> => {
  const res = await axios.get('/subscription/portal');
  return res.data?.data;
};

// ─── Per-kid subscription management ────────────────────────────────────────

// Returns all kids under the guardian with their individual subscription data.
export const getKidsSubscriptions = async (): Promise<KidSubscriptionProfile[]> => {
  const res = await axios.get('/subscription/kids');
  return res.data?.data ?? [];
};

// Cancel a specific kid's subscription at the end of their current billing
// period. The kid retains access until currentPeriodEnd. Other kids are
// unaffected.
export const cancelKidSubscription = async (
  kidId: string,
  reason?: string,
): Promise<{ currentPeriodEnd: string }> => {
  const res = await axios.delete(`/subscription/kid/${kidId}`, {
    data: { reason },
  });
  return res.data?.data;
};

// Undo a pending cancellation for a specific kid. Only affects that one kid.
export const reactivateKidSubscription = async (
  kidId: string,
): Promise<void> => {
  await axios.post(`/subscription/kid/${kidId}/reactivate`);
};

// ─── Billing history ─────────────────────────────────────────────────────────

// Returns all invoices for the guardian's Stripe account. Each invoice
// includes the kid it was billed for (null for invoices from before per-kid
// subscriptions were introduced).
export const getBillingHistory = async (): Promise<BillingInvoice[]> => {
  const res = await axios.get('/subscription/billing-history');
  return res.data?.data ?? [];
};
