import { getSeriesChapters } from '@/actions/curriculum';
import {
  getReadingProgress,
  updateLessonProgress,
  updatePLProgress,
} from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import Button, { SecondaryButton } from '@/components/Button';
import Journal from '@/components/kid/Journal';
import LearnCore from '@/components/kid/LearnCore';
import Quiz from '@/components/kid/Quiz';
import ReadMode from '@/components/kid/ReadMode';
import Reward from '@/components/kid/Reward';
import ScenarioQuiz from '@/components/kid/ScenarioQuiz';
import XpDropdown from '@/components/kid/XpDropdown';
import { getActiveLesson, PLAY_LEARN_PROGRESS_KEY } from '@/constants';
import useChapterPages from '@/hooks/useChapterPages';
import useKidLearningOverview from '@/hooks/useKidLearning';
import useKidProfile from '@/hooks/useKidProfile';
import useSeriesChapterPages from '@/hooks/useSeriesChapterPages';
import { getData, storeData } from '@/lib/storage';
import { AssignedSeries } from '@/types';
import {
  formatActivityPages,
  getPLProgress,
  handleParams,
  pageMap,
} from '@/utils/kid';
import { invalidateQueries } from '@/utils/query';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { twMerge } from 'tailwind-merge';
import Activity from './Activity';
import CurriculumBar from './CurriculumBar';

const Playground = () => {
  const { book, series, chapterId, lessonId, mode, page } =
    useLocalSearchParams();

  const [openXp, setOpenXp] = useState(false);
  const { data: profile } = useKidProfile();
  const startTimeRef = useRef<number>(Date.now());
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);
  const [openSwitch, setOpenSwitch] = useState(false);

  const { data } = useKidLearningOverview();
  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['series-chapters', series],
    queryFn: () => getSeriesChapters(series! as string),
    enabled: !!series, // replaces SWR null check
  });

  const { data: allSeriesPages, isLoading: isLoadingSeriesPage } =
    useSeriesChapterPages(series! as string);

  const { data: chapterData } = useChapterPages(chapterId as string);

  const { data: readingProgress, isLoading: isReadingProgressLoading } =
    useQuery({
      queryKey: ['reading-progress'],
      queryFn: getReadingProgress,
    });

  const getActivityType = (currentPage: string | null): string => {
    if (currentPage === 'learn') return 'Lesson';
    if (currentPage === 'mid' || currentPage === 'end') return 'Assignment';
    if (currentPage === 'scenario' || currentPage === 'journal')
      return 'Mission';
    return 'Lesson';
  };

  const newActivityPages = useMemo(() => {
    if (!chapters) return;
    return formatActivityPages(chapters);
  }, [chapters]);

  // Get current progress for play mode
  const getCurrentPlayProgress = async () => {
    if (!chapterId) return 0;
    const p = await getData(PLAY_LEARN_PROGRESS_KEY + chapterId);
    return parseInt(p as string);
  };

  const savePlayProgress = async (pageNumber: number) => {
    if (!chapterId) return;
    const currentProgress = await getCurrentPlayProgress();
    if (pageNumber > currentProgress) {
      await storeData(
        PLAY_LEARN_PROGRESS_KEY + chapterId,
        pageNumber.toString(),
      );
    }
  };

  const baseChapter = allSeriesPages?.find((s) => s._id === chapterId);

  const [openSidebar, setOpenSidebar] = useState(false);

  const activePage = useMemo(() => {
    if (page && data) {
      return chapterData?.pages?.find((p) => p.index.toString() === page);
    }
    return null;
  }, [page, data]);

  const progress = useMemo(() => {
    if (mode === 'play') {
      return pageMap?.[page! as string] / 8;
    } else {
      return (activePage?.index || 0) / (chapterData?.pages?.length || 1);
    }
  }, [mode, activePage, data, page]);

  const targetSeries = useMemo(() => {
    if (!data) return;

    return (
      data
        ?.find((d) => d.bookId?._id === book)
        ?.assignedSeries?.find((s) => s.seriesId?._id === series) ||
      ({} as AssignedSeries)
    );
  }, [book, series, data]);

  const pieData = useMemo(() => {
    return [
      { value: (progress || 0) * 100, color: '#3F9243' },
      { value: 100 - (progress || 0) * 100, color: '#DBEFDC' },
    ];
  }, [progress]);

  const updateCurrentLessonProgress = async (activityType: string) => {
    if (!lessonId || !chapterId) return;

    const totalTimeSpent = accumulatedTime;

    try {
      await updateLessonProgress(
        lessonId as string,
        activityType,
        [],
        totalTimeSpent,
      );
      invalidateQueries('reading-progress');
    } catch (error) {
      console.log('error');
    }

    setAccumulatedTime(0);
  };

  const ActiveLesson: ReturnType<typeof getActiveLesson> | null =
    useMemo(() => {
      if (!chapterId || !book || !lessonId || !series) {
        return null;
      }
      return getActiveLesson({
        bookId: book as string,
        seriesId: series as string,
        lessonId: lessonId as string,
        chapterId: chapterId as string,
      });
    }, [series, book, lessonId, chapterId]);

  const targetChapterData = useMemo(() => {
    return allSeriesPages?.find((sp) => sp._id === chapterId) || null;
  }, [chapterId, allSeriesPages]);

  const targetLessonData = useMemo(() => {
    return chapters?.find((ch) => ch._id === chapterId) || null;
  }, [chapterId, chapters]);

  const handleNext = async () => {
    const isMidOrEnd = page === 'mid' || page === 'end';
    const activityType = isMidOrEnd ? 'Assignment' : 'Lesson';

    if (mode === 'play' && chapterId && lessonId) {
      await updateCurrentLessonProgress(activityType);
      if (page === 'mid') savePlayProgress(5);
      if (page === 'end') savePlayProgress(8);
    }

    if (mode === 'read' && chapterId) {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      invalidateQueries('reading-progress');
    }

    if (mode === 'read') {
      const data = targetChapterData;
      if (!data?.pages.length) return;

      const medianIndex = Math.floor(data.pages.length / 2);
      const nextChapter = allSeriesPages?.[data.chapterIndex || 0];

      if (page === 'end') {
        if (nextChapter?._id) {
          handleParams([
            ['chapterId', nextChapter._id],
            ['page', '1'],
          ]);
        }
        return;
      }

      if (page === 'mid') {
        const newIndex = medianIndex + 1;
        handleParams([['page', newIndex.toString()]]);
      }
    } else if (mode === 'play') {
      const data = targetLessonData;
      if (!data?.lessons.length) return;

      const medianIndex = Math.floor(data.lessons.length / 2);
      const nextChapter = allSeriesPages?.[data.index || 0];

      if (page === 'end') {
        if (nextChapter?._id) {
          handleParams([
            ['chapterId', nextChapter._id],
            ['page', '1'],
          ]);
        }
        return;
      }

      if (page === 'mid') {
        const newIndex = medianIndex + 1;
        handleParams([
          ['page', newIndex.toString()],
          ['lessonId', ActiveLesson?.nextlesson || ''],
        ]);
      }
    }
  };

  const onNext = async () => {
    const completedPage = await getData(PLAY_LEARN_PROGRESS_KEY + chapterId);

    const currentProgress = getPLProgress(
      readingProgress?.find((r) => r.seriesId === series)!,
      chapterId! as string,
    );

    switch (page) {
      case 'mid':
        if (currentProgress === 3) {
          await updatePLProgress(chapterId! as string, 4);
          invalidateQueries('reading-progress');
        }
        return handleParams([
          ['lessonId', 'scenario'],
          ['page', 'scenario'],
        ]);
      case 'end':
        if (completedPage === '5') {
          storeData(PLAY_LEARN_PROGRESS_KEY + chapterId, page);
        }
        return handleParams([
          ['lessonId', 'rewards'],
          ['page', 'rewards'],
        ]);

      case 'journal':
        if (currentProgress === 5) {
          await updatePLProgress(chapterId! as string, 6);
          invalidateQueries('reading-progress');
        }
        return handleParams([
          ['lessonId', newActivityPages?.[0]?.lessons?.[5]?._id || ''],
          ['page', '5'],
        ]);

      case 'learn':
        if (currentProgress === 2) {
          await updatePLProgress(chapterId! as string, 3);
          invalidateQueries('reading-progress');
        }
        return handleParams([
          ['lessonId', 'mid'],
          ['page', 'mid'],
        ]);

      case 'scenario':
        if (currentProgress === 4) {
          await updatePLProgress(chapterId! as string, 5);
          invalidateQueries('reading-progress');
        }
        return handleParams([
          ['lessonId', 'journal'],
          ['page', 'journal'],
        ]);

      case 'rewards':
        if (currentProgress === 7) {
          await updatePLProgress(chapterId! as string, 8);
          invalidateQueries('reading-progress');
        }
        return setOpenSwitch(true);

      default:
        if (Number(page) === 1) {
          if (!currentProgress || currentProgress === 1) {
            await updatePLProgress(chapterId! as string, 2);
            invalidateQueries('reading-progress');
          }
          return handleParams([
            ['lessonId', 'learn'],
            ['page', 'learn'],
          ]);
        }
        if (Number(page) === 5) {
          if (currentProgress === 6) {
            await updatePLProgress(chapterId! as string, 7);
            invalidateQueries('reading-progress');
          }
          return handleParams([
            ['lessonId', 'end'],
            ['page', 'end'],
          ]);
        }
    }
  };

  const onPrev = () => {
    switch (page) {
      case 'mid':
        return handleParams([
          ['lessonId', 'learn'],
          ['page', 'learn'],
        ]);
      case 'end':
        return handleParams([
          ['lessonId', newActivityPages?.[0]?.lessons?.[5]?._id || ''],
          ['page', '5'],
        ]);

      case 'journal':
        return handleParams([
          ['lessonId', 'scenario'],
          ['page', 'scenario'],
        ]);

      case 'learn':
        return handleParams([
          ['lessonId', newActivityPages?.[0]?.lessons?.[0]?._id || ''],
          ['page', '1'],
        ]);

      case 'scenario':
        return handleParams([
          ['lessonId', 'mid'],
          ['page', 'mid'],
        ]);

      case 'rewards':
        return handleParams([
          ['lessonId', 'end'],
          ['page', 'end'],
        ]);

      default:
        if (Number(page) === 1) {
          return {};
        }
        if (Number(page) === 5) {
          return handleParams([
            ['lessonId', 'journal'],
            ['page', 'journal'],
          ]);
        }
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'mid':
      case 'end':
        return (
          <div className="md:w-[65.17vw]  w-full mx-auto">
            <Quiz handleNext={onNext} readingProgress={readingProgress} />
          </div>
        );

      case 'journal':
        return <Journal onNext={onNext} />;

      case 'learn':
        return (
          <div className="md:w-4/5 w-full mx-auto">
            <LearnCore onNext={onNext} />
          </div>
        );

      case 'scenario':
        return <ScenarioQuiz onNext={onNext} onPrev={onPrev} />;

      case 'rewards':
        return <Reward />;

      default:
        return <Activity chapters={chapters} onNext={onNext} />;
    }
  };

  return (
    <ScrollView
      className="bg-[#DBEFDC] flex-1 pb-10 "
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10"
    >
      <View
        style={{ paddingTop: STAUS_BAR_HEIGHT + 20 }}
        className=" px-6 flex-row gap-8 items-center pb-6 border-b border-b-[#DBEFDC] bg-white"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 bg-[#337535] items-center justify-center rounded-[12px]"
        >
          <ICONS.ChevronLeft strokeWidth={4} stroke={'white'} />
        </Pressable>
        <View className="flex-row items-center flex-1 gap-4 justify-around">
          <View className="flex-row items-center gap-3 i">
            <PieChart
              donut
              textColor="black"
              radius={20}
              textSize={20}
              data={pieData}
              innerRadius={15}
            />
            <Text className="text-[18px] text-[#265828] font-sansSemiBold">
              {(progress * 100)?.toFixed(0)}%
            </Text>
          </View>
          <Pressable
            onPress={() => setOpenXp(true)}
            className="flex-row items-center border border-[#D3D2D333] gap-2.5 py-2 px-2.5 rounded-[5px]"
          >
            <ICONS.Star3 />
            <Text className="text-[#004D99] text-[18px]  font-sansSemiBold">
              {profile?.totalXp}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => setOpenSidebar(true)}
          className="w-12 h-12 bg-[#337535] items-center justify-center rounded-full"
        >
          <ICONS.Menu />
        </Pressable>
      </View>
      <View className="py-4 px-6 bg-white">
        <Text className="text-[18px] font-sansSemiBold text-[#337535]">
          Chapter {baseChapter?.chapterIndex}: {baseChapter?.chapterTitle}
        </Text>
      </View>
      {page !== 'rewards' && (
        <View className="items-end">
          <View className=" bg-[#DBEFDC] p-6">
            <Pressable
              onPress={() => {
                handleParams([['mode', mode === 'read' ? 'play' : 'read']]);
              }}
              className="relative flex-row items-center gap-2 py-2 px-3"
            >
              <LinearGradient
                colors={['#D5B300', '#3F9243']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  zIndex: 0,
                  borderRadius: 20,
                }}
              />
              <ICONS.Curriculum fill={'white'} />
              <Text className="text-white font-sansSemiBold">
                SWITCH TO {mode === 'read' ? 'PLAY & LEARN' : 'READ MODE'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      {/* Component Block */}
      <View className={twMerge('px-6', page === 'rewards' && 'px-0')}>
        {mode === 'read' ? (
          <div className="">
            {page === 'mid' || page === 'end' ? (
              <div className="md:w-4/5 w-full mx-auto">
                <Quiz
                  handleNext={handleNext}
                  readingProgress={readingProgress}
                />
              </div>
            ) : (
              <ReadMode
                isLoading={isLoadingSeriesPage}
                allSeriesPages={allSeriesPages!}
                page={page as string}
                getActivityType={getActivityType}
                readingProgress={readingProgress}
              />
            )}
          </div>
        ) : (
          <View className="w-full">
            {renderPage()}

            {page !== 'scenario' &&
              page !== 'learn' &&
              page !== 'mid' &&
              page !== 'journal' &&
              page !== 'end' && (
                <View className="flex justify-center mt-5 gap-4 items-center">
                  {Number(page) !== 1 && (
                    <SecondaryButton onPress={() => onPrev()}>
                      <ICONS.ChevronLeft stroke="#806C00" strokeWidth="3" />
                      <Text className=" text-[#806C00] font-sansSemiBold text-[16px]">
                        PREVIOUS
                      </Text>
                    </SecondaryButton>
                  )}
                  <Button
                    className="text-xl font-semibold lg:px-16 max-lg:flex-1 flex items-center justify-center gap-2 z-100"
                    onPress={() => onNext()}
                  >
                    <Text className="text-white font-sansSemiBold text-[16px]">
                      NEXT
                    </Text>
                    <View className="rotate-270">
                      <ICONS.ChevronDown stroke="white" strokeWidth="3" />
                    </View>
                  </Button>
                </View>
              )}
          </View>
        )}
      </View>
      {/* Component Block */}
      <CurriculumBar
        allSeriesPages={allSeriesPages!}
        series={targetSeries!}
        chapters={chapters!}
        isLoadingChapters={isLoadingChapters}
        readingProgress={readingProgress}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
      <XpDropdown open={openXp} onClose={() => setOpenXp(false)} />
    </ScrollView>
  );
};

export default Playground;
