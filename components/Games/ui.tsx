import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { Mission, MissionImage } from '@/types/mission';
import { toImageSource } from './shared';

/** Card frame shared by the games: title, story and soft background depth. */
export const GameShell = ({
  mission,
  aside,
  children,
}: {
  mission: Mission;
  // Shown to the right of the title, e.g. a score
  aside?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <View className="flex-1 bg-primary rounded-[20px] overflow-hidden">
    <View className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/5" />
    <View className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[#265828]/60" />

    <Animated.View entering={FadeInDown.duration(400)} className="px-5 pt-5">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-white text-[20px] font-sansSemiBold">
          {mission.title}
        </Text>
        {aside}
      </View>
      {mission.introduction && (
        <Text className="text-white/85 font-sans text-[13px] mt-1.5 leading-[19px]">
          {mission.introduction}
        </Text>
      )}
    </Animated.View>

    {children}
  </View>
);

/** Floating character art with a gentle bob, for 3D-rendered images. */
export const Mascot = ({
  image,
  size = 96,
  className,
}: {
  image?: MissionImage;
  size?: number;
  className?: string;
}) => {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1400 }),
        withTiming(0, { duration: 1400 }),
      ),
      -1,
      true,
    );
  }, [bob]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  if (!image) return null;
  return (
    <Animated.View style={style} className={className}>
      <Image
        source={toImageSource(image)}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

/** Speech bubble next to the mascot. */
export const SpeechBubble = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={twMerge(
      'flex-1 bg-white rounded-[16px] rounded-bl-[4px] px-4 py-3',
      className,
    )}
  >
    {typeof children === 'string' ? (
      <Text className="text-dark font-sansMedium text-[14px] leading-[20px]">
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

export type ChoiceState = 'idle' | 'correct' | 'wrong' | 'muted';

const CHOICE_STYLES: Record<ChoiceState, string> = {
  idle: 'bg-white border-[#E1EEE2]',
  correct: 'bg-[#E6F4EB] border-[#3F9243]',
  wrong: 'bg-[#FDF1E8] border-[#E39A5C]',
  muted: 'bg-white/70 border-[#EEF3EE]',
};

const LETTER_STYLES: Record<ChoiceState, [string, string]> = {
  idle: ['bg-[#DFF1E0]', 'text-[#265828]'],
  correct: ['bg-[#3F9243]', 'text-white'],
  wrong: ['bg-[#E39A5C]', 'text-white'],
  muted: ['bg-[#EEF3EE]', 'text-[#9AA59B]'],
};

/** Answer row with a letter badge and a springy press. */
export const ChoiceButton = ({
  label,
  image,
  letter,
  state = 'idle',
  disabled,
  onPress,
}: {
  label: string;
  image?: MissionImage;
  letter?: string;
  state?: ChoiceState;
  disabled?: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const [letterBg, letterText] = LETTER_STYLES[state];

  return (
    <Animated.View style={style}>
      <Pressable
        disabled={disabled}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        className={twMerge(
          'flex-row items-center gap-3 rounded-[16px] border-[1.5px] border-b-[3px] pl-2.5 pr-3 py-3',
          CHOICE_STYLES[state],
        )}
      >
        {letter && (
          <View
            className={twMerge(
              'w-9 h-9 rounded-full items-center justify-center',
              letterBg,
            )}
          >
            <Text className={twMerge('font-sansSemiBold text-[15px]', letterText)}>
              {state === 'correct' ? '✓' : state === 'wrong' ? '✕' : letter}
            </Text>
          </View>
        )}
        {image && (
          <Image
            source={toImageSource(image)}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        )}
        <Text
          className={twMerge(
            'flex-1 font-sansMedium text-[14px] leading-[20px]',
            state === 'muted' ? 'text-[#8A938B]' : 'text-dark',
          )}
        >
          {label}
        </Text>
        {state === 'idle' && !disabled && (
          <Text className="text-[#3F9243] font-sansSemiBold text-[18px]">›</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

/** A picture for a card: its image, else its emoji on a soft tile. */
export const IconTile = ({
  image,
  icon,
  size,
  tint = '#E6F4EB',
  rounded = 12,
}: {
  image?: MissionImage;
  icon?: string;
  size: number;
  tint?: string;
  rounded?: number;
}) => {
  if (image) {
    return (
      <Image
        source={toImageSource(image)}
        style={{ width: size, height: size, borderRadius: rounded }}
        resizeMode="contain"
      />
    );
  }
  if (!icon) return null;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        backgroundColor: tint,
      }}
      className="items-center justify-center"
    >
      <Text style={{ fontSize: size * 0.52 }}>{icon}</Text>
    </View>
  );
};

/**
 * Green header card for games that grow with their content: title, story,
 * the guide character on the right and room for progress or a score.
 */
export const GameHero = ({
  mission,
  badge,
  children,
  className,
}: {
  mission: Mission;
  // Top-right corner, e.g. a score
  badge?: React.ReactNode;
  // Below the story, e.g. progress
  children?: React.ReactNode;
  className?: string;
}) => (
  <Animated.View
    entering={FadeInDown.duration(400)}
    className={twMerge('rounded-[22px] overflow-hidden', className)}
  >
    <LinearGradient
      colors={['#3F9243', '#265828']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-white/10" />
    <View className="absolute -bottom-16 right-16 w-36 h-36 rounded-full bg-[#D5B300]/10" />

    <View className="flex-row px-5 pt-5 pb-5">
      <View className="flex-1 pr-2">
        <Text className="text-white font-sansSemiBold text-[22px] leading-[28px] pr-10">
          {mission.title}
        </Text>
        {mission.introduction && (
          <Text className="text-white/85 font-sans text-[13px] leading-[19px] mt-2">
            {mission.introduction}
          </Text>
        )}
        {children}
      </View>
      {mission.mascot && (
        <View className="justify-end -mr-2 -mb-3">
          <Mascot image={mission.mascot} size={92} />
        </View>
      )}
    </View>

    {badge && <View className="absolute top-4 right-4">{badge}</View>}
  </Animated.View>
);

/** Score pill for the hero badge. */
export const ScoreBadge = ({ value }: { value: number }) => (
  <View className="flex-row items-center gap-1 bg-[#D5B300] rounded-full pl-2 pr-3 py-1 border-b-2 border-[#A88D00]">
    <Text className="text-[13px]">⭐</Text>
    <Animated.Text
      key={value}
      entering={ZoomIn.springify().damping(10)}
      className="text-white font-sansSemiBold text-[14px]"
    >
      {value}
    </Animated.Text>
  </View>
);

/** Small uppercase label pill, e.g. "CASE 001 OF 2". */
export const Pill = ({
  children,
  className,
  textClassName,
}: {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}) => (
  <View
    className={twMerge(
      'self-start bg-[#DFF1E0] rounded-full px-3 py-1',
      className,
    )}
  >
    <Text
      className={twMerge(
        'text-[#265828] font-sansSemiBold text-[11px] tracking-[1px]',
        textClassName,
      )}
    >
      {children}
    </Text>
  </View>
);

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export type IntroStep = { icon: string; text: string };

/**
 * First step of a two-step game: the story and how to play on their own,
 * with one clear button into the game.
 */
export const GameIntro = ({
  mission,
  steps,
  stat,
  cta = "Let's play",
  onStart,
}: {
  mission: Mission;
  steps: IntroStep[];
  // Top-right chip, e.g. "2 CASES"
  stat?: string;
  cta?: string;
  onStart: () => void;
}) => {
  const pulse = useSharedValue(1);
  const leave = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  const leaveStyle = useAnimatedStyle(() => ({
    opacity: 1 - leave.value,
    transform: [{ translateX: -28 * leave.value }],
  }));

  const start = () => {
    if (leave.value > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    leave.value = withTiming(1, { duration: 220 });
    // Swap once the card has slid away
    setTimeout(onStart, 220);
  };

  return (
    <Animated.View entering={FadeIn.duration(350)} style={leaveStyle}>
      <View className="rounded-[24px] overflow-hidden">
        <LinearGradient
          colors={['#3F9243', '#265828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View className="absolute -top-16 -right-12 w-52 h-52 rounded-full bg-white/10" />
        <View className="absolute -bottom-20 -left-16 w-60 h-60 rounded-full bg-[#D5B300]/10" />

        <View className="px-5 pt-5 pb-6">
          <View className="flex-row items-center justify-between">
            <Pill className="bg-[#D5B300]" textClassName="text-[#265828]">
              🎯 MISSION CHALLENGE
            </Pill>
            {stat && (
              <Pill className="bg-white/15" textClassName="text-white">
                {stat}
              </Pill>
            )}
          </View>

          {mission.mascot && (
            <View className="items-center mt-4">
              <View className="absolute top-3 w-32 h-32 rounded-full bg-white/10" />
              <Mascot image={mission.mascot} size={136} />
            </View>
          )}

          <Animated.Text
            entering={FadeInDown.duration(400).delay(80)}
            className="text-white font-sansSemiBold text-[24px] leading-[30px] text-center mt-3"
          >
            {mission.title}
          </Animated.Text>
          {mission.introduction && (
            <Animated.Text
              entering={FadeInDown.duration(400).delay(140)}
              className="text-white/90 font-sans text-[14px] leading-[21px] text-center mt-2"
            >
              {mission.introduction}
            </Animated.Text>
          )}

          <Text className="text-white/70 font-sansSemiBold text-[11px] tracking-[1.5px] mt-5 mb-2">
            HOW TO PLAY
          </Text>
          <View className="gap-2">
            {steps.map((step, i) => (
              <Animated.View
                key={step.text}
                entering={FadeInDown.duration(350).delay(220 + i * 90)}
                className="flex-row items-center gap-3 bg-white/15 rounded-[16px] px-3 py-2.5"
              >
                <View className="w-7 h-7 rounded-full bg-[#D5B300] items-center justify-center">
                  <Text className="text-[#265828] font-sansSemiBold text-[13px]">
                    {i + 1}
                  </Text>
                </View>
                <Text className="text-[18px]">{step.icon}</Text>
                <Text className="flex-1 text-white font-sansMedium text-[13.5px] leading-[19px]">
                  {step.text}
                </Text>
              </Animated.View>
            ))}
          </View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(220 + steps.length * 90)}
            className="mt-6"
          >
            <Animated.View style={ctaStyle}>
              <Pressable
                onPress={start}
                className="flex-row items-center justify-center gap-2 bg-[#D5B300] rounded-full py-4 border-b-4 border-[#A88D00] active:border-b-0 active:mt-1"
              >
                <Text className="text-[#265828] font-sansSemiBold text-[18px]">
                  {cta}
                </Text>
                <View className="w-7 h-7 rounded-full bg-[#265828] items-center justify-center">
                  <Text className="text-white font-sansSemiBold text-[16px] -mt-0.5">
                    ›
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
            <Text className="text-white/70 font-sans text-[12px] text-center mt-2.5">
              Tap the button to start your mission
            </Text>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

/** Compact header for the second step, with a way back to how to play. */
export const GameBar = ({
  mission,
  badge,
  onInfo,
}: {
  mission: Mission;
  badge?: React.ReactNode;
  onInfo: () => void;
}) => (
  <View className="rounded-[18px] overflow-hidden">
    <LinearGradient
      colors={['#3F9243', '#265828']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View className="flex-row items-center gap-2.5 pl-2 pr-3 py-2">
      {mission.mascot ? (
        <Image
          source={toImageSource(mission.mascot)}
          style={{ width: 44, height: 44 }}
          resizeMode="contain"
        />
      ) : (
        <View className="w-2" />
      )}
      <Text
        numberOfLines={1}
        className="flex-1 text-white font-sansSemiBold text-[16px]"
      >
        {mission.title}
      </Text>
      {badge}
      <Pressable
        onPress={onInfo}
        hitSlop={8}
        className="w-8 h-8 rounded-full bg-white/15 items-center justify-center active:bg-white/25"
      >
        <Text className="text-white font-sansSemiBold text-[15px]">?</Text>
      </Pressable>
    </View>
  </View>
);
