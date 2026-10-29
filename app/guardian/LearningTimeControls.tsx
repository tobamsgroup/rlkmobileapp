import { IMAGES } from '@/assets/images';
import Container from '@/components/Container';
import { firstName } from '@/components/LearnerProgress';
import {
  ControlIcon,
  ControlKey,
  ControlsHeader,
  CONTROL_META,
  ResetControlsModal,
  ResetSuccessModal,
} from '@/components/LearningTimeControls';
import Skeleton from '@/components/Skeleton';
import {
  useLearnerOption,
  useLearningTimeControls,
  useResetLearningTimeControls,
} from '@/hooks/useLearningTimeControls';
import { LearningTimeControls as Controls } from '@/types/learningTimeControls';
import { scaleWidth } from '@/utils/scale';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

const ROUTES = {
  dailyLimit: '/guardian/DailyLearningLimit',
  breakReminder: '/guardian/BreakReminders',
  schedule: '/guardian/LearningSchedule',
  notifications: '/guardian/LearningNotifications',
} as const satisfies Record<ControlKey, string>;

const isOn = (controls: Controls | undefined, key: ControlKey) => {
  if (!controls) return false;
  if (key === 'notifications') {
    return Object.values(controls.notifications).some(Boolean);
  }
  return controls[key].enabled;
};

const StatusChip = ({ on }: { on: boolean }) => (
  <View
    className={twMerge(
      'self-start rounded-[8px] px-3 py-1.5 mt-5',
      on ? 'bg-[#E6F4EB]' : 'bg-[#F2F2F2]',
    )}
  >
    <Text
      className={twMerge(
        'text-[15px] font-sans',
        on ? 'text-[#099137]' : 'text-dark',
      )}
    >
      {on ? 'ON' : 'OFF'}
    </Text>
  </View>
);

const ControlCard = ({
  control,
  description,
  on,
  loading,
  onPress,
}: {
  control: ControlKey;
  description: string;
  on: boolean;
  loading: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="bg-white rounded-[24px] border border-[#E5F1E6] p-5 mb-5"
  >
    <ControlIcon control={control} />
    <Text className="text-[17px] font-sansSemiBold text-dark mt-6">
      {CONTROL_META[control].title}
    </Text>
    <View className="flex-row items-center gap-4 mt-3">
      <Text className="flex-1 text-[16px] font-sans text-[#474348] leading-[1.6]">
        {description}
      </Text>
      <Feather name="chevron-right" size={22} color="#221D23" />
    </View>
    {loading ? (
      <Skeleton
        style={{ width: scaleWidth(52), height: scaleWidth(30) }}
        className="rounded-[8px] mt-5"
      />
    ) : (
      <StatusChip on={on} />
    )}
  </Pressable>
);

const LearningTimeControls = () => {
  const params = useLocalSearchParams<{ kidId: string }>();
  const [kid, setKid] = useState(params.kidId);
  const [openMenu, setOpenMenu] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [openResetDone, setOpenResetDone] = useState(false);

  const { learner, isLoading: loadingLearner } = useLearnerOption(kid);
  const { data: controls, isLoading } = useLearningTimeControls(kid);
  const reset = useResetLearningTimeControls(kid);
  const name = firstName(learner?.name);

  const handleReset = () =>
    reset.mutate(undefined, {
      onSuccess: () => {
        setOpenReset(false);
        // Let the first modal finish closing before showing the next
        setTimeout(() => setOpenResetDone(true), 400);
      },
    });

  const cards: { control: ControlKey; description: string }[] = [
    {
      control: 'dailyLimit',
      description: `Choose how long ${name} can learn on RLKids each day.`,
    },
    {
      control: 'breakReminder',
      description: 'Encourage short breakers to keep learning fun and effective.',
    },
    {
      control: 'schedule',
      description: `Choose the days and times ${name} is allowed to learn.`,
    },
    {
      control: 'notifications',
      description:
        'Choose what learning updates you’d like to receive about this learner.',
    },
  ];

  return (
    <Container scrollable>
      <TouchableWithoutFeedback onPress={() => setOpenMenu(false)}>
        <View className="pb-10">
          <ControlsHeader
            title="Learning Time Controls"
            learner={learner}
            loading={loadingLearner}
            onSelectKid={setKid}
            right={
              <View>
                <Pressable
                  accessibilityLabel="More options"
                  onPress={() => setOpenMenu((prev) => !prev)}
                  className="p-1"
                >
                  <Entypo name="dots-three-vertical" size={20} color="#221D23" />
                </Pressable>
                {openMenu && (
                  <View className="absolute top-9 right-0 bg-white rounded-[16px] shadow-md p-4 w-[230px] z-50">
                    <Pressable
                      onPress={() => {
                        setOpenMenu(false);
                        setOpenReset(true);
                      }}
                      className="flex-row items-center gap-3"
                    >
                      <View className="bg-[#DE21211A] w-8 h-8 rounded-full items-center justify-center">
                        <Feather name="rotate-ccw" size={16} color="#DE2121" />
                      </View>
                      <Text className="text-[16px] font-sans text-[#DE2121]">
                        Reset to default
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            }
          />

          <View className="px-6">
            {cards.map(({ control, description }) => (
              <ControlCard
                key={control}
                control={control}
                description={description}
                on={isOn(controls, control)}
                loading={isLoading}
                onPress={() =>
                  router.push({
                    pathname: ROUTES[control],
                    params: { kidId: kid },
                  })
                }
              />
            ))}

            <View className="bg-[#EDF6EE] rounded-[24px] border border-[#D9EBDA] p-5">
              <Image
                source={IMAGES.ExploreBooksStack}
                style={{ width: scaleWidth(96), height: scaleWidth(96) }}
                resizeMode="contain"
              />
              <Text className="text-[20px] font-sansMedium text-[#1F4D21] mt-5">
                A Healthier Learning Routine
              </Text>
              <Text className="text-[16px] font-sans text-dark leading-[1.6] mt-3">
                Balanced learning time helps learners stay focused, build good
                habits and enjoy learning more.
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ResetControlsModal
        open={openReset}
        loading={reset.isPending}
        onConfirm={handleReset}
        onClose={() => setOpenReset(false)}
      />
      <ResetSuccessModal
        open={openResetDone}
        onClose={() => setOpenResetDone(false)}
      />
    </Container>
  );
};

export default LearningTimeControls;
