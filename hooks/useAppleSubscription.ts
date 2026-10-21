import {
  prepareAppleSubscription,
  restoreAppleSubscriptions,
  verifyAppleSubscription,
  type SubscriptionPlan,
} from '@/actions/subscription';
import {
  ALL_APPLE_PRODUCT_IDS,
  getAppleProductId,
} from '@/constants/subscription';
import {
  ErrorCode,
  getAvailablePurchases,
  initConnection,
  showManageSubscriptionsIOS,
  useIAP,
  type Purchase,
} from 'expo-iap';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

// Subscriptions are purchased through Apple In-App Purchase on iOS only.
// Other platforms keep using the Stripe checkout flow.
export const IS_APPLE_IAP = Platform.OS === 'ios';

export const isPurchaseCancelled = (error: unknown) =>
  (error as { code?: string } | null)?.code === ErrorCode.UserCancelled;

type PendingPurchase = {
  kidId: string;
  productId: string;
  resolve: () => void;
  reject: (error: unknown) => void;
};

const toSignedTransactions = (purchases: Purchase[]) =>
  purchases
    .map((p) => p.purchaseToken)
    .filter((token): token is string => !!token);

export const useAppleSubscription = () => {
  const pendingRef = useRef<PendingPurchase | null>(null);

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      const pending =
        pendingRef.current?.productId === purchase.productId
          ? pendingRef.current
          : null;
      if (pending) pendingRef.current = null;

      try {
        const [signedTransaction] = toSignedTransactions([purchase]);
        if (!signedTransaction) {
          throw new Error('Missing App Store transaction.');
        }
        // Purchases with no pending request (e.g. an interrupted purchase
        // redelivered by StoreKit) are linked via the restore endpoint.
        if (pending) {
          await verifyAppleSubscription(pending.kidId, signedTransaction);
        } else {
          await restoreAppleSubscriptions([signedTransaction]);
        }
        // Only finish once the backend has verified the purchase, so StoreKit
        // redelivers it if verification fails.
        await finishTransaction({ purchase, isConsumable: false });
        pending?.resolve();
      } catch (error) {
        pending?.reject(error);
      }
    },
    onPurchaseError: (error) => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      pending?.reject(error);
    },
  });

  useEffect(() => {
    if (IS_APPLE_IAP && connected) {
      fetchProducts({ skus: ALL_APPLE_PRODUCT_IDS, type: 'subs' }).catch(
        () => {},
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  // Every learner slot sells a plan at the same price, so slot 1 is used for
  // display.
  const getPlanDisplayPrice = (plan: SubscriptionPlan) =>
    plan === 'free'
      ? undefined
      : subscriptions.find((s) => s.id === getAppleProductId(1, plan))
          ?.displayPrice;

  const purchase = async (kidId: string, planId: SubscriptionPlan) => {
    if (!connected) {
      throw new Error(
        'The App Store is not available right now. Please try again.',
      );
    }

    const { productId, appAccountToken } = await prepareAppleSubscription(
      kidId,
      planId,
    );

    if (!subscriptions.some((s) => s.id === productId)) {
      await fetchProducts({ skus: [productId], type: 'subs' });
    }

    return new Promise<void>((resolve, reject) => {
      const pending: PendingPurchase = { kidId, productId, resolve, reject };
      pendingRef.current = pending;

      requestPurchase({
        type: 'subs',
        request: {
          apple: {
            sku: productId,
            appAccountToken,
            andDangerouslyFinishTransactionAutomatically: false,
          },
        },
      }).catch((error) => {
        if (pendingRef.current === pending) {
          pendingRef.current = null;
          reject(error);
        }
      });
    });
  };

  return { connected, purchase, getPlanDisplayPrice };
};

// Re-links App Store subscriptions on this Apple ID to the guardian's kids.
// Returns how many subscriptions the backend restored.
export const restoreApplePurchases = async (): Promise<number> => {
  await initConnection();
  const signedTransactions = toSignedTransactions(
    await getAvailablePurchases(),
  );
  if (!signedTransactions.length) return 0;

  const { restored } = await restoreAppleSubscriptions(
    signedTransactions.slice(0, 50),
  );
  return restored;
};

// Opens Apple's manage subscriptions sheet (cancel / re-enable / change plan)
// and syncs anything the user changed with the backend straight away.
export const manageAppleSubscriptions = async (): Promise<void> => {
  await initConnection();
  const signedTransactions = toSignedTransactions(
    await showManageSubscriptionsIOS(),
  );
  if (signedTransactions.length) {
    await restoreAppleSubscriptions(signedTransactions);
  }
};
