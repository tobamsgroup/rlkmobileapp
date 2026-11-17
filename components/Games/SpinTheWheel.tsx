import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';

import Button from '@/components/Button';
import { SpinWheelMission, WheelChallenge } from '@/types/mission';
import CongratulationsPopup from './CongratulationsPopup';
import { shuffleArray } from '@/utils';
import { useMissionFeedback } from './shared';
import { ChoiceButton, ChoiceState, GameShell, LETTERS, Mascot } from './ui';

const DEFAULT_COLORS = ['#3F9243', '#D5B300', '#1671D9', '#C8702A', '#6ABC6D', '#8E5BD8'];
const SPIN_MS = 4200;
const MAX_SEGMENTS = 10;
const MIN_OPEN_ANSWER = 3;

const polar = (c: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) };
};

const segmentPath = (c: number, r: number, start: number, end: number) => {
  const a = polar(c, r, start);
  const b = polar(c, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${c} ${c} L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y} Z`;
};

// Breaks a segment label onto at most two short lines
const labelLines = (label: string) => {
  const words = label.split(' ');
  if (words.length < 2) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

/**
 * Model 2: Spin the Wheel. Each spin lands on a challenge the child hasn't
 * answered yet: multiple choice with feedback, or an open answer in their
 * own words followed by an example answer.
 */
const SpinTheWheel = ({
  mission,
  onNext,
}: {
  mission: SpinWheelMission;
  onNext: () => void;
}) => {
  const { width } = useWindowDimensions();
  const { report } = useMissionFeedback(mission);
  const [answered, setAnswered] = useState<string[]>([]);
  const [active, setActive] = useState<WheelChallenge | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);

  // A random subset when the bank is bigger than the wheel
  const challenges = useMemo(() => {
    const max = Math.min(mission.segmentCount ?? MAX_SEGMENTS, MAX_SEGMENTS);
    return mission.challenges.length > max
      ? shuffleArray([...mission.challenges]).slice(0, max)
      : mission.challenges;
  }, [mission]);
  const count = challenges.length;
  const spinsNeeded = Math.min(mission.spins ?? count, count);
  const segment = 360 / count;
  const size = Math.min(width - 96, 280);
  const c = size / 2;
  const radius = c - 10;
  const colors = mission.colors?.length ? mission.colors : DEFAULT_COLORS;

  const rotation = useSharedValue(0);
  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // A light tick each time a segment passes the pointer
  useAnimatedReaction(
    () => Math.floor(rotation.value / segment),
    (current, previous) => {
      if (previous !== null && current !== previous) {
        runOnJS(Haptics.selectionAsync)();
      }
    },
    [segment],
  );

  const spin = () => {
    const remaining = challenges
      .map((ch, i) => ({ ch, i }))
      .filter(({ ch }) => !answered.includes(ch.id));
    if (!remaining.length || spinning) return;

    const { ch, i } = remaining[Math.floor(Math.random() * remaining.length)];
    const center = i * segment + segment / 2;
    const jitter = (Math.random() - 0.5) * segment * 0.6;
    const current = rotation.value;
    // Land with the chosen segment's centre under the top pointer
    const offset = (((-center - jitter - current) % 360) + 360) % 360;
    const target = current + 360 * 5 + offset;

    setSpinning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    rotation.value = withTiming(
      target,
      { duration: SPIN_MS, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(land)(ch.id);
      },
    );
  };

  const land = (id: string) => {
    setSpinning(false);
    setActive(challenges.find((ch) => ch.id === id) ?? null);
  };

  const complete = (id: string) => {
    const next = [...answered, id];
    setAnswered(next);
    setActive(null);
    if (next.length >= spinsNeeded) setDone(true);
  };

  return (
    <GameShell
      mission={mission}
      aside={
        <View className="bg-white/15 rounded-full px-3 py-1.5">
          <Text className="text-white font-sansSemiBold text-[13px]">
            {answered.length}/{spinsNeeded}
          </Text>
        </View>
      }
    >
      <View className="flex-1 items-center justify-center">
        {/* Pointer */}
        <Svg width={34} height={30} style={{ marginBottom: -14, zIndex: 2 }}>
          <Polygon points="3,3 31,3 17,28" fill="#FFFFFF" stroke="#265828" strokeWidth={3} />
        </Svg>

        <View style={{ width: size, height: size }}>
          <Animated.View style={wheelStyle}>
            <Svg width={size} height={size}>
              <Circle cx={c} cy={c} r={c - 1} fill="#265828" />
              {challenges.map((ch, i) => {
                const start = i * segment;
                const mid = start + segment / 2;
                const isAnswered = answered.includes(ch.id);
                const label = polar(c, radius * 0.62, mid);
                const lines = labelLines(ch.label);
                return (
                  <G key={ch.id}>
                    <Path
                      d={segmentPath(c, radius, start, start + segment)}
                      fill={isAnswered ? '#9BB59C' : colors[i % colors.length]}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                    <SvgText
                      x={label.x}
                      y={label.y - (lines.length - 1) * 6}
                      fill="#FFFFFF"
                      fontSize={count > 6 ? 9 : 11}
                      fontWeight="700"
                      textAnchor="middle"
                      rotation={mid}
                      origin={`${label.x}, ${label.y}`}
                    >
                      {isAnswered ? '✓' : lines[0]}
                    </SvgText>
                    {!isAnswered && lines[1] && (
                      <SvgText
                        x={label.x}
                        y={label.y + 8}
                        fill="#FFFFFF"
                        fontSize={count > 6 ? 9 : 11}
                        fontWeight="700"
                        textAnchor="middle"
                        rotation={mid}
                        origin={`${label.x}, ${label.y}`}
                      >
                        {lines[1]}
                      </SvgText>
                    )}
                  </G>
                );
              })}
              {/* Rim lights */}
              {Array.from({ length: count * 3 }).map((_, i) => {
                const p = polar(c, c - 5, (360 / (count * 3)) * i);
                return (
                  <Circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={2.6}
                    fill={i % 2 ? '#FFF6C2' : '#FFFFFF'}
                  />
                );
              })}
            </Svg>
          </Animated.View>

          {/* Hub */}
          <Pressable
            onPress={spin}
            disabled={spinning || !!active || done}
            className="absolute items-center justify-center rounded-full bg-white border-4 border-[#D5B300]"
            style={{
              width: 76,
              height: 76,
              left: c - 38,
              top: c - 38,
            }}
          >
            <Text className="text-primary font-sansSemiBold text-[15px]">
              {spinning ? '...' : 'SPIN'}
            </Text>
          </Pressable>
        </View>

        {!active && !spinning && answered.length < spinsNeeded && (
          <Animated.Text
            entering={FadeIn}
            className="text-white/90 font-sansMedium mt-4"
          >
            Tap SPIN to get a challenge!
          </Animated.Text>
        )}

        <Mascot
          image={mission.mascot}
          size={78}
          className="absolute bottom-2 right-3"
        />
      </View>

      {active && (
        <ChallengeCard
          key={active.id}
          challenge={active}
          onAnswer={(correct) => report(correct, active.feedback)}
          onDone={() => complete(active.id)}
          isLast={answered.length === spinsNeeded - 1}
        />
      )}

      {done && (
        <CongratulationsPopup
          title={mission.reward?.title || 'Wheel Complete!'}
          message={mission.reward?.message}
          onNext={onNext}
        />
      )}
    </GameShell>
  );
};

const ChallengeCard = ({
  challenge,
  onAnswer,
  onDone,
  isLast,
}: {
  challenge: WheelChallenge;
  onAnswer: (correct: boolean) => void;
  onDone: () => void;
  isLast: boolean;
}) => {
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [text, setText] = useState('');
  const isOpen = !challenge.options?.length;

  const choose = (i: number) => {
    const correct = i === challenge.answerIndex;
    onAnswer(correct);
    if (correct) setSolved(true);
    else setWrong((prev) => [...prev, i]);
  };

  const submitOpen = () => {
    if (text.trim().length < MIN_OPEN_ANSWER) return;
    onAnswer(true);
    setSolved(true);
  };

  const state = (i: number): ChoiceState => {
    if (solved) return i === challenge.answerIndex ? 'correct' : 'muted';
    return wrong.includes(i) ? 'wrong' : 'idle';
  };

  const feedback = useMemo(() => {
    if (solved) return challenge.feedback?.correct ?? (isOpen ? 'Great thinking!' : 'Correct!');
    if (wrong.length) return challenge.feedback?.incorrect ?? 'Good try! Have another go.';
    return null;
  }, [solved, wrong.length, challenge, isOpen]);

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className="absolute inset-0 bg-black/40 justify-end"
    >
      <Animated.View
        entering={FadeInDown.springify().damping(16)}
        className="bg-[#F4F9F4] rounded-t-[24px] max-h-[88%]"
      >
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="p-5 gap-3"
        >
          <View className="self-start bg-[#DBEFDC] rounded-full px-3 py-1">
            <Text className="text-primary font-sansSemiBold text-[12px]">
              {challenge.label.toUpperCase()}
            </Text>
          </View>
          {challenge.scenario && (
            <Text className="text-dark/80 font-sansMedium text-[14px] leading-[20px]">
              {challenge.scenario}
            </Text>
          )}
          <Text className="text-dark font-sansSemiBold text-[17px] leading-[24px]">
            {challenge.question}
          </Text>

          {isOpen ? (
            <>
              <TextInput
                value={text}
                onChangeText={setText}
                editable={!solved}
                multiline
                placeholder="Type your answer..."
                placeholderTextColor="#918E91"
                className="bg-white rounded-[14px] border-2 border-[#DBEFDC] px-4 py-3 min-h-[90px] text-dark font-sans text-[15px]"
                textAlignVertical="top"
              />
              {!solved && (
                <Button
                  text="Submit"
                  haptic
                  disabled={text.trim().length < MIN_OPEN_ANSWER}
                  onPress={submitOpen}
                />
              )}
            </>
          ) : (
            <View className="gap-2">
              {challenge.options!.map((option, i) => (
                <ChoiceButton
                  key={option}
                  label={option}
                  letter={LETTERS[i]}
                  state={state(i)}
                  disabled={solved || wrong.includes(i)}
                  onPress={() => choose(i)}
                />
              ))}
            </View>
          )}

          {feedback && (
            <Animated.View
              entering={FadeInDown}
              className={twMerge(
                'rounded-[14px] px-4 py-3',
                solved ? 'bg-[#E6F4EB]' : 'bg-[#FBF1EA]',
              )}
            >
              <Text
                className={twMerge(
                  'font-sansMedium text-[14px] leading-[20px]',
                  solved ? 'text-[#265828]' : 'text-[#C8702A]',
                )}
              >
                {feedback}
              </Text>
              {solved && challenge.modelAnswer && (
                <Text className="text-dark font-sansMedium text-[13px] leading-[19px] mt-2">
                  <Text className="font-sansSemiBold">{"Here's one idea: "}</Text>
                  {challenge.modelAnswer}
                </Text>
              )}
            </Animated.View>
          )}

          {solved && (
            <Button text={isLast ? 'Finish' : 'Spin again'} haptic onPress={onDone} />
          )}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default SpinTheWheel;
