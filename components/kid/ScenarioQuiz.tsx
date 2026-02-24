import { claimXP } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import useScenarioQuizQuestions from '@/hooks/useScenarioQuestions';
import { shuffleArray } from '@/utils';
import { invalidateQueries } from '@/utils/query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import Matching from './Matching';
import { QuizLoadingScreen } from './Quiz';
import Scenario from './Scenario';
import TrueOrFalse from './TrueOrFalse';
import UnscrambleGame from './Unscramble';

const ScenarioQuiz = ({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) => {
  const {
    book: bookId,
    series: seriesId,
    chapterId,
    lessonId,
    mode,
    page = 'mid',
  } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  const [showSubmit, setShowSubmit] = useState<null | number>(null);

  const { data, isLoading } = useScenarioQuizQuestions(chapterId as string);

  const QUESTIONS = useMemo(() => {
    if (!data) return [];
    return shuffleArray([
      ...(data?.multipleChoice.map((item) => ({
        type: 'scenario' as const,
        ...item,
      })) || []),
      ...(data?.trueOrFalse.map((item) => ({
        type: 'trueOrFalse' as const,
        ...item,
      })) || []),
      ...(data?.matchingScenario.map((item) => ({
        type: 'matching' as const,
        ...item,
      })) || []),
      ...(data?.unscramble.map((item) => ({
        type: 'unscramble' as const,
        ...item,
        answer: item?.answer?.toUpperCase(),
      })) || []),
    ]);
  }, [data]);

  const question = useMemo(() => {
    return QUESTIONS[index];
  }, [QUESTIONS, index]);

  const handleSubmit = () => {
    if (selected === null) return;
    if (selected === question.answer) {
      setScore((score) => score + 1);
    }
    setIsSubmitted(true);
    if (index === QUESTIONS?.length - 1) {
      claimXP(score === 5 ? 25 : 15).then(() =>
        invalidateQueries('kid_profile'),
      );
    }
  };

  const isCorrect = isSubmitted && selected === question.answer;
  const handleNext = () => {
    if (isCompleted) {
      onNext();
      return;
    }
    if (index === QUESTIONS?.length - 1) {
      setIsCompleted(true);
      return;
    }
    setIsSubmitted(false);
    setSelected(null);
    setIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setSelected(null);
    setIsSubmitted(false);
    setResetTrigger((prev) => prev + 1);
  };

  const handleBack = () => {
    if (index === 0) {
      onPrev();
      return;
    }
    setIndex((prev) => prev - 1);
  };
  return (
    <View>
      {isLoading && <QuizLoadingScreen />}
      {!!QUESTIONS?.length && !isLoading && (
        <>
          {!isCompleted && (
            <View className="bg-[#FAFDFF] border-b-2 border-b-[#4CAF50] rounded-[12px] p-6 border border-[#DBEFDC] flex-row items-center gap-6  mb-8">
              <Text className="text-[#265828] font-sansSemiBold text-[16px]">
                {index + 1} of {QUESTIONS?.length}
              </Text>

              <View className="flex-1">
                <ProgressBar
                  percent={((index + 1) / QUESTIONS?.length) * 100}
                  height={10}
                />
              </View>
            </View>
          )}

          {!isCompleted && (
            <>
              <View className=" rounded-[20px] bg-white relative z-[150] w-full ">
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
                {question.type === 'scenario' && (
                  <Scenario
                    isCorrect={isCorrect}
                    setSelected={setSelected}
                    selected={selected}
                    question={question}
                    isSubmitted={isSubmitted}
                    key={question?.title}
                    showSubmit={showSubmit}
                    index={index}
                  />
                )}
                {question.type === 'trueOrFalse' && (
                  <TrueOrFalse
                    question={question}
                    isSubmitted={isSubmitted}
                    setSelected={setSelected}
                    selected={selected}
                  />
                )}
                {question.type === 'matching' && (
                  <Matching
                    question={question}
                    isSubmitted={isSubmitted}
                    setSelected={setSelected}
                    selected={selected}
                    resetTrigger={resetTrigger}
                  />
                )}
                {question.type === 'unscramble' && (
                  <UnscrambleGame
                    question={question}
                    isSubmitted={isSubmitted}
                    setSelected={setSelected}
                    resetTrigger={resetTrigger}
                  />
                )}

                {isSubmitted && (
                  <View className="p-6 z-30">
                    <View className="border border-[#D3D2D333] mb-8" />
                    <View
                      className={twMerge(
                        'bg-[#FFFFFF1A] border rounded-[12px] p-5',
                        isCorrect ? 'border-[#6ABC6D]' : 'border-[#AA8F00]',
                      )}
                    >
                      <View className="flex-row items-center gap-2">
                        {isCorrect ? (
                          <ICONS.PartyPopper />
                        ) : (
                          <ICONS.Bulb
                            stroke={'#D5B300'}
                            width={20}
                            height={20}
                          />
                        )}
                        <Text className="text-[16px]  text-dark font-sansMedium ">
                          {isCorrect ? 'Great Job!' : 'Hint:'}
                        </Text>
                      </View>
                      <Text className="text-[16px] font-sansMedium text-dark mt-2">
                        {isCorrect
                          ? question.feedback.correct
                          : question.feedback.incorrect}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View className="flex-row justify-center mt-5 gap-4 items-center">
                {isCompleted ? (
                  <>
                    <Button
                      onPress={() => {
                        setIndex(0);
                        setSelected(null);
                        setIsSubmitted(false);
                        setIsCompleted(false);
                        setScore(0);
                        setResetTrigger((prev) => prev + 1);
                      }}
                      className=" border-none flex items-center justify-center gap-2 z-100"
                      textClassname="text-xl font-semibold text-[#806C00]"
                      text="REPEAT"
                    />

                    <Button
                      onPress={onNext}
                      className=" lg:px-16 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                    >
                      <Text className="text-xl font-semibold text-white">
                        NEXT
                      </Text>
                      <ICONS.ChevronRight stroke="white" strokeWidth="3" />
                    </Button>
                  </>
                ) : (
                  <>
                    {question && (
                      <>
                        {question.type === 'scenario' ? (
                          <>
                            {showSubmit !== index ? (
                              <Button
                                onPress={() => setShowSubmit(index)}
                                className=" font-semibold lg:px-16 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                              >
                                <Text className="text-[18px] uppercase lg:text-xl text-white">
                                  Answer Question
                                </Text>
                                <ICONS.ChevronRight
                                  stroke="white"
                                  strokeWidth="3"
                                />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onPress={handleBack}
                                  className="bg-[#FFF7CC] text-[18px] lg:text-xl border-b-[#806C00] font-semibold  border-none lg:px-10 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                                >
                                  <ICONS.ChevronLeft
                                    stroke="#806C00"
                                    strokeWidth="3"
                                  />
                                  <Text className="text-[18px] uppercase lg:text-xl text-[#806C00]">
                                    BACK
                                  </Text>
                                </Button>

                                <Button
                                  onPress={handleNext}
                                  className="text-[18px] lg:text-xl font-semibold lg:px-16 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                                >
                                  <Text className="text-xl font-semibold text-white">
                                    NEXT
                                  </Text>
                                  <ICONS.ChevronRight
                                    stroke="white"
                                    strokeWidth="3"
                                  />
                                </Button>
                              </>
                            )}
                          </>
                        ) : (
                          // Non-scenario questions (unscramble, matching, etc.)
                          <>
                            <Button
                              onPress={() => {
                                if (
                                  (question.type === 'unscramble' ||
                                    question.type === 'matching') &&
                                  selected !== null &&
                                  !isCorrect &&
                                  isSubmitted
                                ) {
                                  handleReset();
                                } else {
                                  handleBack();
                                }
                              }}
                              className="bg-[#FFF7CC] text-[18px] lg:text-xl border-b-[#806C00]  font-semibold text-[#806C00] border-none lg:px-10 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                            >
                              {!(
                                question.type === 'unscramble' ||
                                question.type === 'matching'
                              ) ||
                              selected === null ||
                              isCorrect ||
                              !isSubmitted ? (
                                <View className="rotate-90">
                                  <ICONS.ChevronDown
                                    stroke="#806C00"
                                    strokeWidth="3"
                                  />
                                </View>
                              ) : null}
                              <Text className="text-xl font-semibold text-[#806C00]">
                                {(question.type === 'unscramble' ||
                                  question.type === 'matching') &&
                                selected !== null &&
                                !isCorrect &&
                                isSubmitted
                                  ? 'RESET'
                                  : 'BACK'}
                              </Text>
                            </Button>

                            <Button
                              onPress={() => {
                                if (
                                  (question.type === 'unscramble' ||
                                    question.type === 'matching') &&
                                  selected !== null &&
                                  !isCorrect &&
                                  isSubmitted
                                ) {
                                  handleNext();
                                } else if (selected === null || !isSubmitted) {
                                  handleSubmit();
                                } else {
                                  handleNext();
                                }
                              }}
                              className="text-[18px] lg:text-xl font-semibold lg:px-16 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                            >
                              <Text className="text-[18px] lg:text-xl text-white font-semibold">
                                {(question.type === 'unscramble' ||
                                  question.type === 'matching') &&
                                selected !== null &&
                                !isCorrect &&
                                isSubmitted
                                  ? 'SKIP'
                                  : selected === null || !isSubmitted
                                    ? 'SUBMIT'
                                    : 'NEXT'}
                              </Text>
                              <ICONS.ChevronRight
                                stroke="white"
                                strokeWidth="3"
                              />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
            </>
          )}

          {isCompleted && <Result score={score} />}
        </>
      )}
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

          <Text className="text-[#337535] text-[16px] font-sansMedium">
            +{xp}
          </Text>
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
