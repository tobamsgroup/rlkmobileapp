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
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
};

export const getMySubscription = async (): Promise<SubscriptionData | null> => {
  const res = await axios.get('/subscription/me');
  return res.data?.data ?? null;
};

export const createCheckoutSession = async (
  planId: SubscriptionPlan,
): Promise<{ url: string }> => {
  const res = await axios.post('/subscription/checkout', { planId });
  return res.data?.data;
};

export const createPortalSession = async (): Promise<{ url: string }> => {
  const res = await axios.get('/subscription/portal');
  return res.data?.data;
};

export type BillingStatus = 'Paid' | 'Pending' | 'Failed';

export type BillingInvoice = {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  status: BillingStatus;
  date: string;
  receiptUrl: string | null;
  pdfUrl: string | null;
};

export const getBillingHistory = async (): Promise<BillingInvoice[]> => {
  const res = await axios.get('/subscription/billing-history');
  return res.data?.data ?? [];
};

export const cancelSubscription = async (reason?: string): Promise<{ currentPeriodEnd: string }> => {
  const res = await axios.delete('/subscription/me', { data: { reason } });
  return res.data?.data;
};

export const reactivateSubscription = async (): Promise<void> => {
  await axios.post('/subscription/me/reactivate');
};
