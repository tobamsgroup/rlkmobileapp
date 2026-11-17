import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { DreamLadderMission } from '@/types/mission';
import { shuffleArray } from '@/utils';
import CongratulationsPopup from './CongratulationsPopup';
import {
  Draggable,
  FeedbackBanner,
  toImageSource,
  useDropTargets,
  useMissionFeedback,
} from './shared';
import { GameShell, Mascot } from './ui';

const RUNG_HEIGHT = 50;
const RUNG_GAP = 10;
const CLIMBER_SIZE = 64;
const CELEBRATE_MS = 900;

/**
 * Model 3: Dream Ladder. Children drag step cards onto the ladder from the
 * bottom rung up; only the next step in order is accepted, and decoy cards
 * that don't belong are explained. The mascot climbs a rung per step.
 */
const DreamLadder = ({
  mission,
  onNext,
}: {
  mission: DreamLadderMission;
  onNext: () => void;
}) => {
  const { register, measure, rects } = useDropTargets();
  const { feedback, report } = useMissionFeedback(mission);
  const [placed, setPlaced] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [done, setDone] = useState(false);

  const steps = mission.steps;
  const cards = useMemo(
    () => shuffleArray([...mission.steps, ...(mission.distractors ?? [])]),
    [mission],
  );
  const complete = placed === steps.length;

  // Climber stands on the highest filled rung
  const climb = useSharedValue(0);
  useEffect(() => {
    climb.value = withSpring(placed * (RUNG_HEIGHT + RUNG_GAP), {
      damping: 12,
    });
  }, [placed, climb]);
  const climberStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -climb.value }],
  }));

  useEffect(() => {
    if (!complete) return;
    const timer = setTimeout(() => setDone(true), CELEBRATE_MS);
    return () => clearTimeout(timer);
  }, [complete]);

  const handleDrop = (cardId: string, target: string | null) => {
    if (!target || complete) return;
    const expected = steps[placed];

    if (cardId === expected.id) {
      report(true);
      setPlaced((n) => n + 1);
      return;
    }

    const distractor = mission.distractors?.find((d) => d.id === cardId);
    const step = steps.find((s) => s.id === cardId);
    report(false, {
      incorrect:
        distractor?.feedback ??
        (distractor
          ? "That doesn't belong on this ladder. Try another card!"
          : step?.hint ??
            mission.feedback?.incorrect ??
            'Almost there! Think about what needs to happen first.'),
    });
  };

  const remaining = cards.filter(
    (c) => !steps.slice(0, placed).some((s) => s.id === c.id),
  );
  const ladderHeight = steps.length * (RUNG_HEIGHT + RUNG_GAP);

  return (
    <GameShell
      mission={mission}
      aside={
        <View className="bg-white/15 rounded-full px-3 py-1.5">
          <Text className="text-white font-sansSemiBold text-[13px]">
            {placed}/{steps.length}
          </Text>
        </View>
      }
    >
      <FeedbackBanner feedback={feedback} />

      <View className="flex-1 flex-row px-3 pt-3 pb-3 gap-3">
        {/* Ladder */}
        <View className="flex-[1.15] justify-end">
          <Goal mission={mission} reached={complete} />

          <View
            ref={register('ladder')}
            style={{ height: ladderHeight }}
            className={twMerge(
              'rounded-[14px] px-1',
              hovering && 'bg-white/10',
            )}
          >
            <Rail side="left" />
            <Rail side="right" />

            {/* Rungs, top step first */}
            <View className="flex-1 justify-end" style={{ gap: RUNG_GAP }}>
              {[...steps].reverse().map((step, i) => {
                const index = steps.length - 1 - i;
                const filled = index < placed;
                const next = index === placed;
                return (
                  <View
                    key={step.id}
                    style={{ height: RUNG_HEIGHT }}
                    className={twMerge(
                      'mx-3 rounded-[10px] border-2 flex-row items-center px-2 gap-2',
                      filled
                        ? 'bg-[#E6F4EB] border-[#3F9243]'
                        : next
                          ? 'bg-white/20 border-dashed border-[#D5B300]'
                          : 'bg-white/5 border-dashed border-white/30',
                    )}
                  >
                    <View
                      className={twMerge(
                        'w-6 h-6 rounded-full items-center justify-center',
                        filled ? 'bg-[#3F9243]' : 'bg-white/25',
                      )}
                    >
                      <Text className="text-white font-sansSemiBold text-[11px]">
                        {index + 1}
                      </Text>
                    </View>
                    {filled ? (
                      <Animated.Text
                        entering={ZoomIn.springify().damping(14)}
                        numberOfLines={2}
                        className="flex-1 text-[#265828] font-sansMedium text-[11px] leading-[14px]"
                      >
                        {step.label}
                      </Animated.Text>
                    ) : (
                      next && (
                        <Text className="flex-1 text-white/80 font-sansMedium text-[11px]">
                          Drop step {index + 1} here
                        </Text>
                      )
                    )}
                  </View>
                );
              })}
            </View>

            {/* Climber */}
            <Animated.View
              pointerEvents="none"
              style={[
                climberStyle,
                {
                  position: 'absolute',
                  right: -CLIMBER_SIZE / 2.5,
                  bottom: -CLIMBER_SIZE / 2.5,
                },
              ]}
            >
              <Mascot image={mission.mascot} size={CLIMBER_SIZE} />
            </Animated.View>
          </View>
        </View>

        {/* Cards */}
        <View style={{ zIndex: 10 }} className="flex-1 justify-center gap-2">
          {remaining.map((card) => (
            <Draggable
              key={card.id}
              id={card.id}
              targets={rects}
              onDragStart={measure}
              onHover={(t) => setHovering(t === 'ladder')}
              onDrop={handleDrop}
            >
              <View className="bg-white rounded-[12px] px-3 py-2.5 flex-row items-center gap-2 border-b-4 border-[#DBEFDC]">
                {card.image && (
                  <Image
                    source={toImageSource(card.image)}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                )}
                <Text className="flex-1 text-dark font-sansMedium text-[12px] leading-[16px]">
                  {card.label}
                </Text>
              </View>
            </Draggable>
          ))}
        </View>
      </View>

      {done && (
        <CongratulationsPopup
          title={mission.reward?.title || 'You reached the top!'}
          message={mission.reward?.message}
          onNext={onNext}
        />
      )}
    </GameShell>
  );
};

const Rail = ({ side }: { side: 'left' | 'right' }) => (
  <LinearGradient
    colors={['#F0C987', '#B9823F']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      position: 'absolute',
      top: -12,
      bottom: 0,
      width: 8,
      borderRadius: 4,
      [side]: 4,
    }}
  />
);

const Goal = ({
  mission,
  reached,
}: {
  mission: DreamLadderMission;
  reached: boolean;
}) => (
  <View className="items-center mb-4">
    {mission.goal?.image ? (
      <Image
        source={toImageSource(mission.goal.image)}
        style={{ width: 56, height: 56 }}
        resizeMode="contain"
      />
    ) : (
      <Text className="text-[34px]">🏁</Text>
    )}
    <Text className="text-white font-sansSemiBold text-[12px] text-center">
      {mission.goal?.label ?? 'Goal'}
    </Text>
    {reached && (
      <Animated.Text
        entering={FadeIn}
        className="text-[#D5B300] font-sansSemiBold text-[12px]"
      >
        Mission complete!
      </Animated.Text>
    )}
  </View>
);

export default DreamLadder;
