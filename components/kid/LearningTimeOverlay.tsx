import { fetchKidProfile } from '@/actions/kid';
import { IMAGES } from '@/assets/images';
import { LinearButton, SecondaryButton } from '@/components/Button';
import { useKidLearningTimeControls } from '@/hooks/useLearningTimeGuard';
import useLearningTimeOverlay, {
  hideLearningTimeScreen,
  LearningTimeScreen,
  showLearningTimeScreen,
} from '@/hooks/useLearningTimeOverlay';
import {
  BREAK_DURATION_MINUTES,
  describeLearningDays,
  formatTime,
} from '@/utils/learningTime';
import { scaleWidth } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const BREAK_IDEAS: { label: string; image: ImageSourcePropType }[] = [
  { label: 'Take a Deep Breath', image: IMAGES.TakeADeepBreath },
  { label: 'Drink Water', image: IMAGES.BreakIdeaWater },
  { label: 'Rest your eyes', image: IMAGES.BreakIdeaEyes },
];

const goHome = () => {
  hideLearningTimeScreen();
  router.dismissTo('/(tabs)/home-kid');
};

const useKidFirstName = (enabled: boolean) => {
  const { data: profile } = useQuery({
    queryKey: ['kid'],
    queryFn: fetchKidProfile,
    enabled,
  });
  const name: string = profile?.name || profile?.username || '';
  return name.trim().split(' ')[0];
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const Illustration = ({
  source,
  aspectRatio,
  height,
}: {
  source: ImageSourcePropType;
  aspectRatio?: number;
  height?: number;
}) => (
  <Image
    source={source}
    resizeMode="contain"
    style={{ width: '100%', aspectRatio, height }}
  />
);

const Title = ({ children }: { children: ReactNode }) => (
  <Text className="text-center text-[24px] leading-[1.3] font-sansSemiBold text-[#221D23] mt-6">
    {children}
  </Text>
);

const Body = ({ children }: { children: ReactNode }) => (
  <Text className="text-center text-[18px] leading-[1.6] font-sans text-[#474348] mt-3">
    {children}
  </Text>
);

/** Full-screen green page with a white card and the buttons below it */
const FullScreen = ({
  card,
  actions,
}: {
  card: ReactNode;
  actions: ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-[#DCEEDC]"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: scaleWidth(24),
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-[24px] px-6 pt-6 pb-8">{card}</View>
      <View className="mt-8 gap-5">{actions}</View>
    </ScrollView>
  );
};

const PrimaryAction = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => (
  <LinearButton
    haptic
    onPress={onPress}
    text={text}
    textClassname="text-[18px] font-sansSemiBold"
  />
);

const SecondaryAction = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => (
  <SecondaryButton
    haptic
    onPress={onPress}
    text={text}
    textClassname="text-[18px] font-sansSemiBold"
  />
);

// ─── Break countdown ──────────────────────────────────────────────────────────

const RING_SIZE = scaleWidth(160);
const RING_STROKE = scaleWidth(14);

const BreakCountdown = ({ endsAt }: { endsAt: number }) => {
  const total = BREAK_DURATION_MINUTES * 60;
  const [left, setLeft] = useState(() =>
    Math.max(Math.ceil((endsAt - Date.now()) / 1000), 0),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.max(Math.ceil((endsAt - Date.now()) / 1000), 0);
      setLeft(seconds);
      if (seconds === 0) {
        clearInterval(interval);
        showLearningTimeScreen({ kind: 'break_complete' });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const minutes = Math.floor(left / 60);
  const seconds = left % 60;

  return (
    <View
      className="self-center items-center justify-center mt-6"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <Svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          stroke="#E8F3E8"
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          stroke="#16923B"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - left / total)}
        />
      </Svg>
      <Text className="text-[30px] font-sansSemiBold text-[#221D23]">
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </Text>
      <Text className="text-[16px] font-sans text-[#474348] mt-1">
        time remaining
      </Text>
    </View>
  );
};

// ─── Screens ──────────────────────────────────────────────────────────────────

const ScreenContent = ({
  screen,
  name,
}: {
  screen: Exclude<LearningTimeScreen, { kind: 'short_break' }>;
  name: string;
}) => {
  const { data: controls } = useKidLearningTimeControls();
  const comma = name ? `, ${name}` : '';

  switch (screen.kind) {
    case 'not_available': {
      const schedule = controls?.schedule;
      const when = schedule
        ? ` You can come back ${describeLearningDays(schedule.days)}, between ${formatTime(schedule.startTime)} and ${formatTime(schedule.endTime)} to explore more books and activities.`
        : '';
      return (
        <FullScreen
          card={
            <>
              <Illustration
                source={IMAGES.KidThinking}
                aspectRatio={863 / 651}
              />
              <Title>Learning Isn’t Available Right Now</Title>
              <Body>{`It's outside your learning hours${comma}!${when}`}</Body>
            </>
          }
          actions={<PrimaryAction text="BACK TO HOME" onPress={goHome} />}
        />
      );
    }
    case 'limit_paused':
      return (
        <FullScreen
          card={
            <>
              <Illustration
                source={IMAGES.KidCelebrating}
                aspectRatio={863 / 651}
              />
              <Title>You’ve Reached Your Daily Learning Limit!</Title>
              <Body>
                {`Amazing work today${comma}! You've reached your daily learning limit. Come back tomorrow for more fun learning.`}
              </Body>
            </>
          }
          actions={<PrimaryAction text="BACK TO HOME" onPress={goHome} />}
        />
      );
    case 'limit_reminder':
      return (
        <FullScreen
          card={
            <>
              <Illustration
                source={IMAGES.KidReading}
                aspectRatio={863 / 651}
              />
              <Title>You’ve Reached Your Daily Learning Limit!</Title>
              <Body>
                {`Great job learning today${comma}! You can head back home or continue learning if you'd like.`}
              </Body>
            </>
          }
          actions={
            <>
              <PrimaryAction text="BACK TO HOME" onPress={goHome} />
              <SecondaryAction
                text="CONTINUE LEARNING"
                onPress={hideLearningTimeScreen}
              />
            </>
          }
        />
      );
    case 'on_break':
      return (
        <FullScreen
          card={
            <>
              <Illustration source={IMAGES.KidRelaxing} height={142} />
              <Title>Enjoy Your Break!</Title>
              <Body>
                {`Take some time to rest and recharge${comma}. We’ll be here when you are ready.`}
              </Body>
              <BreakCountdown endsAt={screen.endsAt} />
              <Text className="text-center text-[18px] leading-[1.5] font-sansMedium text-[#221D23] mt-6">
                Here are some ideas while you take a break:
              </Text>
              <View className="flex-row gap-2 mt-4">
                {BREAK_IDEAS.map((idea) => (
                  <View
                    key={idea.label}
                    className="flex-1 items-center rounded-[16px] border border-[#EFEEED] p-2 pb-3"
                  >
                    <Image
                      source={idea.image}
                      resizeMode="contain"
                      style={{ width: '100%', height: 60 }}
                    />
                    <Text className="text-center text-[15px] leading-[1.4] font-sans text-[#221D23] mt-2">
                      {idea.label}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          }
          actions={
            <PrimaryAction
              text="CONTINUE LEARNING"
              onPress={hideLearningTimeScreen}
            />
          }
        />
      );
    case 'break_complete':
      return (
        <FullScreen
          card={
            <>
              <Illustration
                source={IMAGES.KidRelaxing}
                aspectRatio={863 / 530}
              />
              <Title>Break Complete!</Title>
              <Body>
                {`Feeling refreshed${comma}? You're ready to continue learning!`}
              </Body>
            </>
          }
          actions={
            <PrimaryAction
              text="CONTINUE LEARNING"
              onPress={hideLearningTimeScreen}
            />
          }
        />
      );
  }
};

/** Pop-up over the lesson when it's time for a break */
const ShortBreakPopup = ({ name }: { name: string }) => {
  const { data: controls } = useKidLearningTimeControls();
  const minutes = controls?.breakReminder.intervalMinutes;
  const comma = name ? `, ${name}` : '';
  return (
    <View className="bg-[#DBEFDC] p-[24px] rounded-[24px] border-2 border-[#6CBF6F]">
      <View className="bg-white rounded-[20px] px-5 py-6 items-center">
        <Image
          source={IMAGES.KidMeditating}
          resizeMode="contain"
          style={{ height: 160, width: 160 }}
        />
        <Text className="text-center text-[24px] font-sansSemiBold text-[#265828] mt-5">
          Time for a Short Break!
        </Text>
        <Text className="text-center text-[18px] leading-[1.6] font-sans text-[#221D23] mt-2">
          {`You've been learning for ${minutes} minutes${comma}! Take a few minutes to rest and recharge.`}
        </Text>
      </View>
      <View className="mt-6 gap-5">
        <PrimaryAction
          text="TAKE A BREAK"
          onPress={() =>
            showLearningTimeScreen({
              kind: 'on_break',
              endsAt: Date.now() + BREAK_DURATION_MINUTES * 60_000,
            })
          }
        />
        <SecondaryAction
          text="CONTINUE LEARNING"
          onPress={hideLearningTimeScreen}
        />
      </View>
    </View>
  );
};

/**
 * Shows the learning time screen raised with `showLearningTimeScreen()`.
 * Mounted once at the root so it covers whichever screen the kid is on.
 */
const LearningTimeOverlay = () => {
  const screen = useLearningTimeOverlay();
  const name = useKidFirstName(!!screen);
  const isPopup = screen?.kind === 'short_break';

  // One modal for every screen, so going from the break pop-up to the break
  // screen never has to present a second modal while the first is closing
  return (
    <Modal
      isVisible={!!screen}
      style={isPopup ? undefined : { margin: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor={isPopup ? 'black' : '#DCEEDC'}
      backdropOpacity={isPopup ? 0.4 : 1}
      statusBarTranslucent
    >
      {screen?.kind === 'short_break' ? (
        <ShortBreakPopup name={name} />
      ) : (
        screen && <ScreenContent screen={screen} name={name} />
      )}
    </Modal>
  );
};

export default LearningTimeOverlay;
