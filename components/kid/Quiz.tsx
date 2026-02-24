import { sendQuizResult } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import useKidProfile from '@/hooks/useKidProfile';
import useQuizQuestions from '@/hooks/useQuizQuestions';
import { QuizQuestion, ReadingProgressProps } from '@/types';
import { getScenario } from '@/utils/kid';
import { invalidateQueries } from '@/utils/query';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import { useLocalSearchParams } from 'expo-router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import Skeleton from '../Skeleton';

const enum Step {
  START = 'START',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
}

const dots = Array.from({ length: 30 }, () => ({
  top: Math.random() * 100,
  left: Math.random() * 100,
}));

const Quiz = ({
  handleNext,
  readingProgress,
}: {
  handleNext: () => void;
  readingProgress?: ReadingProgressProps[];
}) => {
  const {
    book: bookId,
    series: seriesId,
    chapterId,
    lessonId,
    mode,
    page = 'mid',
  } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [diffficulty, setDifficulty] = useState('medium');
  const [selected, setSelected] = useState('');
  const [isStarted, setIsStarted] = useState(true);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [xpEarned, setXPEarned] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [openXp, setOpenXp] = useState(false);
  const [repeatQuiz, setRepeatQuiz] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const currentQuestion = useMemo(() => {
    const targetQuestion = questions[currentIndex - 1];
    const targetVariation = targetQuestion?.variations?.find(
      (v) => v.difficulty === diffficulty,
    );
    return targetVariation;
  }, [questions, currentIndex]);

  const [step, setStep] = useState<Step>(Step.SIX);
  const [openComplete, setOpenConplete] = useState(false);

  const handleReset = () => {
    setSelected('');
    setIsCorrect(false);
    setIsWrong(false);
  };

  const onOptionSelect = (selected: string) => {
    setSelected(selected);
  };

  const previousQuizResult = useMemo(() => {
    if (!readingProgress && !seriesId) return null;

    const targetProgess = readingProgress?.find((r) => r.seriesId === seriesId);
    const targetChapter = targetProgess?.chapters?.find(
      (c) => c.chapterId === chapterId,
    );

    const targetQuiz = targetChapter?.quiz?.find((q) => q.quizType === page);
    // console.log(targetQuiz)
    return targetQuiz;
  }, [readingProgress, seriesId, chapterId]);

  const onSubmit = async () => {
    if (currentIndex === (page === 'mid' ? 5 : 10)) {
      let lastScore = 0;
      if (selected === currentQuestion?.correctAnswer) {
        lastScore = 5;
      }
      const totalScore = page === 'mid' ? 25 : 50;
      const finalScore = score + lastScore;
      const isPerfect = finalScore === totalScore;
      const xpEarned = isPerfect
        ? page === 'mid'
          ? 25
          : 45
        : page === 'mid'
          ? 10
          : 20;
      setFinalScore(finalScore);
      setXPEarned(xpEarned);

      if (isPerfect) {
        setOpenXp(true);
      }

      const payload = {
        bookId: bookId! as string,
        chapterId: chapterId! as string,
        quiz: {
          quizType: page as 'mid' | 'end',
          score: finalScore,
          totalScore,
          attempts: 1,
          passed: finalScore >= (page === 'mid' ? 12 : 25),
          xpEarned,
        },
      };

      //send quiz result synchronously
      sendQuizResult(payload)
        .then(() => console.log('Sent Result'))
        .catch((error) => console.log('Error sending result', error));

      invalidateQueries('reading-progress');
      invalidateQueries('kid_profile');
      invalidateQueries(`quiz-${chapterId}-${page}`);

      setOpenConplete(true);
      return;
    }
    if (selected === currentQuestion?.correctAnswer) {
      setIsCorrect(true);
      setIsWrong(false);
      setScore((prev) => prev + 5);
      if (diffficulty === 'easy') {
        setDifficulty('medium');
      } else if (diffficulty === 'medium') {
        setDifficulty('hard');
      } else {
        setDifficulty('hard');
      }
    } else {
      setIsCorrect(false);
      setIsWrong(true);
      if (diffficulty === 'medium') {
        setDifficulty('easy');
      } else if (diffficulty === 'hard') {
        setDifficulty('medium');
      } else {
        setDifficulty('easy');
      }
    }
  };

  const { data, isLoading } = useQuizQuestions(
    chapterId! as string,
    page as 'mid' | 'end',
    !repeatQuiz
      ? previousQuizResult?.score && previousQuizResult?.quizType === page
        ? true
        : false
      : false,
  );

  useEffect(() => {
    if (data) {
      setQuestions(data?.questions);
    }
  }, [data]);

  const onNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsCorrect(false);
    setIsWrong(false);
  };

  const onRepeat = () => {
    setRepeatQuiz(true);
    invalidateQueries(`quiz-${chapterId}-${page}`);
    setOpenConplete(false);
    setCurrentIndex(1);
  };

  useEffect(() => {
    if (previousQuizResult?.score && previousQuizResult?.quizType === page) {
      setOpenConplete(true);
    }
  }, [previousQuizResult]);
  return (
    <View>
      {isLoading && <QuizLoadingScreen />}
      {!isLoading && (
        <>
          {!openComplete && isStarted && (
            <View className="bg-[#FAFDFF] border-b-2 border-b-[#4CAF50] rounded-[12px] p-6 border border-[#DBEFDC] flex-row items-center gap-6">
              <Text className="text-[#265828] font-sansSemiBold text-[16px]">
                Question {currentIndex} of {page === 'mid' ? 5 : 10}
              </Text>
              <View className="flex-1">
                <ProgressBar
                  percent={(currentIndex / (page === 'mid' ? 5 : 10)) * 100}
                  height={10}
                />
              </View>
            </View>
          )}
          {openComplete && (
            <Reward
              onNext={handleNext}
              onRepeat={onRepeat}
              score={previousQuizResult?.score || finalScore}
              totalScore={page === 'mid' ? 25 : 50}
              xp={previousQuizResult?.xpEarned || xpEarned}
              quizType={page as 'mid' | 'end'}
              retry={false}
              isPrevResult={previousQuizResult?.score ? true : false}
            />
          )}
          {!openComplete && (
            <>
              {!isStarted && (
                <>
                  <View className="flex items-center gap-2 flex-row">
                    <ICONS.Star2 className="max-lg:w-8 max-lg:h-8" />
                    <Text className="text-white font-semibold lg:text-[32px] md:text-2xl text-xl">
                      {page === 'mid' ? 'Mid-Chapter ' : 'Mastery '} Quiz
                    </Text>
                  </View>

                  <Text className="mt-2 text-white lg:text-xl md:text-lg font-medium text-center">
                    {page === 'mid'
                      ? 'Ready to show what you’ve learned so far?'
                      : 'Show off everything you’ve learned!'}
                  </Text>

                  {/* Info Boxes */}
                  <View className="mt-10 bg-[#FFFFFF26] rounded-2xl lg:p-8 p-5 space-y-4 lg:w-3/4 w-full mx-auto">
                    <View className="bg-[#FAFDFF] p-6 rounded-xl flex items-center gap-6 flex-row">
                      <Image
                        source={IMAGES.quiz}
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                      />
                      <Text className="lg:text-xl font-medium">
                        {page === 'mid' ? '5' : '10'} Questions
                      </Text>
                    </View>

                    <View className="bg-[#FAFDFF] p-6 rounded-xl flex items-center gap-6 flex-row">
                      <Image
                        source={IMAGES.rocket}
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                      />
                      <Text className="lg:text-xl font-medium">
                        {page === 'mid'
                          ? 'Complete to Unlock Your Next Adventure'
                          : 'Complete the Quiz to Earn Rewards'}
                      </Text>
                    </View>
                  </View>

                  {/* Start Button */}
                  <View className="flex items-center justify-center my-8 w-full">
                    <Button
                      className="flex items-center justify-center gap-3 text-white h-14 max-md:w-full"
                      onPress={() => setIsStarted(true)}
                    >
                      <View className="flex items-center justify-center gap-3 px-4 py-2 rounded w-full">
                        <Text className="text-white">START QUIZ</Text>
                        <ICONS.ChevronRight stroke="white" />
                      </View>
                    </Button>
                  </View>
                </>
              )}
              {isStarted && (
                <>
                  {currentQuestion?.type === 'mcq' ? (
                    <MCQ
                      onOptionSelect={onOptionSelect}
                      currentQuestion={currentQuestion}
                      selected={selected}
                      isWrong={isWrong}
                      isCorrect={isCorrect}
                    />
                  ) : (
                    <FillIn
                      onOptionSelect={onOptionSelect}
                      onNext={() => setStep(Step.SIX)}
                      currentQuestion={currentQuestion}
                      selected={selected}
                      isWrong={isWrong}
                      isCorrect={isCorrect}
                    />
                  )}
                </>
              )}
            </>
          )}
          {!openComplete && isStarted && (
            <>
              {!isCorrect && !isWrong && (
                <View className="flex items-center justify-center mt-8">
                  <Button
                    className="flex items-center justify-center gap-3 text-white max-md:w-full"
                    onPress={onSubmit}
                    disabled={!selected}
                  >
                    <Text className="text-white text-[16px] font-sansMedium">
                      SUBMIT
                    </Text>
                    <ICONS.ChevronRight stroke="white" />
                  </Button>
                </View>
              )}
              {isCorrect && (
                <View className="flex items-center justify-center mt-8">
                  <Button
                    className="flex items-center justify-center gap-3 text-white max-md:w-full"
                    onPress={onNext}
                  >
                    <Text className="text-white text-[16px] font-sansMedium">
                      NEXT
                    </Text>
                    <ICONS.ChevronRight stroke="white" />
                  </Button>
                </View>
              )}
              {isWrong && (
                <View className="mt-6 flex-row items-center justify-center w-full gap-6">
                  <Button
                    className="w-[48%] text-[#806C00] border-none "
                    onPress={onNext}
                  >
                    <Text className="text-white text-[16px] font-sansMedium">
                      SKIP
                    </Text>
                  </Button>

                  <Button
                    className="flex items-center justify-center gap-3 text-white w-[48%]"
                    onPress={handleReset}
                    // disabled={!isComplete}
                  >
                    <Text className="text-white text-[16px] font-sansMedium">
                      RETRY
                    </Text>
                  </Button>
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

interface OptionButtonProps {
  label: string;
  onPress: () => void;
  selected?: boolean;
  left?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  onPress,
  selected,
  left,
}) => {
  return (
    <Pressable onPress={onPress}>
      <View className="items-center justify-center">
        {selected ? (
          <ICONS.McqOptionSelected
            width={scaleWidth(135)}
            height={scaleHeight(50)}
            style={{
              transform: [{ rotateY: left ? '0deg' : '180deg' }],
            }}
          />
        ) : (
          <ICONS.McqOption
            width={scaleWidth(135)}
            height={scaleHeight(50)}
            style={{
              transform: [{ rotateY: left ? '0deg' : '180deg' }],
            }}
          />
        )}
        <Text className="absolute text-white  font-sansMedium break-words text-center whitespace-normal">
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

interface IQuizScreen {
  handleNext?: () => void;
  selectedAnswers?: number[];
}

type Question =
  | {
      difficulty: string;
      type: string;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }
  | undefined;

const MCQ = ({
  currentQuestion,
  onOptionSelect,
  selected,
  isWrong,
  isCorrect,
}: {
  currentQuestion: Question;
  onOptionSelect: (selected: string) => void;
  selected: string;
  isWrong: boolean;
  isCorrect: boolean;
}) => {
  return (
    <View className="flex-1 bg-[#265828] p-4 rounded-[20px] border-[3px] border-[#337535] my-6">
      <View className="flex-1 rounded-3xl overflow-hidden">
        <View className="flex-1 justify-between p-6">
          <Text className="text-white text-[16px] font-sansSemiBold text-center font-semibold leading-[1.5] mt-4">
            {currentQuestion?.question}
          </Text>

          {/* Options */}
          <View className="mt-10">
            <View className=" flex-wrap flex-row mb-6 gap-1">
              {currentQuestion?.options?.map((option, optionIndex) => {
                const isSelected = option === selected;

                return (
                  <OptionButton
                    key={optionIndex}
                    left={optionIndex % 2 === 0}
                    label={option}
                    selected={isSelected}
                    onPress={() => onOptionSelect(option)}
                  />
                );
              })}
            </View>
          </View>
          {(isCorrect || isWrong) && (
            <>
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
                    <ICONS.Bulb stroke={'white'} width={20} height={20} />
                  )}
                  <Text className="text-[16px] font-sansMedium text-white">
                    {isCorrect ? 'Great Job!' : 'Hint:'}
                  </Text>
                </View>
                <Text className="text-[16px] font-sansMedium text-white mt-2">
                  {isCorrect
                    ? 'Keep going, you’re doing amazing!'
                    : 'Almost there, try again. Here’s a hint… ' +
                      currentQuestion?.explanation}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const FillInOption = ({
  label,
  onPress,
  selected,
  isCorrect,
  isWrong,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
}) => {
  return (
    <Pressable
      className={twMerge(
        'bg-white h-[72px] rounded-[12px] w-[48%] items-center justify-center mb-5',
        selected && 'bg-[#A6D7A8] border-4 border-[#88CA8A]',
        isCorrect && selected && 'border-4 border-[#88CA8A] bg-[#3F9243]',
        isWrong && selected && 'border-4 border-[#DE21214D] bg-white',
      )}
      onPress={onPress}
    >
      <Text className="absolute text-dark text-[16px]  font-sansSemiBold break-words text-center whitespace-normal">
        {label}
      </Text>
    </Pressable>
  );
};

const FillIn = ({
  onNext,
  currentQuestion,
  onOptionSelect,
  selected,
  isWrong,
  isCorrect,
}: {
  onNext: () => void;
  currentQuestion: Question;
  onOptionSelect: (selected: string) => void;
  selected: string;
  isWrong: boolean;
  isCorrect: boolean;
}) => {
  return (
    <View className="flex-1 bg-[#265828] p-4 rounded-[20px] border-[3px] border-[#337535] my-6">
      <View className="flex-1 rounded-3xl overflow-hidden">
        <View className="flex-1 justify-between p-6">
          <View className="bg-[#FFFFFF1A] border-[#6ABC6D] border rounded-[12px] p-5">
            <Text className="text-[16px] font-sansSemiBold text-white ">
              {currentQuestion?.question}
            </Text>
          </View>
          <View className="border border-[#D3D2D333] mt-8" />

          <View className="mt-10">
            <View className="flex-row flex-wrap  mb-6 justify-between">
              {currentQuestion?.options?.map((option) => {
                const isSelected = option === selected;
                return (
                  <FillInOption
                    key={option}
                    selected={isSelected}
                    isCorrect={isCorrect}
                    isWrong={isWrong}
                    label={option}
                    onPress={isWrong ? () => {} : () => onOptionSelect(option)}
                  />
                );
              })}
            </View>
          </View>
          {(isCorrect || isWrong) && (
            <>
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
                    <ICONS.Bulb stroke={'white'} width={20} height={20} />
                  )}
                  <Text className="text-[16px] font-sansMedium text-white">
                    {isCorrect ? 'Great Job!' : 'Hint:'}
                  </Text>
                </View>
                <Text className="text-[16px] font-sansMedium text-white mt-2">
                  {isCorrect
                    ? 'Keep going, you’re doing amazing!'
                    : 'Almost there, try again. Here’s a hint… ' +
                      currentQuestion?.explanation}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

type AssessmentScoreProps = {
  score: number;
  totalScore: number;
  xp: number;
  retry: boolean;
  quizType: 'mid' | 'end';
  onNext: () => void;
  onRepeat: () => void;
  isPrevResult: boolean;
};

const Reward: FC<AssessmentScoreProps> = ({
  score,
  totalScore,
  xp,
  retry,
  quizType,
  onNext,
  onRepeat,
  isPrevResult,
}) => {
  const { data } = useKidProfile();

  const targetScenario = useMemo(() => {
    return getScenario(score, totalScore, retry, quizType);
  }, [score, totalScore, retry, quizType]);
  return (
    <View className="flex-1 bg-[#265828] p-6 my-6 rounded-[20px] items-center">
      <View className="items-center flex-row gap-2.5">
        <ICONS.PartyPopper />
        <Text className="text-[20px] text-center text-white font-sansSemiBold">
          {targetScenario?.title}, {data?.name}!
        </Text>
      </View>
      <Text className="text-[16px] font-sansSemiBold text-white text-center mt-2">
        {targetScenario?.desc}
      </Text>
      <View className="bg-[#FFFFFF26] rounded-[12px] py-5 px-4 w-full my-9">
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
            <ICONS.Check />
          </View>
          <View>
            <Text className="text-dark font-sans">Score</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              {score}/{totalScore}
            </Text>
          </View>
        </View>
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#C821DE1A] items-center justify-center">
            <ICONS.Award />
          </View>
          <View>
            <Text className="text-dark font-sans">Badge Earned</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              Learner
            </Text>
          </View>
        </View>
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#D5B3001A] items-center justify-center">
            <ICONS.Star2 width={20} height={20} />
          </View>
          <View>
            <Text className="text-dark font-sans">XP Earned</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              +{xp}
            </Text>
          </View>
        </View>
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#D5B3001A] items-center justify-center">
            <ICONS.Star2 width={20} height={20} />
          </View>
          <View>
            <Text className="text-dark font-sans">Total XP</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              {isPrevResult ? data?.totalXp : (data?.totalXp || 0) + (xp || 0)}
            </Text>
          </View>
        </View>
      </View>
      <Button
        onPress={onNext}
        className=" gap-3 bg-[#337535] border-[#265828] border border-b-4 w-full mb-4"
      >
        <Text className="text-[#FFFFFF] text-[16px] font-sansSemiBold">
          NEXT LESSON
        </Text>
        <ICONS.ChevronRight stroke={'#FFFFFF'} />
      </Button>
      <Button
        onPress={onRepeat}
        className=" gap-3 bg-[#FFEB80] border-[#D5B300] border border-b-4 w-full "
      >
        <Text className="text-[#806C00] text-[16px] font-sansSemiBold">
          RETAKE QUIZ
        </Text>
      </Button>
    </View>
  );
};

const loadingMessages = [
  'Gathering fun facts and stories...',
  'Thinking up awesome questions...',
  'Adding a little challenge and curiosity...',
  'Sprinkling in some learning magic ✨',
  'Your quiz adventure is almost ready! 🚀',
];

export const QuizLoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messageIndex >= loadingMessages.length - 1) return;

    const timer = setTimeout(() => {
      setMessageIndex((prev) => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [messageIndex]);

  return (
    <View className="flex flex-col items-center w-full px-4">
      <View className="bg-white rounded-xl p-6 mb-8">
        <Skeleton className="h-6 w-[260px] rounded-full" />
      </View>

      <View className="bg-white w-full p-6 rounded-[20px]">
        <Skeleton className="h-6 w-[80%] rounded-full mb-2" />
        <Skeleton className="h-6 w-full rounded-full mb-2" />
        <Skeleton className="h-6 w-[80%] rounded-full mb-6" />

        <View className="flex-row justify-between my-6">
          <Skeleton className="rounded-[12px] w-[70px] h-[70px]" />
          <Skeleton className="rounded-[12px] w-[70px] h-[70px]" />
          <Skeleton className="rounded-[12px] w-[70px] h-[70px]" />
        </View>

        <View className="w-full mt-6">
          <Skeleton className="rounded-[12px] w-full h-[80px] mb-4" />
          <Skeleton className="rounded-[12px] w-full h-[80px] mb-4" />
        </View>

        <View className="items-center py-10">
          <Animated.Text
            key={messageIndex}
            entering={FadeIn.duration(600)}
            exiting={FadeOut.duration(600)}
            className="text-center text-[14px] font-semibold text-gray-700 px-4"
          >
            {loadingMessages[messageIndex]}
          </Animated.Text>
        </View>
      </View>

      <View className="mt-8">
        <Skeleton className="h-6 w-[260px] rounded-full" />
      </View>
    </View>
  );
};
export default Quiz;
