import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import Button from '@/components/Button';
import { AdventureMission } from '@/types/mission';
import CongratulationsPopup from './CongratulationsPopup';
import { toImageSource, useMissionFeedback } from './shared';
import { ChoiceButton, ChoiceState, GameHero, IconTile, LETTERS } from './ui';

/**
 * Model 6: Choose Your Adventure. A short story with decision points; each
 * choice shows its consequence and can branch to a different stage. The
 * ending depends on how many strong decisions the child made.
 */
const ChooseYourAdventure = ({
  mission,
  onNext,
}: {
  mission: AdventureMission;
  onNext: () => void;
}) => {
  const { report } = useMissionFeedback(mission);
  const [stageId, setStageId] = useState(mission.stages[0]?.id);
  const [picked, setPicked] = useState<number | null>(null);
  const [strongCount, setStrongCount] = useState(0);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const stageIndex = mission.stages.findIndex((s) => s.id === stageId);
  const stage = mission.stages[stageIndex];
  if (!stage) return null;

  const choice = picked !== null ? stage.choices[picked] : null;
  const nextStageId =
    choice?.next ?? mission.stages[stageIndex + 1]?.id ?? null;

  const pick = (index: number) => {
    const chosen = stage.choices[index];
    setPicked(index);
    if (chosen.strong) {
      setStrongCount((n) => n + 1);
      report(true);
    }
  };

  const advance = () => {
    if (!nextStageId) return setDone(true);
    setStageId(nextStageId);
    setPicked(null);
    setStep((s) => s + 1);
  };

  const choiceState = (index: number): ChoiceState => {
    if (picked === null) return 'idle';
    if (index !== picked) return 'muted';
    return stage.choices[index].strong ? 'correct' : 'wrong';
  };

  const ending = [...(mission.outcomes ?? [])]
    .sort((a, b) => b.minStrong - a.minStrong)
    .find((o) => strongCount >= o.minStrong);

  return (
    <View>
      <GameHero mission={mission} className="pb-5">
        {/* Progress through the story */}
        <View className="flex-row items-center gap-1.5 mt-4">
          {mission.stages.map((s, i) => (
            <View
              key={s.id}
              className={twMerge(
                'h-2 flex-1 rounded-full bg-white/25',
                i < step && 'bg-[#D5B300]',
              )}
            />
          ))}
        </View>
        <Text className="text-white/85 font-sansSemiBold text-[11px] tracking-[1px] mt-2">
          DECISION {step} OF {mission.stages.length}
        </Text>
      </GameHero>

      {/* The stage, tucked under the hero */}
      <Animated.View
        key={stage.id}
        entering={FadeInDown.duration(400)}
        className="-mt-5 bg-white rounded-[22px] p-4 gap-3 border-b-[3px] border-[#D9E8DA]"
      >
        <View className="flex-row items-center gap-3">
          <IconTile icon={stage.icon ?? '🧭'} size={44} rounded={22} />
          {stage.title && (
            <Text className="flex-1 text-dark font-sansSemiBold text-[18px] leading-[24px]">
              {stage.title}
            </Text>
          )}
        </View>

        <View className="flex-row items-center gap-3">
          {stage.image && (
            <Image
              source={toImageSource(stage.image)}
              style={{ width: 84, height: 84 }}
              resizeMode="contain"
            />
          )}
          <View className="flex-1 bg-[#EEF7EE] rounded-[18px] rounded-tl-[6px] px-3.5 py-3">
            <Text className="text-dark font-sans text-[14px] leading-[21px]">
              {stage.story}
            </Text>
          </View>
        </View>

        <Text className="text-[#265828] font-sansSemiBold text-[17px] mt-1">
          {stage.question}
        </Text>
        <View className="gap-2.5">
          {stage.choices.map((c, i) => (
            <ChoiceButton
              key={c.label}
              label={c.label}
              image={c.image}
              letter={LETTERS[i]}
              state={choiceState(i)}
              disabled={picked !== null}
              onPress={() => pick(i)}
            />
          ))}
        </View>

        {choice && (
          <Animated.View
            entering={FadeInUp.duration(350)}
            className={twMerge(
              'rounded-[18px] p-4 mt-1 border-[1.5px]',
              choice.strong
                ? 'bg-[#E6F4EB] border-[#3F9243]'
                : 'bg-[#FDF1E8] border-[#E39A5C]',
            )}
          >
            <Text
              className={twMerge(
                'font-sansSemiBold text-[17px]',
                choice.strong ? 'text-[#265828]' : 'text-[#A85A1C]',
              )}
            >
              {choice.strong ? 'Great decision! 🌟' : 'Hmm, think about it 🤔'}
            </Text>
            <Text className="text-dark font-sansMedium text-[14px] leading-[21px] mt-1.5">
              {choice.outcome}
            </Text>
            {stage.lesson && (
              <View className="flex-row gap-2.5 bg-white rounded-[14px] px-3 py-2.5 mt-3">
                <Text className="text-[16px]">💡</Text>
                <View className="flex-1">
                  <Text className="text-[#3F9243] font-sansSemiBold text-[11px] tracking-[1px]">
                    LEARNING MESSAGE
                  </Text>
                  <Text className="text-dark font-sansMedium text-[13px] leading-[19px] mt-0.5">
                    {stage.lesson}
                  </Text>
                </View>
              </View>
            )}
            <Button
              className="mt-4"
              text={nextStageId ? 'Next decision' : 'See my result'}
              haptic
              onPress={advance}
            />
          </Animated.View>
        )}
      </Animated.View>

      {done && (
        <CongratulationsPopup
          title={ending?.title || mission.reward?.title || 'Adventure Complete!'}
          message={ending?.message ?? mission.reward?.message}
          onNext={onNext}
        />
      )}
    </View>
  );
};

export default ChooseYourAdventure;
