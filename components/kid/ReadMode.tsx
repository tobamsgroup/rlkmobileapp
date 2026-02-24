import { updateReadingProgress } from '@/actions/kid';
import { ChapterPage as ChapterPageType, ReadingProgressProps } from '@/types';
import { handleParams } from '@/utils/kid';
import { invalidateQueries } from '@/utils/query';
import { useLocalSearchParams } from 'expo-router';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { View } from 'react-native';
import Skeleton from '../Skeleton';
import { Chapter } from './Chapter';

const ReadMode = ({
  isLoading,
  allSeriesPages,
  page,
  getActivityType,
  readingProgress,
}: {
  isLoading: boolean;
  allSeriesPages: {
    _id: string;
    chapterTitle: string;
    chapterIndex: number;
    pages: ChapterPageType[];
  }[];
  page: string | null;
  readingProgress: ReadingProgressProps[] | undefined;
  getActivityType: (page: string | null) => string;
}) => {
  const {
    book,
    series,
    chapterId,
    lessonId,
    mode,
    page: pageIndex = 1,
  } = useLocalSearchParams();

  const [openHelper, setOpenHelper] = useState(true);
  const [helper, setHelper] = useState('');
  const [openOnboarding, setOpenOnboarding] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTodayRef = useRef<number>(0);
  const [tracking, startTransition] = useTransition();
  const startTimeRef = useRef<number>(Date.now());
  const [openSwitch, setOpenSwitch] = useState(false);
  const [openSwitchModal, setOpenSwitchModal] = useState(false);

  const currentBookProgress = useMemo(() => {
    if (!readingProgress && !series) return null;
    const currentSeries = readingProgress?.find((r) => r.seriesId === series);
    const currentChapter = currentSeries?.chapters?.find(
      (c) => c.chapterId === chapterId,
    );
    return currentChapter;
  }, [readingProgress, series]);

  const taskId = chapterId;
  const baseTitle =
    allSeriesPages?.find((s) => s._id === chapterId)?.chapterTitle ||
    'Reading Chapter';

  const taskType = getActivityType(page);
  const todayKey = new Date().toISOString().split('T')[0];

  //   const saveTimeToStorage = (dateKey: string, minutes: number) => {
  //     localStorage.setItem(
  //       `readingTime_${dateKey}`,
  //       JSON.stringify({ minutes, lastSaved: Date.now() }),
  //     );
  //   };

  //   const clearTimeFromStorage = (dateKey: string) => {
  //     localStorage.removeItem(`readingTime_${dateKey}`);
  //   };

  //   useEffect(() => {
  //     const saved = localStorage.getItem(`readingTime_${todayKey}`);
  //     if (saved) {
  //       const parsed = JSON.parse(saved);
  //       accumulatedTodayRef.current = parsed.minutes ?? 0;
  //     }
  //   }, [todayKey]);

  //   const sendReadingTime = (
  //     dateKey: string,
  //     minutes: number,
  //     taskName: string,
  //   ) => {
  //     if (minutes <= 0 || !taskId) return;

  //     startTransition(async () => {
  //       try {
  //         await trackKidReadingTime({
  //           taskId: taskId!,
  //           taskName,
  //           taskType,
  //           timeSpentMinutes: Math.round(minutes),
  //         });

  //         clearTimeFromStorage(dateKey);
  //         toast.success(`Reading time saved for ${dateKey}`);
  //       } catch (error: any) {
  //         if (error?.response?.status === 401) {
  //           toast.error('Unauthorized – please log in again');
  //         } else if (error?.response?.data?.message) {
  //           toast.error(error.response.data.message);
  //         } else {
  //           toast.error('Failed to save reading time – will retry later');
  //         }
  //       }
  //     });
  //   };

  //   useEffect(() => {
  //     if (!taskId) return;

  //     const now = new Date();
  //     const currentDay = now.toISOString().split('T')[0];

  //     for (let i = 1; i <= 30; i++) {
  //       const pastDate = new Date();
  //       pastDate.setDate(now.getDate() - i);
  //       const pastKey = pastDate.toISOString().split('T')[0];

  //       const saved = localStorage.getItem(`readingTime_${pastKey}`);
  //       if (!saved) continue;

  //       const { minutes } = JSON.parse(saved);
  //       if (minutes <= 0) {
  //         clearTimeFromStorage(pastKey);
  //         continue;
  //       }

  //       const weekday = new Intl.DateTimeFormat('en-US', {
  //         weekday: 'long',
  //       }).format(pastDate);
  //       const taskName = `${baseTitle} – ${weekday}`;

  //     }

  //     const yesterday = new Date();
  //     yesterday.setDate(now.getDate() - 1);
  //     const yesterdayKey = yesterday.toISOString().split('T')[0];

  //     const yesterdaySaved = localStorage.getItem(`readingTime_${yesterdayKey}`);
  //     if (yesterdaySaved) {
  //       const { minutes } = JSON.parse(yesterdaySaved);
  //       if (minutes > 0) {
  //         const weekday = new Intl.DateTimeFormat('en-US', {
  //           weekday: 'long',
  //         }).format(yesterday);
  //         const taskName = `${baseTitle} – ${weekday}`;
  //       }
  //     }
  //   }, [taskId, baseTitle, todayKey]);

  // Persist Every 30 Seconds, Send Next Day After Midnight
  //   useEffect(() => {
  //     if (isLoading || !chapterId) return;

  //     let startTime = Date.now();

  //     const handleVisibilityChange = () => {
  //       if (document.visibilityState === 'hidden') {
  //         const sessionMinutes = (Date.now() - startTime) / 1000 / 60;
  //         accumulatedTodayRef.current += sessionMinutes;
  //         saveTimeToStorage(todayKey, accumulatedTodayRef.current);
  //         startTime = Date.now();
  //       } else {
  //         startTime = Date.now();
  //       }
  //     };

  //     const handleInterval = () => {
  //       if (document.visibilityState !== 'visible') return;

  //       const sessionMinutes = (Date.now() - startTime) / 1000 / 60;
  //       accumulatedTodayRef.current += sessionMinutes;
  //       startTime = Date.now();

  //       if (Math.floor(accumulatedTodayRef.current * 60) % 30 === 0) {
  //         saveTimeToStorage(todayKey, accumulatedTodayRef.current);
  //       }
  //     };

  //     intervalRef.current = setInterval(handleInterval, 1000);
  //     document.addEventListener('visibilitychange', handleVisibilityChange);

  //     return () => {
  //       if (intervalRef.current) clearInterval(intervalRef.current);
  //       document.removeEventListener('visibilitychange', handleVisibilityChange);

  //       const sessionMinutes = (Date.now() - startTime) / 1000 / 60;
  //       const total = accumulatedTodayRef.current + sessionMinutes;
  //       if (total > 0) {
  //         saveTimeToStorage(todayKey, total);
  //       }
  //     };
  //   }, [isLoading, chapterId, todayKey]);

  const data = useMemo(() => {
    return allSeriesPages?.find((sp) => sp._id === chapterId) || null;
  }, [chapterId, allSeriesPages]);

  useEffect(() => {
    if (!pageIndex) handleParams([['page', '1']]);
  }, [pageIndex, handleParams]);

  const activePage = useMemo(() => {
    if (!data) return null;
    return data.pages.find((d) => d.index.toString() === pageIndex) || null;
  }, [pageIndex, data]);

  const handlePageIndex = async (type: 'prev' | 'next') => {
    if (!data?.pages.length) return;
    if (type === 'prev') {
      const previousChapter = allSeriesPages?.[(data.chapterIndex || 2) - 2];
      if (activePage?.index === 1 && previousChapter) {
        handleParams([
          ['chapterId', previousChapter._id],
          ['page', previousChapter?.pages?.length?.toString()],
        ]);
        return;
      }
      const newIndex = (activePage?.index || 2) - 1;
      handleParams([['page', newIndex.toString()]]);
    }
    if (type === 'next') {
      const nextChapter = allSeriesPages?.[data.chapterIndex || 0];
      if (activePage?.index === data?.pages.length && nextChapter) {
        await updateReadingProgress(nextChapter._id, 1);
        setOpenSwitch(true);
        return;
      }
      const newIndex = (activePage?.index || 0) + 1;
      if (newIndex > (currentBookProgress?.currentPageIndex || 0)) {
        // const timeSpent = Math.floor(
        //   (Date.now() - startTimeRef.current) / 1000
        // );

        // const activityType = getActivityType(page);
        // await updateLessonProgress(lessonId!, activityType, [], timeSpent);
        await updateReadingProgress(chapterId! as string, newIndex);
      }
      invalidateQueries('reading-progress');
      handleParams([['page', newIndex.toString()]]);
    }
  };

  const moveToNextChapter = () => {
    if (!data?.pages.length) return;
    const nextChapter = allSeriesPages?.[data.chapterIndex || 0];
    handleParams([
      ['chapterId', nextChapter._id],
      ['page', '1'],
    ]);
  };

  const { canGoPrev, canGoNext } = useMemo(() => {
    let canGoNext = true;
    let canGoPrev = true;
    if (!allSeriesPages) return { canGoNext: false, canGoPrev: false };
    if (allSeriesPages?.[0]?._id === chapterId && pageIndex === '1')
      if (allSeriesPages?.[0]?._id === chapterId && pageIndex === '1')
        canGoPrev = false;
    // if (
    //   allSeriesPages?.[allSeriesPages?.length - 1]?._id === chapterId &&
    //   pageIndex === activePage?.index?.toString()
    // ) {
    //   canGoNext = false;
    // }
    return { canGoNext, canGoPrev };
  }, [pageIndex, chapterId, allSeriesPages, activePage]);

  //   useEffect(() => {
  //     const hasSeen = localStorage.getItem('hasSeenOnboarding');
  //     if (!hasSeen) {
  //       setOpenOnboarding(true);
  //       localStorage.setItem('hasSeenOnboarding', 'true');
  //     }
  //   }, []);

  return (
    <View className="relative z-10">
      {isLoading && (
        <View className="flex-1 bg-[#FAFDFF] p-8 rounded-[12px]">
          <Skeleton className="mb-10 w-3/4" />
          <Skeleton className="h-40 rounded-[12px] mb-4" />
          <Skeleton className="mb-2" />
          <Skeleton className="mb-2" />
          <Skeleton className="mb-8" />
          <Skeleton className="mb-2" />
          <Skeleton className="mb-2" />
          <Skeleton className="mb-8" />
          <Skeleton className="h-20 rounded-full" />
        </View>
      )}

      {!isLoading && (
        <Chapter
          handlePageIndex={handlePageIndex}
          canGoNext={canGoNext}
          canGoPrev={canGoPrev}
          data={activePage}
          title={data?.chapterTitle}
        />
      )}
    </View>
  );
};

export default ReadMode;
