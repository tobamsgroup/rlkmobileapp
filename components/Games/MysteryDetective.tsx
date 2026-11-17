import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';

import Button from '@/components/Button';
import { MysteryMission } from '@/types/mission';
import CongratulationsPopup from './CongratulationsPopup';
import { toImageSource, useMissionFeedback } from './shared';
import {
  ChoiceButton,
  ChoiceState,
  GameBar,
  GameIntro,
  IconTile,
  LETTERS,
  Pill,
  ScoreBadge,
} from './ui';

const DEFAULT_POINTS = [100, 75, 50];

const HOW_TO_PLAY = [
  { icon: '📂', text: 'Read the case and the first clue.' },
  { icon: '💡', text: 'Stuck? Reveal another clue.' },
  { icon: '⭐', text: 'Solve it with fewer clues to earn more points!' },
];

/**
 * Model 5: Mystery Detective. Clues are revealed one at a time; solving
 * with fewer clues earns more points. A wrong answer reveals the next clue
 * so the child always has something new to work with.
 */
const MysteryDetective = ({
  mission,
  onNext,
}: {
  mission: MysteryMission;
  onNext: () => void;
}) => {
  const { report } = useMissionFeedback(mission);
  // Step 1 is the story and how to play, step 2 the cases
  const [started, setStarted] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [cluesShown, setCluesShown] = useState(1);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solvedPoints, setSolvedPoints] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const mysteryCase = mission.cases[caseIndex];
  const points = mission.points ?? DEFAULT_POINTS;
  const solved = solvedPoints !== null;
  const isLast = caseIndex === mission.cases.length - 1;

  if (!mysteryCase) return null;

  const cluesLeft = mysteryCase.clues.length - cluesShown;
  const revealClue = () =>
    setCluesShown((n) => Math.min(n + 1, mysteryCase.clues.length));

  const answer = (index: number) => {
    if (index === mysteryCase.answerIndex) {
      const earned = points[cluesShown - 1] ?? points[points.length - 1] ?? 0;
      setSolvedPoints(earned);
      setScore((s) => s + earned);
      report(true, mysteryCase.feedback);
    } else {
      setWrong((prev) => [...prev, index]);
      report(false, mysteryCase.feedback);
      revealClue();
    }
  };

  const nextCase = () => {
    if (isLast) return setDone(true);
    setCaseIndex((i) => i + 1);
    setCluesShown(1);
    setWrong([]);
    setSolvedPoints(null);
  };

  const choiceState = (index: number): ChoiceState => {
    if (solved) return index === mysteryCase.answerIndex ? 'correct' : 'muted';
    return wrong.includes(index) ? 'wrong' : 'idle';
  };

  const caseNumber = String(caseIndex + 1).padStart(3, '0');

  if (!started) {
    const count = mission.cases.length;
    return (
      <GameIntro
        mission={mission}
        steps={HOW_TO_PLAY}
        stat={`${count} ${count === 1 ? 'CASE' : 'CASES'}`}
        cta="Start investigating"
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <Animated.View entering={FadeInRight.duration(350)} className="gap-3">
      <GameBar
        mission={mission}
        badge={<ScoreBadge value={score} />}
        onInfo={() => setStarted(false)}
      />

      {/* The case */}
      <Animated.View
        key={mysteryCase.id}
        entering={FadeInDown.duration(400)}
        className="bg-white rounded-[22px] p-4 border-b-[3px] border-[#D9E8DA]"
      >
        <Pill>
          CASE {caseNumber}
          {mission.cases.length > 1 ? ` OF ${mission.cases.length}` : ''}
        </Pill>
        <Text className="text-dark font-sansSemiBold text-[19px] leading-[25px] mt-2">
          {mysteryCase.title}
        </Text>

        <View className="flex-row gap-3 mt-3">
          {(mysteryCase.image || mysteryCase.icon) && (
            <View className="w-[96px] min-h-[96px] rounded-[16px] bg-[#EEF7EE] items-center justify-center overflow-hidden">
              {mysteryCase.image ? (
                <Image
                  source={toImageSource(mysteryCase.image)}
                  style={{
                    width: 96,
                    height: 96,
                    tintColor:
                      mysteryCase.silhouette && !solved ? '#1B3A1D' : undefined,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-[46px]">{mysteryCase.icon}</Text>
              )}
            </View>
          )}
          <View className="flex-1 bg-[#EEF7EE] rounded-[16px] px-3.5 py-3 justify-center">
            <Text className="text-dark font-sans text-[14px] leading-[21px]">
              {mysteryCase.mystery}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Clues */}
      {mysteryCase.clues.slice(0, cluesShown).map((clue, i) => (
        <Animated.View
          key={`${mysteryCase.id}-${i}`}
          entering={FadeInDown.duration(350)}
          className="flex-row items-center gap-3 bg-white rounded-[18px] px-3.5 py-3 border-b-[3px] border-[#D9E8DA]"
        >
          <IconTile icon="🔍" size={44} rounded={22} />
          <View className="flex-1 gap-1">
            <Pill>CLUE {i + 1}</Pill>
            <Text className="text-dark font-sansMedium text-[14px] leading-[20px]">
              {clue}
            </Text>
          </View>
        </Animated.View>
      ))}

      {!solved && cluesLeft > 0 && (
        <Pressable
          onPress={revealClue}
          className="flex-row items-center justify-center gap-2 border-[1.5px] border-dashed border-[#3F9243] bg-white/60 rounded-full px-5 py-3 active:bg-white"
        >
          <Text className="text-[16px]">💡</Text>
          <Text className="text-[#265828] font-sansSemiBold text-[14px]">
            Reveal next clue ({cluesLeft} left)
          </Text>
          <Text className="text-[#265828] font-sansSemiBold text-[16px]">›</Text>
        </Pressable>
      )}

      {/* The question */}
      <Text className="text-[#265828] font-sansSemiBold text-[17px] leading-[23px] mt-1 px-1">
        {mysteryCase.question}
      </Text>
      <View className="gap-2.5">
        {mysteryCase.options.map((option, i) => (
          <ChoiceButton
            key={option.label}
            label={option.label}
            image={option.image}
            letter={LETTERS[i]}
            state={choiceState(i)}
            disabled={solved || wrong.includes(i)}
            onPress={() => answer(i)}
          />
        ))}
      </View>

      {wrong.length > 0 && !solved && (
        <Animated.View
          key={wrong.length}
          entering={FadeIn}
          className="flex-row items-center gap-2 bg-[#FDF1E8] rounded-[14px] px-3.5 py-2.5"
        >
          <Text className="text-[16px]">🤔</Text>
          <Text className="flex-1 text-[#A85A1C] font-sansMedium text-[13px] leading-[19px]">
            {mysteryCase.feedback?.incorrect ??
              'Not quite, detective! Check the clues and try again.'}
          </Text>
        </Animated.View>
      )}

      {solved && (
        <Animated.View
          entering={ZoomIn.springify().damping(14)}
          className="bg-[#E6F4EB] rounded-[22px] p-4 border-2 border-[#3F9243]"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[#265828] font-sansSemiBold text-[18px]">
              Case solved! 🕵️
            </Text>
            <View className="bg-[#D5B300] rounded-full px-3 py-1">
              <Text className="text-white font-sansSemiBold text-[14px]">
                +{solvedPoints}
              </Text>
            </View>
          </View>
          <Text className="text-dark font-sansMedium text-[14px] leading-[21px] mt-2">
            {mysteryCase.resolution}
          </Text>
          <Button
            className="mt-4"
            text={isLast ? 'Finish' : 'Next case'}
            haptic
            onPress={nextCase}
          />
        </Animated.View>
      )}

      {done && (
        <CongratulationsPopup
          title={mission.reward?.title || 'Case Closed!'}
          message={`${mission.reward?.message ? `${mission.reward.message}\n\n` : ''}Detective points: ${score}`}
          onNext={onNext}
        />
      )}
    </Animated.View>
  );
};

export default MysteryDetective;
