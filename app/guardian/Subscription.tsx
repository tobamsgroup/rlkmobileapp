import { fetchKids } from '@/actions/learners';
import {
  createPortalSession,
  getBillingHistory,
  getMySubscription,
} from '@/actions/subscription';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button, { SecondaryButton } from '@/components/Button';
import Container from '@/components/Container';
import BillingCard from '@/components/Subscription/BillingCard';
import TopBackButton from '@/components/TopBackButton';
import {
  PLAN_DETAILS,
  formatDate,
  getBillingCycle,
} from '@/constants/subscription';
import { getSubscriptionDaysRemaining } from '@/utils';
import { scaleWidth } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const STATUS_LABEL: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  active: { label: 'Active', color: '#099137', bg: '#0991371A' },
  past_due: { label: 'Past Due', color: '#D5A000', bg: '#D5A0001A' },
  cancelled: { label: 'Cancelled', color: '#DE2121', bg: '#DE21211A' },
  incomplete: { label: 'Incomplete', color: '#888', bg: '#8881A' },
};

const Subscription = () => {
  const [openCancellation, setOpenCancellation] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [upsellDismissed, setUpsellDismissed] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [subStatus, setStatus] = useState('active');
  const [openRemaining, setOpenRemaining] = useState(false);
  const [kid, setKid] = useState('');

  const { data: kidsWithSubs = [], isLoading } = useQuery({
    queryKey: ['guardian-kids'],
    queryFn: async () => {
      return await fetchKids();
    },
  });

  // Guardian-level billing info (stripeCustomerId + noOfAllowedChildren)
  const { data: guardianInfo } = useQuery({
    queryKey: ['guardian-billing'],
    queryFn: getMySubscription,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['billing-history'],
    queryFn: getBillingHistory,
  });

  // Auto-select first kid once data loads
  useEffect(() => {
    if (kidsWithSubs.length && !kid) {
      setKid(kidsWithSubs[0]?._id);
    }
  }, [kidsWithSubs]);

  // Selected kid profile + their subscription
  const selectedKid =
    kidsWithSubs.find((k) => k._id === kid) ?? kidsWithSubs[0];
  const subscription = selectedKid?.subscription;

  // Kids available in the dropdown (everyone except the currently selected one)
  const remainingKids = useMemo(
    () => kidsWithSubs.filter((k) => k._id !== selectedKid?._id),
    [kidsWithSubs, selectedKid],
  );

  // Invoices scoped to the selected kid (null kid = legacy unattributed invoice, show for all)
  const kidInvoices = useMemo(
    () =>
      invoices.filter((inv) => !inv.kid || inv.kid.kidId === selectedKid?._id),
    [invoices, selectedKid],
  );

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const { url } = await createPortalSession();
      await Linking.openURL(url);
    } catch {
    } finally {
      setPortalLoading(false);
    }
  };

  const plan = subscription?.plan ?? 'free';
  const planDetail = PLAN_DETAILS[plan];
  const statusStyle = STATUS_LABEL[subStatus] ?? STATUS_LABEL.active;
  const isFreePlan = plan === 'free';
  const isPaidPlan = !isFreePlan;

  useEffect(() => {
    if (subscription?.cancelAtPeriodEnd) {
      setStatus('cancelled');
    } else if (
      getSubscriptionDaysRemaining(subscription?.currentPeriodEnd) < 1
    ) {
      setStatus('expired');
    } else {
      setStatus(subscription?.status || 'active');
    }
  }, [subscription]);

  if (isLoading) {
    return (
      <Container edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3F9243" />
        </View>
      </Container>
    );
  }

  return (
    <Container scrollable edges={['top']}>
      <View className="px-6 py-5 pb-6">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Subscription
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Manage each learner's plan.
        </Text>
      </View>

      <View className="bg-white p-6">
        <View className="relative">
          <Pressable
            onPress={() => setOpenRemaining(!openRemaining)}
            className="bg-[#FAFDFF] border border-[#C3E4C5] rounded-[20px] mb-5 p-4 flex-row items-center justify-between relative z-10"
          >
            <View className="flex-row items-center gap-3">
              {selectedKid?.picture ? (
                <Image
                  style={{ width: scaleWidth(40), height: scaleWidth(40) }}
                  source={
                    selectedKid?.picture
                      ? { uri: selectedKid?.picture }
                      : IMAGES.KidProfilePlaceholder
                  }
                  className="rounded-full border border-[#D5B300]"
                />
              ) : (
                <View
                  style={{
                    width: scaleWidth(40),
                    height: scaleWidth(40),
                  }}
                  className="bg-[#D3D2D366] rounded-full items-center justify-center"
                >
                  <Text className="uppercase font-sansSemiBold text-dark text-[20px]">
                    {selectedKid?.name?.split(' ')?.[0]?.[0]}
                    {selectedKid?.name?.split(' ')?.[1]?.[0]}
                  </Text>
                </View>
              )}
              <Text className="text-[16px] font-sansMedium text-dark">
                {selectedKid?.name}
              </Text>
            </View>
            <ICONS.ChevronDown />
          </Pressable>
          {openRemaining && (
            <View className="p-4 rounded-[20px] bg-white absolute top-[70px] w-full z-20 shadow-md">
              {remainingKids?.map((r) => (
                <Pressable
                  key={r._id}
                  onPress={() => {
                    setKid(r._id);
                    setOpenRemaining(false);
                  }}
                  className="bg-white rounded-[12px] py-3 flex-row items-center justify-between relative"
                >
                  <View className="flex-row items-center gap-3">
                    {r?.picture ? (
                      <Image
                        style={{
                          width: scaleWidth(40),
                          height: scaleWidth(40),
                        }}
                        source={
                          r?.picture
                            ? { uri: r?.picture }
                            : IMAGES.KidProfilePlaceholder
                        }
                        className="rounded-full border border-[#D5B300]"
                      />
                    ) : (
                      <View
                        style={{
                          width: scaleWidth(40),
                          height: scaleWidth(40),
                        }}
                        className="bg-[#D3D2D366] rounded-full items-center justify-center"
                      >
                        <Text className="uppercase font-sansSemiBold text-dark text-[20px]">
                          {r?.name?.split(' ')?.[0]?.[0]}
                          {r?.name?.split(' ')?.[1]?.[0]}
                        </Text>
                      </View>
                    )}
                    <View className="gap-1">
                      <Text className="text-[16px] font-sansMedium text-dark">
                        {r?.name}
                      </Text>
                      <Text className=" font-sans text-[#474348]">
                        {PLAN_DETAILS[r.subscription?.plan ?? 'free']?.name ??
                          'Free Trial'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View className="border border-[#FFF2AA] bg-[#FEFAEEB2] rounded-[16px] px-4 py-3 flex-row items-center gap-2 mb-8">
          <View className="w-10 h-10 border border-[#FFF2AA] rounded-full items-center justify-center">
            <ICONS.User2 />
          </View>
          <Text className=" font-sansMedium text-dark">
            {kidsWithSubs.length} of {guardianInfo?.noOfAllowedChildren ?? 5}{' '}
            learners added
          </Text>
        </View>
        {/* Current plan card */}
        <View className="border border-[#C3E4C5] border-b-4 p-4 rounded-[16px] bg-[#F1F9F199]">
          <View className="flex-row justify-between items-center">
            <Text className="text-[20px] font-sansMedium text-[#221D23]">
              {planDetail.name}
            </Text>
            <View
              style={{ backgroundColor: statusStyle.bg }}
              className="flex-row items-center gap-1 rounded-[4px] px-2 py-1"
            >
              <View
                style={{ backgroundColor: statusStyle.color }}
                className="w-1.5 h-1.5 rounded-full"
              />
              <Text
                style={{ color: statusStyle.color }}
                className="text-[16px] font-sansMedium"
              >
                {statusStyle.label}
              </Text>
            </View>
          </View>
          {isFreePlan ? (
            <Text className="text-[32px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-8">
              £0
              <Text className="text-[16px] text-[#474348] font-sans">
                /month
              </Text>
            </Text>
          ) : (
            <Text className="text-[32px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-8">
              £{planDetail.price.toFixed(2)}
              <Text className="text-[16px] text-[#474348] font-sans">
                /month
              </Text>
            </Text>
          )}
          <Text className="text-[16px] font-sansMedium text-[#221D23] leading-[1.3] mt-4">
            {planDetail.noOfBooks > 0
              ? `${planDetail.noOfBooks} ${planDetail.beName === 'free' ? 'Chapter' : 'Books'}`
              : '1 child'}
          </Text>
          <View className="border-t border-[#D3D2D366] my-6" />
          <Button
            onPress={() =>
              router.push(`/guardian/ChoosePlan?kid=${selectedKid?._id}`)
            }
            text={`${plan === 'free' ? 'UPGRADE' : subStatus === 'cancelled' ? 'REACTIVATE' : subStatus === 'expired' ? 'ACTIVATE' : 'CHANGE'} PLAN`}
          />
        </View>

        {/* Next billing card — only for paid plans */}
        <View className="border border-[#C3E4C5] border-b-4 p-4 rounded-[16px] mt-5">
          <Text className="text-[16px] font-sansMedium text-[#221D23] leading-[1.3]">
            Next Billing
          </Text>
          <View className="mt-6">
            <Text className="text-[16px] font-sans text-[#474348] leading-[1.5]">
              Next Charge
            </Text>
            <Text className="text-[16px] font-sans text-[#221D23] leading-[1.5] mt-1">
              {!isPaidPlan
                ? '-'
                : subscription?.cancelAtPeriodEnd
                  ? '-'
                  : `£${planDetail.price.toFixed(2)}`}
            </Text>
          </View>
          <View className="mt-6">
            <Text className="text-[16px] font-sans text-[#474348] leading-[1.5]">
              Billing Date
            </Text>
            <Text className="text-[16px] font-sans text-[#221D23] leading-[1.5] mt-1">
              {!isPaidPlan ? '-' : formatDate(subscription?.currentPeriodEnd)}
            </Text>
          </View>
          <View className="mt-6">
            <Text className="text-[16px] font-sans text-[#474348] leading-[1.5]">
              Billing Cycle
            </Text>
            <Text className="text-[16px] font-sans text-[#221D23] leading-[1.5] mt-1">
              {getBillingCycle(subscription?.currentPeriodEnd)}
            </Text>
          </View>
          {isPaidPlan && (
            <>
              <View className="border-t border-[#D3D2D366] my-6" />
              {/* <Pressable onPress={handleManageBilling} disabled={portalLoading}>
              {portalLoading ? (
                <ActivityIndicator color="#3F9243" />
              ) : (
                <Text className="text-[16px] font-sansMedium text-[#3F9243] leading-[1.5]">
                  MANAGE BILLING
                </Text>
              )}
            </Pressable> */}
              {subStatus === 'cancelled' ? (
                <Text className="text-[16px] font-sansMedium text-[#DE2121] leading-[1.5] mt-4">
                  CANCELS {formatDate(subscription?.currentPeriodEnd)}
                </Text>
              ) : (
                <Text
                  onPress={() => setOpenCancellation(true)}
                  className="text-[16px] font-sansMedium text-[#DE2121] leading-[1.5] mt-4"
                >
                  CANCEL SUBSCRIPTION
                </Text>
              )}
            </>
          )}
        </View>

        {/* Upsell banner */}
        {!upsellDismissed && (
          <View className="px-4 py-6 relative rounded-[16px] mt-8">
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 0,
                borderRadius: 16,
              }}
              colors={['#D5B300', '#806C00']}
            />
            <View className="flex-row gap-3">
              <Text className="text-white text-[20px] font-sansSemiBold flex-1">
                Take Your Child Even Further
              </Text>
              <Pressable
                onPress={() => setUpsellDismissed(true)}
                className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center"
              >
                <ICONS.Close width={20} height={20} stroke={'#FFFFFF'} />
              </Pressable>
            </View>
            <Text className="text-[#FAFDFF] mt-2 font-sans text-[16px]">
              Your child is already learning, now give them even more to grow
              with.
            </Text>
            <View className="mt-8">
              <View className="flex-row gap-2">
                <View className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
                  <ICONS.Check color={'#FFFFFF'} />
                </View>
                <Text className="flex-1 text-white text-[16px] font-sansMedium">
                  Give access to multiple children in your household
                </Text>
              </View>
              <View className="flex-row gap-2 mt-6">
                <View className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
                  <ICONS.Check color={'#FFFFFF'} />
                </View>
                <Text className="flex-1 text-white text-[16px] font-sansMedium">
                  Expand their learning across more topics
                </Text>
              </View>
              <View className="flex-row gap-2 mt-6">
                <View className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
                  <ICONS.Check color={'#FFFFFF'} />
                </View>
                <Text className="flex-1 text-white text-[16px] font-sansMedium">
                  Unlock deeper insights into their progress
                </Text>
              </View>
              <View className="border-t border-[#D3D2D366] my-6" />
              <View className="flex-row gap-6 items-center">
                <Text className="text-[32px]">👉</Text>
                <Button
                  onPress={() =>
                    router.push(`/guardian/ChoosePlan?kid=${selectedKid?._id}`)
                  }
                  text="CHANGE PLAN"
                  textClassname="text-[#3F9243]"
                  className="bg-white border-0 px-6"
                />
              </View>
            </View>
          </View>
        )}
      </View>

      <View className="bg-white p-6 my-6">
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Billing History
        </Text>
        <Text className="mt-2 text-[16px] text-[#474348] font-sans leading-[1.5] mb-5">
          View your past payments and receipts.
        </Text>
        <View className="flex-row">
          {kidInvoices?.length > 0 && !isFreePlan && (
            <Button
              onPress={() => router.push('/guardian/BillingHistory')}
              text="VIEW ALL"
              className="px-10"
              disabled={isFreePlan}
            />
          )}
        </View>
        {!isFreePlan && (
          <View className="gap-6 mt-10">
            {kidInvoices?.map((invoice, i) => (
              <BillingCard
                planName={invoice.planName}
                amount={invoice.amount}
                currency={invoice.currency}
                status={invoice.status}
                date={invoice.date}
                receiptUrl={invoice.receiptUrl}
                onDownload={(url) => {
                  setWebViewLoading(true);
                  setReceiptUrl(url);
                }}
                key={i}
              />
            ))}
          </View>
        )}
        {isFreePlan && (
          <View className="items-center  gap-3 mt-10 mb-2">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-[#D3D2D333] mb-6">
              <ICONS.CreditCardOff />
            </View>
            <Text className="font-sansSemiBold text-[#221D23] text-[18px]">
              No Payments Yet
            </Text>
            <Text className="font-sans text-[#221D23] text-center text-[16px]">
              Your transactions will appear here after you subscribe.
            </Text>
          </View>
        )}
      </View>
      <Modal
        isVisible={!!receiptUrl}
        style={{ margin: 0 }}
        onBackButtonPress={() => setReceiptUrl(null)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#D3D2D366]">
            <Pressable
              onPress={() => setReceiptUrl(null)}
              className="w-9 h-9 items-center justify-center rounded-full bg-[#F5F5F5]"
            >
              <ICONS.Close width={18} height={18} stroke="#221D23" />
            </Pressable>
            <Text className="font-sansMedium text-[#221D23] text-[16px]">
              Receipt
            </Text>
            <View className="w-9" />
          </View>

          {receiptUrl && (
            <WebView
              source={{ uri: receiptUrl }}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              style={{ flex: 1 }}
            />
          )}

          {webViewLoading && (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#004D99" />
              <Text className="font-sans text-[#474348] mt-3 text-[14px]">
                Loading receipt...
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      <CancellationModal
        open={openCancellation}
        accessEndDate={subscription?.currentPeriodEnd}
        kidId={selectedKid?._id ?? ''}
        kidName={selectedKid?.name ?? ''}
        onClose={() => setOpenCancellation(false)}
      />
    </Container>
  );
};

const CancellationModal = ({
  open,
  accessEndDate,
  kidId,
  onClose,
  kidName,
}: {
  open: boolean;
  accessEndDate?: string | null;
  kidId: string;
  onClose: () => void;
  kidName: string;
}) => {
  return (
    <Modal isVisible={open} onBackdropPress={onClose}>
      <View className="bg-[#DBEFDC] p-6 border-2 border-[#6ABC6D] rounded-[24px] items-center">
        <View className="bg-white rounded-[24px] p-5 items-center mb-6 w-full">
          <View className="w-16 h-16 rounded-full bg-[#EF43531A] items-center justify-center">
            <ICONS.AlertTriangle width={32} height={32} />
          </View>
          <View className="absolute top-[58px] right-[62px]">
            <ICONS.Ellipse width={20} height={20} stroke={'#09913766'} />
          </View>
          <View className="absolute top-[47px] left-[65px]">
            <ICONS.Confetto />
          </View>
          <View className="absolute bottom-[27px] right-[46px]">
            <ICONS.Shape />
          </View>
          <Text className="text-center font-sansSemiBold text-[#265828] text-[20px] mb-2 mt-6">
            Cancel {kidName?.split(' ')?.[0]}'s Plan?
          </Text>
          <Text className="text-center text-[#221D23] font-sans text-[16px] leading-[1.5]">
            This learner will continue to have access until{' '}
            {formatDate(accessEndDate)}. After that, access to learning content
            will be removed.
          </Text>
          <Text
            onPress={() => {
              router.push('/guardian/ChoosePlan');
              onClose();
            }}
            className="text-center text-[#3F9243] font-sansMedium underline text-[16px] leading-[1.5]"
          >
            You can also switch to a lower plan instead.
          </Text>
        </View>
        <Button
          onPress={onClose}
          className="w-full mt-6"
          text={'KEEP SUBSCRIPTION'}
        />
        <SecondaryButton
          onPress={() => {
            router.push({
              pathname: '/guardian/SubscriptionCanclellation',
              params: { kidId },
            });
            onClose();
          }}
          className="w-full mt-4"
          text={'CONTINUE TO CANCEL'}
        />
      </View>
    </Modal>
  );
};

export default Subscription;
