import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { MatchMission, MatchSide } from '@/types/mission';
import { shuffleArray } from '@/utils';
import CongratulationsPopup from './CongratulationsPopup';
import {
  Draggable,
  toImageSource,
  useDropTargets,
  useMissionFeedback,
} from './shared';
import { GameBar, GameIntro, IconTile, Pill } from './ui';

const ROW_HEIGHT = 78;
const CARD_HEIGHT = 74;
const CARD_GAP = 10;

const HOW_TO_PLAY = [
  { icon: '👀', text: 'Look at each card on the left.' },
  { icon: '✋', text: 'Drag its partner into the slot, or tap a card then tap the slot.' },
  { icon: '🏆', text: 'Match every pair to finish the mission!' },
];

/**
 * Model 4: Match the Inventor. Children drag each answer onto its partner
 * (inventor → invention, tool → job, concept → definition), or tap an
 * answer and then its slot.
 */
const MatchGame = ({
  mission,
  onNext,
}: {
  mission: MatchMission;
  onNext: () => void;
}) => {
  const { register, measure, rects } = useDropTargets();
  const { feedback, report } = useMissionFeedback(mission);
  // Step 1 is the story and how to play, step 2 the board
  const [started, setStarted] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  // Tap an answer, then tap its slot
  const [selected, setSelected] = useState<string | null>(null);
  const [poolWidth, setPoolWidth] = useState(0);

  const { prompts, answers } = useMemo(
    () => ({
      prompts: shuffleArray([...mission.pairs]),
      answers: shuffleArray([...mission.pairs]),
    }),
    [mission],
  );

  const handleDrop = (answerId: string, promptId: string | null) => {
    setSelected(null);
    if (!promptId || matched.includes(promptId)) return;
    const correct = answerId === promptId;
    report(correct, mission.pairs.find((p) => p.id === promptId)?.feedback);
    if (correct) setMatched((prev) => [...prev, answerId]);
  };

  const done =
    mission.pairs.length > 0 && matched.length === mission.pairs.length;
  const remaining = answers.filter((pair) => !matched.includes(pair.id));
  const cardWidth = (poolWidth - CARD_GAP) / 2;

  if (!started) {
    return (
      <GameIntro
        mission={mission}
        steps={HOW_TO_PLAY}
        stat={`${mission.pairs.length} PAIRS`}
        cta="Start matching"
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <Animated.View entering={FadeInRight.duration(350)} className="gap-3">
      <GameBar mission={mission} onInfo={() => setStarted(false)} />

      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        className="bg-white rounded-[22px] p-3.5 gap-2.5 border-b-[3px] border-[#D9E8DA]"
      >
        <View className="flex-row items-center justify-between px-1">
          <Pill>MATCH THE PAIRS</Pill>
          <Text className="text-[#265828] font-sansSemiBold text-[13px]">
            {matched.length} / {mission.pairs.length}
          </Text>
        </View>

        {prompts.map((pair) => {
          const isMatched = matched.includes(pair.id);
          return (
            <View
              key={pair.id}
              style={{ height: ROW_HEIGHT }}
              className="flex-row gap-2.5"
            >
              <View className="w-[42%] flex-row items-center gap-2 bg-[#F3FAF3] rounded-[16px] px-2.5 border border-[#E1EEE2]">
                {pair.prompt.image ? (
                  <Image
                    source={toImageSource(pair.prompt.image)}
                    style={{ width: 50, height: 58, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ) : (
                  <IconTile icon={pair.prompt.icon} size={34} tint="#FFFFFF" />
                )}
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  className="flex-1 text-[#265828] font-sansSemiBold text-[13px] leading-[17px]"
                >
                  {pair.prompt.label}
                </Text>
              </View>

              <Pressable
                ref={register(pair.id)}
                disabled={isMatched || !selected}
                onPress={() => selected && handleDrop(selected, pair.id)}
                className="flex-1"
              >
                {isMatched ? (
                  <Animated.View
                    entering={ZoomIn.springify().damping(14)}
                    className="flex-1 flex-row items-center gap-2 bg-[#E6F4EB] border-2 border-[#3F9243] rounded-[16px] px-2.5"
                  >
                    <AnswerContent side={pair.answer} />
                    <View className="w-6 h-6 rounded-full bg-[#3F9243] items-center justify-center">
                      <Text className="text-white font-sansSemiBold text-[12px]">
                        ✓
                      </Text>
                    </View>
                  </Animated.View>
                ) : (
                  <View
                    className={twMerge(
                      'flex-1 rounded-[16px] border-2 border-dashed items-center justify-center',
                      hovered === pair.id || selected
                        ? 'border-[#D5B300] bg-[#FFF8E1]'
                        : 'border-[#BFD9C0] bg-white',
                      hovered === pair.id && 'border-solid',
                    )}
                  >
                    <Text className="text-[#8DB58F] font-sansMedium text-[12px]">
                      {selected ? 'Tap to place here' : 'Drop here'}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}
      </Animated.View>

      {/* Hint, replaced by feedback after each try */}
      <Animated.View
        key={feedback?.text ?? 'hint'}
        entering={FadeIn.duration(250)}
        className={twMerge(
          'flex-row items-center gap-2.5 rounded-[16px] px-3.5 py-3 border-[1.5px]',
          !feedback && 'bg-white/70 border-[#D9E8DA]',
          feedback?.correct && 'bg-[#E6F4EB] border-[#3F9243]',
          feedback && !feedback.correct && 'bg-[#FDF1E8] border-[#E39A5C]',
        )}
      >
        <Text className="text-[16px]">
          {!feedback ? '👆' : feedback.correct ? '🌟' : '🤔'}
        </Text>
        <Text
          className={twMerge(
            'flex-1 font-sansMedium text-[13px] leading-[19px]',
            !feedback && 'text-dark',
            feedback?.correct && 'text-[#265828]',
            feedback && !feedback.correct && 'text-[#A85A1C]',
          )}
        >
          {feedback?.text ??
            'Drag each card into its matching slot, or tap a card and then tap the slot.'}
        </Text>
      </Animated.View>

      {/* Cards to place; above the slots while dragging */}
      <View
        style={{ zIndex: 10 }}
        onLayout={(e) => setPoolWidth(e.nativeEvent.layout.width)}
        className="flex-row flex-wrap"
      >
        {poolWidth > 0 &&
          remaining.map((pair, i) => (
            <Draggable
              key={pair.id}
              id={pair.id}
              targets={rects}
              onDragStart={measure}
              onHover={setHovered}
              onDrop={handleDrop}
              style={{
                width: cardWidth,
                height: CARD_HEIGHT,
                marginLeft: i % 2 ? CARD_GAP : 0,
                marginBottom: CARD_GAP,
              }}
            >
              <Pressable
                onPress={() =>
                  setSelected((id) => (id === pair.id ? null : pair.id))
                }
                className={twMerge(
                  'flex-1 flex-row items-center gap-2 bg-white rounded-[16px] px-2.5 border-[1.5px] border-b-[3px]',
                  selected === pair.id
                    ? 'border-[#D5B300] bg-[#FFF8E1]'
                    : 'border-[#E1EEE2] border-b-[#D9E8DA]',
                )}
              >
                <AnswerContent side={pair.answer} />
              </Pressable>
            </Draggable>
          ))}
      </View>

      {done && (
        <CongratulationsPopup
          title={mission.reward?.title}
          message={mission.reward?.message}
          onNext={onNext}
        />
      )}
    </Animated.View>
  );
};

// Picture answers (e.g. inventions) show only the picture, so children
// match by sight
const AnswerContent = ({ side }: { side: MatchSide }) =>
  side.image ? (
    <View className="flex-1 items-center justify-center py-1.5">
      <Image
        source={toImageSource(side.image)}
        style={{ width: '100%', height: '100%', borderRadius: 10 }}
        resizeMode="contain"
      />
    </View>
  ) : (
    <>
      <IconTile icon={side.icon} size={32} />
      <Text
        numberOfLines={3}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        className="flex-1 text-dark font-sansMedium text-[12.5px] leading-[16px]"
      >
        {side.label}
      </Text>
    </>
  );

export default MatchGame;
