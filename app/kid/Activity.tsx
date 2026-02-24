import { getActiveLesson } from '@/constants';
import { Chapter } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

const Activity = ({
  chapters,
  onNext,
}: {
  chapters: Chapter[] | undefined;
  onNext: () => void;
}) => {
  const {
    book,
    series,
    chapterId,
    lessonId,
    mode,
    page: pageIndex = 1,
  } = useLocalSearchParams();

  const [openSwitchModal, setOpenSwitchModal] = useState(false);

  const data = useMemo(() => {
    return chapters?.find((ch) => ch._id === chapterId);
  }, [chapterId, chapters]);

  const activeLesson = useMemo(() => {
    if (!data) return null;
    return data.lessons.find((d) => d.index.toString() === pageIndex) || null;
  }, [data, pageIndex]);

  // console.log("activeLesson", activeLesson);

  const isActiveScene = (targetLessonId: string, targetChapterId: string) => {
    return lessonId === targetLessonId && chapterId === targetChapterId;
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
    }, [series, book, lessonId, chapterId, pageIndex]);

    console.log({cp:ActiveLesson?.component, series, book, lessonId, chapterId, pageIndex })

  return (
    <View className="w-full h-[65vh]  mb-[5px] rounded-[20px] bg-[#265828] relative">
      {ActiveLesson?.component ? (
        <ActiveLesson.component onNext={onNext} />
      ) : null}
    </View>
  );
};

export default Activity;
