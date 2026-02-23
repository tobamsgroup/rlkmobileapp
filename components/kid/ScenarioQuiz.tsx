import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import ProgressBar from '../ProgressBar';

const ScenarioQuiz = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const defaultScenarioQuestion = {
    title: 'Being Responsible',
    scenario:
      'Tomi promised his teacher that he would submit his homework the next day. Instead, he decided to play video games and forgot to finish it.',
    question: 'What should Tomi have done to be responsible?',
    options: {
      A: 'Ignore the homework and hope the teacher forgets.',
      B: 'Finish his homework before playing games.',
      C: 'Blame his friend for distracting him.',
      D: 'Tell the teacher he didn’t feel like doing it.',
    },
  };
  return (
    <View>
      <View className="bg-[#FAFDFF] border-b-2 border-b-[#4CAF50] rounded-[12px] p-6 border border-[#DBEFDC] flex-row items-center gap-6  mb-8">
        <Text className="text-[#265828] font-sansSemiBold text-[16px]">
          Scenario 3 of 5
        </Text>

        <View className="flex-1">
          <ProgressBar percent={30} height={10} />
        </View>
      </View>
      {/* <Mathcing/> */}
      {/* <TrueOrFalse/> */}
      {/* <Scenario
        question={defaultScenarioQuestion}
        selected={selected}
        setSelected={setSelected}
        isCorrect={selected === 'B'}
        isSubmitted={isSubmitted}
        showSubmit={0}
        index={0}
      /> */}
      <Result score={5} />
    </View>
  );
};

function Result({ score }: { score: number }) {
  const message =
    score === 5
      ? 'Awesome choices! You’re learning fast and making great decisions.'
      : score <= 2
        ? 'Good try! Take your time and think it through, you’ll earn more XP next time.'
        : 'Nice effort! You made some good choices, keep practicing to earn more XP.';

  const xp = score === 5 ? '25XP' : '15XP';

  return (
    <View className="p-6 relative bg-white rounded-[20px]">
      <View className="bg-[#DBEFDC99] px-5 py-6 rounded-2xl flex flex-col items-center z-30">
        <Image
          source={IMAGES.Scenario_Avatar_2}
          className="w-[247px] h-[138px]"
          resizeMode="contain"
        />

        <Text className="text-center text-[18px] text-dark font-sansMedium mb-6 mt-4">
          {message}
        </Text>

        <View className="py-4 px-6 border border-b-2 border-[#DBEFDC] rounded-full flex-row items-center gap-2">
          <ICONS.Star2 />

          <Text className="font-sansMedium text-[16px]">Total XP Earned:</Text>

          <Text className="text-[#337535] text-[16px] font-sansMedium">+{xp}</Text>
        </View>
      </View>
      <Image
        source={IMAGES.Scenario_Corner_3}
        alt="corner3"
        className="absolute top-0 right-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
      />
      <Image
        source={IMAGES.Scenario_Corner_1}
        alt="corner1"
        className="absolute bottom-0 left-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
      />
      <Image
        source={IMAGES.Scenario_Corner_2}
        alt="corner2"
        className="absolute top-0 left-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
      />
      <Image
        source={IMAGES.Scenario_Corner_4}
        alt="corner4"
        className="absolute bottom-0 right-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
      />
    </View>
  );
}

export default ScenarioQuiz;
