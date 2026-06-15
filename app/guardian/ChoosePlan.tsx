import { fetchKids } from '@/actions/learners';
import {
  reactivateKidSubscription as reactivateSubscription,
  type SubscriptionPlan,
} from '@/actions/subscription';
import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import SubscriptionModal from '@/components/Subscription/SubscriptionModal';
import TopBackButton from '@/components/TopBackButton';
import { PLAN_DETAILS, PLAN_ORDER, formatDate } from '@/constants/subscription';
import { getSubscriptionDaysRemaining } from '@/utils';
import { showToast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

type PlanWithId = {
  planId: SubscriptionPlan;
  name: string;
  price: number;
  desc: string;
  noOfBooks: number;
  isPopular: boolean;
  themeBg: string;
  themeText: string;
  isActive: boolean;
  isUpgrade: boolean;
  isCancelled: boolean;
  isExpired: boolean;
};

const ChoosePlan = () => {
  const queryClient = useQueryClient();
  const [title, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalBtn, setModalBtn] = useState('');
  const [selectedPlanId, setSelectedPlanId] =
    useState<SubscriptionPlan>('free');
  const [openModal, setOpenModal] = useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const [openResubscribeModal, setOpenResubscribeModal] = useState(false);
  const [resubscribePlan, setResubscribePlan] = useState<PlanWithId | null>(
    null,
  );
  const params = useLocalSearchParams();
  const selectedKidId = params.kid as string;
  const [subStatus, setStatus] = useState('active');

  const { data: kidsWithSubs = [], isLoading } = useQuery({
    queryKey: ['guardian-kids'],
    queryFn: async () => {
      return await fetchKids();
    },
  });

  const selectedKid = useMemo(
    () => kidsWithSubs.find((k) => k._id === selectedKidId),
    [kidsWithSubs, selectedKidId],
  );

  const currentPlan = selectedKid?.subscription?.plan ?? 'free';
  const currentPeriodEnd = selectedKid?.subscription?.currentPeriodEnd;
  const cancelAtPeriodEnd =
    selectedKid?.subscription?.cancelAtPeriodEnd ?? false;
  const isExpiredSubscription =
    selectedKid?.subscription?.status === 'cancelled';

  const plan = selectedKid?.subscription?.plan ?? 'free';

  const activeIndex = useMemo(
    () => PLAN_ORDER.indexOf(currentPlan),
    [currentPlan],
  );

  const plans: PlanWithId[] = useMemo(
    () =>
      (PLAN_ORDER.filter((p) => p !== 'free') as SubscriptionPlan[]).map(
        (planId) => ({
          planId,
          ...PLAN_DETAILS[planId],
          isActive: planId === currentPlan && !isExpiredSubscription,
          isUpgrade: PLAN_ORDER.indexOf(planId) > activeIndex,
          isCancelled:
            planId === currentPlan &&
            cancelAtPeriodEnd &&
            !isExpiredSubscription,
          isExpired: planId === currentPlan && isExpiredSubscription,
        }),
      ),
    [currentPlan, activeIndex, cancelAtPeriodEnd, isExpiredSubscription],
  );

  const { mutate: reactivate, isPending: isReactivating } = useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => {
      setOpenReactivateModal(false);
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      showToast('success', 'Your subscription has been reactivated.');
    },
    onError: (err: any) => {
      showToast(
        'error',
        err?.response?.data?.message ??
          'Failed to reactivate. Please try again.',
      );
    },
  });

  const onReactivate = (plan: PlanWithId) => {
    setOpenReactivateModal(true);
    setSelectedPlanId(plan.planId);
    setModalTitle(`Reactivate ${plan.name} Plan`);
    setModalDesc(
      `Your ${plan.name} plan will continue as normal, no charge today. You will be billed £${plan.price.toFixed(2)} on your next renewal date, ${formatDate(currentPeriodEnd)}.`,
    );
  };

  const onResubscribe = (plan: PlanWithId) => {
    const nextBillingDate = formatDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    );
    setResubscribePlan(plan);
    setModalTitle(`Reactivate ${plan.name} Plan`);
    setModalDesc(
      `Your subscription will begin immediately. You will be charged £${plan.price.toFixed(2)} today. Your next billing date will be ${nextBillingDate}.`,
    );
    setOpenResubscribeModal(true);
  };

  const onSelectPlan = (plan: PlanWithId) => {
    // const nextBillingDate = formatDate(currentPeriodEnd);

    // if (plan.isUpgrade) {
    //   setModalTitle(`Upgrade to ${plan.name} Plan`);
    //   setModalDesc(
    //     `You are upgrading to ${plan.name}. Your new plan will start immediately. You will be charged £${plan.price.toFixed(2)} today (prorated). Your next billing date will be ${nextBillingDate}.`,
    //   );
    //   setModalBtn('UPGRADE PLAN');
    // } else {
    //   setModalTitle(`Change to ${plan.name} Plan`);
    //   setModalDesc(
    //     `Your plan will change to ${plan.name}. Your current plan will remain active until your next billing date on ${nextBillingDate}.`,
    //   );
    //   setModalBtn(`CHANGE TO ${plan.name.toUpperCase()}`);
    // }

    setSelectedPlanId(plan.planId);
    // setOpenModal(true);
  };

  const onProceed = () => {
    router.push(`/guardian/ConfirmPlan?kid=${selectedKidId}&planId=${selectedPlanId}`);
  };

  useEffect(() => {
    if (selectedKid?.subscription?.cancelAtPeriodEnd) {
      setStatus('cancelled');
    } else if (
      getSubscriptionDaysRemaining(
        selectedKid?.subscription?.currentPeriodEnd,
      ) < 1
    ) {
      setStatus('expired');
    } else {
      setStatus(selectedKid?.subscription?.status || 'active');
    }
  }, [selectedKid?.subscription]);

  return (
    <View className="flex-1">
      <Container scrollable edges={['top']}>
        <View className="px-6 py-5 pb-10">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
            Choose a Plan for {selectedKid?.name?.split(' ')[0]}
          </Text>
          <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
            Select how many books {selectedKid?.name?.split(' ')[0]} can access
            each month.
          </Text>
        </View>

        <View className="bg-white p-6 gap-5">
          {isLoading ? (
            <ActivityIndicator color="#3F9243" className="my-10" />
          ) : (
            plans.map((p) => (
              <PlanCard
                key={p.planId}
                {...p}
                isSubscriptionExpired={isExpiredSubscription}
                isSelected={selectedPlanId === p.planId}
                onSelectPlan={onSelectPlan}
                onReactivate={() => onReactivate(p)}
                onResubscribe={() => onResubscribe(p)}
                onActivate={() =>
                  router.push(`/guardian/ConfirmPlan?planId=${p.planId}`)
                }
              />
            ))
          )}
        </View>

        <View className="bg-white p-6 mt-6 gap-5">
          <Text className="text-[18px] text-[#474348] font-sansMedium">
            Need help?
          </Text>
          <View className="border border-[#D3D2D366] rounded-[16px] mt-6 p-4 gap-4">
            <Pressable
              onPress={() => Linking.openURL('https://rlkids.ai/pricing/read')}
              className="flex-row items-center  gap-2"
            >
              <Text className="text-[16px] text-[#221D23] font-sans">
                Compare Plans
              </Text>
              <ICONS.ArrowUpRight />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL('https://rlkids.ai/pricing/read')}
              className="flex-row items-center  gap-2"
            >
              <Text className="text-[16px] text-[#221D23] font-sans">
                Changing a Child’s Plan
              </Text>
              <ICONS.ArrowUpRight />
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL('https://rlkids.ai/faqs?category=parent')
              }
              className="flex-row items-center  gap-2"
            >
              <Text className="text-[16px] text-[#221D23] font-sans">
                Parent FAQ
              </Text>
              <ICONS.ArrowUpRight />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL('https://rlkids.ai/contact')}
              className="flex-row items-center  gap-2"
            >
              <Text className="text-[16px] text-[#221D23] font-sans">
                Cancellations & Refunds
              </Text>
              <ICONS.ArrowUpRight />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL('https://rlkids.ai/contact')}
              className="flex-row items-center  gap-2"
            >
              <Text className="text-[16px] text-[#221D23] font-sans">
                Payment Issues
              </Text>
              <ICONS.ArrowUpRight />
            </Pressable>
          </View>
        </View>

        <SubscriptionModal
          open={openModal}
          title={title}
          desc={modalDesc}
          buttonText1={modalBtn}
          onClose={() => setOpenModal(false)}
          onProceed={() => {
            router.push(`/guardian/ConfirmPlan?planId=${selectedPlanId}`);
            setOpenModal(false);
          }}
        />

        <SubscriptionModal
          open={openReactivateModal}
          title={title}
          desc={modalDesc}
          buttonText1={isReactivating ? 'REACTIVATING...' : 'REACTIVATE PLAN'}
          buttonText2="CANCEL"
          onClose={() => setOpenReactivateModal(false)}
          // onProceed={() => reactivate()}
        />

        <SubscriptionModal
          open={openResubscribeModal}
          title={title}
          desc={modalDesc}
          buttonText1="REACTIVATE PLAN"
          buttonText2="CANCEL"
          onClose={() => setOpenResubscribeModal(false)}
          onProceed={() => {
            router.push(
              `/guardian/ConfirmPlan?planId=${resubscribePlan?.planId}`,
            );
            setOpenResubscribeModal(false);
          }}
        />
      </Container>
      <View
        style={{ paddingBottom: Constants.statusBarHeight }}
        className="bg-white p-4 shadow-md"
      >
        <Button
          onPress={onProceed}
          // disabled={btn.disabled}
          text={`${plan === 'free' ? 'UPGRADE' : subStatus === 'cancelled' ? 'REACTIVATE' : subStatus === 'expired' ? 'ACTIVATE' : 'CHANGE'} PLAN`}
          // textClassname={props.isActive && !props.isCancelled ? 'text-[#221D23]' : ''}
          // className={twMerge('mt-6', btn.style)}
        />
        <Text className="mt-6 text-center font-sansMedium text-[#221D23]">
          All Plans have a 30-Day Reading Access
        </Text>
      </View>
    </View>
  );
};

const PlanCard = (
  props: PlanWithId & {
    isSubscriptionExpired: boolean;
    onSelectPlan: (plan: PlanWithId) => void;
    onReactivate: () => void;
    onResubscribe: () => void;
    onActivate: () => void;
    isSelected: boolean;
  },
) => {
  const getButtonState = () => {
    if (props.isExpired) {
      return {
        text: 'REACTIVATE PLAN',
        disabled: false,
        style: 'bg-[#3F9243] border-0',
      };
    }
    if (props.isSubscriptionExpired) {
      return { text: 'ACTIVATE PLAN', disabled: false, style: '' };
    }
    if (props.isCancelled) {
      return {
        text: 'REACTIVATE PLAN',
        disabled: false,
        style: 'bg-[#3F9243] border-0',
      };
    }
    if (props.isActive) {
      return {
        text: 'CURRENT PLAN',
        disabled: true,
        style: 'bg-[#D3D2D3] border-[#6C686C]',
      };
    }
    if (props.isUpgrade) {
      return { text: 'UPGRADE PLAN', disabled: false, style: '' };
    }
    return { text: 'DOWNGRADE PLAN', disabled: false, style: '' };
  };

  const btn = getButtonState();

  const handlePress = () => {
    if (props.isExpired) return props.onResubscribe();
    if (props.isSubscriptionExpired) return props.onActivate();
    if (props.isCancelled) return props.onReactivate();
    if (!btn.disabled) props.onSelectPlan(props);
  };

  return (
    <>
      <Pressable
        onPress={() => props.onSelectPlan(props)}
        className={twMerge(
          'border-[1.5px] border-[#D3D2D366] p-4 rounded-[16px] relative',
          props?.isSelected && 'border-2 border-[#3F9243]',
        )}
      >
        {props.isPopular && (
          <Text className="absolute top-[-13px] left-[153px] bg-[#3AB68A] text-[12px] font-sansMedium text-white rounded-[12px] py-1.5 px-1">
            💡 Most Popular
          </Text>
        )}
        {props?.isSelected && (
          <View className="absolute top-[-12px] right-[-12px] ">
            <ICONS.CheckCircle width={24} height={24} />
          </View>
        )}
        <View className="flex-row justify-between items-center pb-4">
          <View className="flex-row  items-center justify-between w-full">
            <Text
              style={{ color: props.themeText, backgroundColor: props.themeBg }}
              className="text-[16px] font-sansSemiBold rounded-[8px] px-4 py-1.5"
            >
              {props.name}
            </Text>
            <Text className="text-[16px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-4">
              £{props.price.toFixed(2)}
              <Text className="text-[14px] text-[#474348] font-sans">
                /month
              </Text>
            </Text>
          </View>
        </View>
        {props?.isSelected && (
          <View className="border-t border-[#D3D2D333]">
            <Text className="text-[16px] font-sans text-[#474348] mt-4">
              {props.desc}
            </Text>

            <View className="flex-row items-center gap-2 mt-5">
              <View
                style={{ backgroundColor: props.themeBg }}
                className="w-10 h-10 rounded-full items-center justify-center flex-row"
              >
                <ICONS.Books stroke={props.themeText} />
              </View>
              <Text className="font-sans text-[16px] text-[#221D23]">
                {props.noOfBooks} Books
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </>
  );
};

export default ChoosePlan;
