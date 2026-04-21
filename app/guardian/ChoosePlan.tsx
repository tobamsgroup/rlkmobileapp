import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import SubscriptionModal from '@/components/Subscription/SubscriptionModal';
import TopBackButton from '@/components/TopBackButton';
import { RelativePathString, router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const ChoosePlan = () => {
  const [title, setModalTitle] = useState('');
  const [moadlDesc, setModalDesc] = useState('');
  const [modalBtn, setModalBtn] = useState('');
  const [route, setPlanRoute] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const activeIndex = useMemo(() => {
    return PLANS.findIndex((p) => p.isActive);
  }, [PLANS]);

  const onSelectPlan = (
    plan: PLAN,
    isActivate: boolean,
    isDowngrade: boolean,
  ) => {
    if (isActivate) {
      setModalTitle(`Activate Pro Plan`);
      setModalDesc(
        `Your subscription will begin immediately. You will be charged £${plan.price} today. Your next billing date will be May 16, 2026.`,
      );
      setModalBtn('ACTIVATE PLAN');
    }

    if (!isDowngrade) {
      setModalTitle(`Upgrade to ${plan.name} Plan`);
      setModalDesc(
        `Your plan will change to Starter on January 16, 2027. Your current plan will remain active until your next billing date.`,
      );
      setModalBtn('UPGRADE PLAN');
    }

    if (isDowngrade) {
      setModalTitle(`Change to ${plan.name} Plan`);
      setModalDesc(
        `You are upgrading from Starter to Pro. Your new plan will start immediately. You will be charged £${plan.price} today (prorated). Your next billing date will be January 16, 2027.`,
      );
      setModalBtn(`CHANGE TO ${plan?.name?.toUpperCase()}`);
    }
    setPlanRoute(`/guardian/ConfirmPlan?plan=${plan}`);
    setOpenModal(true);
  };

  return (
    <Container scrollable edges={['top']}>
      <View className="px-6 py-5  pb-10">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Choose a Plan
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Upgrade your plan to access more features for your child.
        </Text>
      </View>
      <View className=" bg-white p-6 gap-5">
        {PLANS?.map((p, i) => (
          <PlanCard
            {...p}
            onSelectPlan={onSelectPlan}
            key={p.name}
            isUpgrade={activeIndex < i}
          />
        ))}
      </View>
      <SubscriptionModal
        open={openModal}
        title={title}
        desc={moadlDesc}
        buttonText1={modalBtn}
        onClose={() => setOpenModal(false)}
        onProceed={() => {
          router.push(route as RelativePathString);
          setOpenModal(false);
        }}
      />
    </Container>
  );
};

const PlanCard = (
  props: PLAN & {
    onSelectPlan: (
      plan: PLAN,
      isActivate: boolean,
      isDowngrade: boolean,
    ) => void;
  },
) => {
  return (
    <View className="border border-[#D3D2D366] px-4 py-6 rounded-[16px]">
      <View className="border-[1.5px] border-[#D3D2D366]  p-4 rounded-[16px] relative">
        {props?.isPopular && (
          <Text className="absolute top-[-13px] right-[23px] bg-[#3AB68A] text-[14px] font-sansMedium text-white rounded-[12px] py-1.5 px-1">
            💡 Most Popular
          </Text>
        )}
        <View className="flex-row justify-between items-center ">
          <Text
            style={{ color: props.themeText, backgroundColor: props.themeBg }}
            className={twMerge(
              'text-[16px] font-sansSemiBold  rounded-[8px] px-4 py-1.5',
            )}
          >
            {props?.name}
          </Text>
        </View>
        <Text className="text-[16px] font-sans text-[#474348] mt-4">
          {props?.desc}
        </Text>
        <Text className="text-[32px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-4">
          £{props?.price}
          <Text className="text-[16px] text-[#474348] font-sans">/month</Text>
        </Text>
      </View>
      <View className="gap-5 mt-5">
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: props.themeBg }}
            className="w-10 h-10 rounded-full bg-[#004D991A] items-center justify-center"
          >
            <ICONS.Books stroke={props.themeText} />
          </View>
          <Text className="font-sans text-[16px] text-[#221D23]">
            {props?.noOfBooks} Books
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: props.themeBg }}
            className="w-10 h-10 rounded-full bg-[#004D991A] items-center justify-center"
          >
            <ICONS.Users stroke={props.themeText} />
          </View>
          <Text className="font-sans text-[16px] text-[#221D23]">1 Child</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: props.themeBg }}
            className="w-10 h-10 rounded-full bg-[#004D991A] items-center justify-center"
          >
            <ICONS.CalenderDue stroke={props.themeText} />
          </View>
          <Text className="font-sans text-[16px] text-[#221D23]">
            30-Day Reading Access
          </Text>
        </View>
      </View>
      <Button
        onPress={
          props?.isActive
            ? () => {}
            : () => props?.onSelectPlan(props, false, !props?.isUpgrade)
        }
        text={
          props?.isActive
            ? 'CURRENT PLAN'
            : props?.isUpgrade
              ? 'UPGRADE PLAN'
              : 'DOWNGRADE PLAN'
        }
        textClassname={props?.isActive ? 'text-[#221D23]' : ''}
        className={twMerge(
          'mt-6',
          props?.isActive && 'bg-[#D3D2D3] border-[#6C686C] ',
        )}
      />
    </View>
  );
};

type PLAN = {
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

const PLANS = [
  {
    name: 'Starter',
    price: 7.99,
    desc: 'Great for children starting their learning journey.',
    noOfBooks: 3,
    isPopular: false,
    themeBg: '#3F69921A',
    themeText: '#3F6992',
    isActive: false,
  },
  {
    name: 'Explorer',
    price: 13.99,
    desc: 'Explore multiple future skills.',
    noOfBooks: 6,
    isPopular: true,
    themeBg: '#3F92431A',
    themeText: '#3F9243',
    isActive: true,
  },
  {
    name: 'Builder',
    price: 24.99,
    desc: 'Build deeper knowledge across several topics.',
    noOfBooks: 12,
    isPopular: false,
    themeBg: '#D5B3001A',
    themeText: '#D5B300',
    isActive: false,
  },
  {
    name: 'Future Skills',
    price: 39.99,
    desc: 'Unlock a large bundle of future-skills learning.',
    noOfBooks: 20,
    isPopular: false,
    themeBg: '#A858B71A',
    themeText: '#A858B7',
    isActive: false,
  },
  {
    name: 'Library Pass',
    price: 79.99,
    desc: 'Build knowledge by gaining full access to the RLKids digital Library.',
    noOfBooks: 54,
    isPopular: false,
    themeBg: '#23C2A51A',
    themeText: '#23C2A5',
    isActive: false,
  },
];

export default ChoosePlan;
