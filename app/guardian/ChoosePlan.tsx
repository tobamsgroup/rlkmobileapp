import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import SubscriptionModal from '@/components/Subscription/SubscriptionModal';
import TopBackButton from '@/components/TopBackButton';
import { getMySubscription, type SubscriptionPlan } from '@/actions/subscription';
import { PLAN_DETAILS, PLAN_ORDER, formatDate } from '@/constants/subscription';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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
};

const ChoosePlan = () => {
  const [title, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalBtn, setModalBtn] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlan>('free');
  const [openModal, setOpenModal] = useState(false);

  const { data: subscription, isLoading: loadingPlan } = useQuery({
    queryKey: ['subscription'],
    queryFn: getMySubscription,
  });

  const currentPlan = subscription?.plan ?? 'free';
  const currentPeriodEnd = subscription?.currentPeriodEnd;

  const activeIndex = useMemo(
    () => PLAN_ORDER.indexOf(currentPlan),
    [currentPlan],
  );

  const plans: PlanWithId[] = useMemo(
    () =>
      (PLAN_ORDER.filter((p) => p !== 'free') as SubscriptionPlan[]).map(
        (planId, i) => ({
          planId,
          ...PLAN_DETAILS[planId],
          isActive: planId === currentPlan,
          isUpgrade: PLAN_ORDER.indexOf(planId) > activeIndex,
        }),
      ),
    [currentPlan, activeIndex],
  );

  const onSelectPlan = (plan: PlanWithId) => {
    const nextBillingDate = formatDate(currentPeriodEnd);

    if (plan.isUpgrade) {
      setModalTitle(`Upgrade to ${plan.name} Plan`);
      setModalDesc(
        `You are upgrading to ${plan.name}. Your new plan will start immediately. You will be charged £${plan.price.toFixed(2)} today (prorated). Your next billing date will be ${nextBillingDate}.`,
      );
      setModalBtn('UPGRADE PLAN');
    } else {
      setModalTitle(`Change to ${plan.name} Plan`);
      setModalDesc(
        `Your plan will change to ${plan.name}. Your current plan will remain active until your next billing date on ${nextBillingDate}.`,
      );
      setModalBtn(`CHANGE TO ${plan.name.toUpperCase()}`);
    }

    setSelectedPlanId(plan.planId);
    setOpenModal(true);
  };

  return (
    <Container scrollable edges={['top']}>
      <View className="px-6 py-5 pb-10">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Choose a Plan
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Upgrade your plan to access more features for your child.
        </Text>
      </View>

      <View className="bg-white p-6 gap-5">
        {loadingPlan ? (
          <ActivityIndicator color="#3F9243" className="my-10" />
        ) : (
          plans.map((p) => (
            <PlanCard key={p.planId} {...p} onSelectPlan={onSelectPlan} />
          ))
        )}
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
    </Container>
  );
};

const PlanCard = (
  props: PlanWithId & { onSelectPlan: (plan: PlanWithId) => void },
) => {
  return (
    <View className="border border-[#D3D2D366] px-4 py-6 rounded-[16px]">
      <View className="border-[1.5px] border-[#D3D2D366] p-4 rounded-[16px] relative">
        {props.isPopular && (
          <Text className="absolute top-[-13px] right-[23px] bg-[#3AB68A] text-[14px] font-sansMedium text-white rounded-[12px] py-1.5 px-1">
            💡 Most Popular
          </Text>
        )}
        <View className="flex-row justify-between items-center">
          <Text
            style={{ color: props.themeText, backgroundColor: props.themeBg }}
            className="text-[16px] font-sansSemiBold rounded-[8px] px-4 py-1.5"
          >
            {props.name}
          </Text>
        </View>
        <Text className="text-[16px] font-sans text-[#474348] mt-4">
          {props.desc}
        </Text>
        <Text className="text-[32px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-4">
          £{props.price.toFixed(2)}
          <Text className="text-[16px] text-[#474348] font-sans">/month</Text>
        </Text>
      </View>
      <View className="gap-5 mt-5">
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: props.themeBg }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <ICONS.Books stroke={props.themeText} />
          </View>
          <Text className="font-sans text-[16px] text-[#221D23]">
            {props.noOfBooks} Books
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: props.themeBg }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <ICONS.Users stroke={props.themeText} />
          </View>
          <Text className="font-sans text-[16px] text-[#221D23]">1 Child</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: props.themeBg }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <ICONS.CalenderDue stroke={props.themeText} />
          </View>
          <Text className="font-sans text-[16px] text-[#221D23]">
            30-Day Reading Access
          </Text>
        </View>
      </View>
      <Button
        onPress={props.isActive ? undefined : () => props.onSelectPlan(props)}
        text={
          props.isActive
            ? 'CURRENT PLAN'
            : props.isUpgrade
              ? 'UPGRADE PLAN'
              : 'DOWNGRADE PLAN'
        }
        textClassname={props.isActive ? 'text-[#221D23]' : ''}
        className={twMerge(
          'mt-6',
          props.isActive && 'bg-[#D3D2D3] border-[#6C686C]',
        )}
      />
    </View>
  );
};

export default ChoosePlan;
